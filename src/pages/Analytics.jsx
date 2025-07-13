"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Eye,
  Users,
  Play,
  CheckCircle,
  Clock,
  MousePointer,
  MessageSquare,
  Smartphone,
  Monitor,
  Target,
} from "lucide-react";

import { useParams } from "react-router-dom";
import useAnalytics from "../hooks/useAnalytics.js";

const AnalyticsPage = () => {
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAllCTAs, setShowAllCTAs] = useState(false);
  const [questionFilter, setQuestionFilter] = useState("all");
  const [ctaFilter, setCtaFilter] = useState("all");
  const [questionSearch, setQuestionSearch] = useState("");
  const [ctaSearch, setCtaSearch] = useState("");
  const [error, setError] = useState(null);

  const params = useParams();
  const videoId = params?.id;

  const { analyticsData, loading, getVideoAnalyticsSummary } = useAnalytics();

  useEffect(() => {
    if (videoId) {
      getVideoAnalyticsSummary(videoId, "30d");
    }
  }, [videoId]);

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-${color}-100`}>
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
          <p className="text-gray-600 mt-2">
            Please check the video ID or try again later.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData || !analyticsData.success || !analyticsData.summary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      </div>
    );
  }

  const { summary } = analyticsData;
  const { overview, exitPoints, engagement, devices, cta, feedback } = summary;

  // Pagination and filtering logic
  const ITEMS_PER_PAGE = 6;
  const MAX_INITIAL_ITEMS = 4;

  // Filter and search functions
  const filterQuestions = (questions) => {
    if (!questions) return [];

    let filtered = questions.filter((q) =>
      q.question.toLowerCase().includes(questionSearch.toLowerCase())
    );

    if (questionFilter !== "all") {
      filtered = filtered.filter((q) => {
        switch (questionFilter) {
          case "high-accuracy":
            return q.accuracy >= 80;
          case "medium-accuracy":
            return q.accuracy >= 50 && q.accuracy < 80;
          case "low-accuracy":
            return q.accuracy < 50;
          case "single-choice":
            return q.optionType === "single-choice";
          case "multiple-choice":
            return q.optionType === "multiple-choice";
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filterCTAs = (ctas) => {
    if (!ctas) return [];

    let filtered = ctas.filter((cta) =>
      cta.ctaId.toLowerCase().includes(ctaSearch.toLowerCase())
    );

    if (ctaFilter !== "all") {
      filtered = filtered.filter((cta) => {
        switch (ctaFilter) {
          case "high-conversion":
            return cta.conversionRate >= 20;
          case "medium-conversion":
            return cta.conversionRate >= 10 && cta.conversionRate < 20;
          case "low-conversion":
            return cta.conversionRate < 10;
          case "high-interactions":
            return cta.totalInteractions >= 10;
          case "recent":
            return (
              new Date(cta.lastInteraction) >
              new Date(Date.now() - 24 * 60 * 60 * 1000)
            );
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredQuestions = filterQuestions(summary.detailedFeedback || []);
  const filteredCTAs = filterCTAs(summary.detailedCTA || []);

  const displayedQuestions = showAllQuestions
    ? filteredQuestions
    : filteredQuestions.slice(0, MAX_INITIAL_ITEMS);

  const displayedCTAs = showAllCTAs
    ? filteredCTAs
    : filteredCTAs.slice(0, MAX_INITIAL_ITEMS);

  // Prepare chart data
  const exitPointsData = exitPoints.map((point) => ({
    time: `${Math.floor(point.second / 60)}:${(point.second % 60)
      .toString()
      .padStart(2, "0")}`,
    exits: parseInt(point.count),
  }));

  const engagementData = engagement.map((item) => ({
    level: item.level.charAt(0).toUpperCase() + item.level.slice(1),
    count: parseInt(item.count),
  }));

  const devicesData = devices.map((device) => ({
    type: device.type.charAt(0).toUpperCase() + device.type.slice(1),
    count: parseInt(device.count),
  }));

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive insights into your content performance
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                onChange={(e) =>
                  getVideoAnalyticsSummary(videoId, e.target.value)
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30d">Last 30 days</option>
                <option value="7d">Last 7 days</option>
                <option value="24h">Last 24 hours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={overview.totalViews.toLocaleString()}
            icon={Eye}
            color="blue"
          />
          <StatCard
            title="Unique Viewers"
            value={overview.uniqueViewers.toLocaleString()}
            icon={Users}
            color="green"
          />
          <StatCard
            title="Completion Rate"
            value={`${overview.completionRate}%`}
            subtitle={`${overview.completedViews} completed`}
            icon={CheckCircle}
            color="purple"
          />
          <StatCard
            title="Avg Watch Time"
            value={`${Math.floor(overview.avgWatchTime / 60)}:${(
              overview.avgWatchTime % 60
            )
              .toFixed(0)
              .padStart(2, "0")}`}
            subtitle="minutes"
            icon={Clock}
            color="orange"
          />
          <StatCard
            title="Views per User"
            value={overview.viewsPerUser.toFixed(1)}
            icon={Target}
            color="indigo"
          />
          <StatCard
            title="Feedback Accuracy"
            value={`${feedback.accuracy}%`}
            subtitle={`${feedback.correctResponses}/${feedback.totalResponses} correct`}
            icon={MessageSquare}
            color="pink"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Exit Points Chart */}
          <ChartCard title="Exit Points Timeline">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={exitPointsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="exits"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Engagement Levels */}
          <ChartCard title="Engagement Levels">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Device Distribution and CTA Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Device Distribution */}
          <ChartCard title="Device Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={devicesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ type, percent }) =>
                    `${type} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {devicesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* CTA Performance */}
          <ChartCard title="Call-to-Action Performance">
            <div className="space-y-6">
              {cta.map((item, index) => (
                <div key={index} className="bg-gray-50 roundup-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-blue-600" />
                      <span className="font-medium capitalize">
                        {item.event}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {parseInt(item.totalCount)} total interactions
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Unique Users: {item.uniqueUsers}</span>
                    <span>•</span>
                    <span>
                      Avg per User:{" "}
                      {(
                        parseInt(item.totalCount) / parseInt(item.uniqueUsers)
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Feedback Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard title="Feedback Summary" className="lg:col-span-3">
            <div className="grid grid-cols-1 md grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {feedback.totalResponses}
                </div>
                <div className="text-sm text-blue-800">Total Responses</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {feedback.uniqueRespondents}
                </div>
                <div className="text-sm text-green-800">Unique Respondents</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {feedback.correctResponses}
                </div>
                <div className="text-sm text-purple-800">Correct Responses</div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {feedback.accuracy}%
                </div>
                <div className="text-sm text-orange-800">Accuracy Rate</div>
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Detailed Feedback Analysis */}
        {summary.detailedFeedback && summary.detailedFeedback.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 lg:mb-0">
                Question-by-Question Analysis ({filteredQuestions.length}{" "}
                questions)
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={questionFilter}
                  onChange={(e) => setQuestionFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All Questions</option>
                  <option value="high-accuracy">High Accuracy (80%+)</option>
                  <option value="medium-accuracy">
                    Medium Accuracy (50-80%)
                  </option>
                  <option value="low-accuracy">Low Accuracy (0-50%)</option>
                  <option value="single-choice">Single Choice</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {displayedQuestions.map((question, index) => (
                <ChartCard
                  key={question.questionId}
                  title={`Question ${index + 1}: ${question.question}`}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Question Type:
                      </span>
                      <span className="text-sm text-gray-600 capitalize">
                        {question.optionType.replace("-", " ")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${
                            question.accuracy >= 80
                              ? "text-green-600"
                              : question.accuracy >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {question.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {question.totalResponses}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Responses
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">
                          Correct: {question.correctResponses}
                        </span>
                        <span className="text-red-600">
                          Incorrect: {question.incorrectResponses}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            question.accuracy >= 80
                              ? "bg-green-500"
                              : question.accuracy >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${question.accuracy}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">
                        Answer Distribution:
                      </h4>
                      <div className="max-h-40 overflow-y-auto space-y-1">
                        {question.optionStats.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center justify-between p-2 bg-white border rounded"
                          >
                            <span className="text-sm text-gray-700 truncate flex-1 mr-2">
                              {option.option}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-sm font-medium text-gray-900">
                                {option.count}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  question.correctAnswers.includes(
                                    option.option
                                  )
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {question.correctAnswers.includes(option.option)
                                  ? "✓"
                                  : "○"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ChartCard>
              ))}
            </div>

            {filteredQuestions.length > MAX_INITIAL_ITEMS && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {showAllQuestions
                    ? `Show Less (${
                        filteredQuestions.length - MAX_INITIAL_ITEMS
                      } hidden)`
                    : `Show All Questions (${
                        filteredQuestions.length - MAX_INITIAL_ITEMS
                      } more)`}
                </button>
              </div>
            )}

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg">No questions found</div>
                <div className="text-sm mt-1">
                  Try adjusting your search or filter criteria
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed CTA Analysis */}
        {summary.detailedCTA && summary.detailedCTA.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 lg:mb-0">
                Call-to-Action Performance Details ({filteredCTAs.length} CTAs)
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={ctaFilter}
                  onChange={(e) => setCtaFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">All CTAs</option>
                  <option value="high-conversion">
                    High Conversion (20%+)
                  </option>
                  <option value="medium-conversion">
                    Medium Conversion (10-20%)
                  </option>
                  <option value="low-conversion">Low Conversion (0-10%)</option>
                  <option value="high-interactions">
                    High Interactions (10+)
                  </option>
                  <option value="recent">Recent (Last 24h)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedCTAs.map((cta, index) => (
                <ChartCard
                  key={cta.ctaId}
                  title={`CTA ${index + 1}`}
                  className="transform transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {cta.totalInteractions}
                        </div>
                        <div className="text-xs text-blue-800">
                          Total Interactions
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {cta.uniqueUsers}
                        </div>
                        <div className="text-xs text-green-800">
                          Unique Users
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-center">
                        <div
                          className={`text-lg font-bold ${
                            cta.conversionRate >= 20
                              ? "text-green-600"
                              : cta.conversionRate >= 10
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {cta.conversionRate}%
                        </div>
                        <div className="text-xs text-purple-800">
                          Conversion Rate
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        Event Breakdown:
                      </h4>
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {cta.stats.map((stat, statIndex) => (
                          <div
                            key={statIndex}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <span className="text-sm text-gray-700 capitalize">
                              {stat.eventType}
                            </span>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {stat.count} events
                              </div>
                              <div className="text-xs text-gray-600">
                                {stat.uniqueUsers} users
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-2 bg-gray-50 rounded text-xs text-gray-600">
                      <div>Last Interaction:</div>
                      <div className="font-medium">
                        {new Date(cta.lastInteraction).toLocaleString()}
                      </div>
                    </div>

                    <div className="p-2 bg-yellow-50 rounded text-center">
                      <div className="text-sm font-medium text-yellow-800">
                        Avg per User:{" "}
                        {(cta.totalInteractions / cta.uniqueUsers).toFixed(1)}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      <div className="truncate">ID: {cta.ctaId}</div>
                    </div>
                  </div>
                </ChartCard>
              ))}
            </div>

            {filteredCTAs.length > MAX_INITIAL_ITEMS && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllCTAs(!showAllCTAs)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {showAllCTAs
                    ? `Show Less (${
                        filteredCTAs.length - MAX_INITIAL_ITEMS
                      } hidden)`
                    : `Show All CTAs (${
                        filteredCTAs.length - MAX_INITIAL_ITEMS
                      } more)`}
                </button>
                </div>
            )}

            {filteredCTAs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-lg">No CTAs found</div>
                <div className="text-sm mt-1">
                  Try adjusting your search or filter criteria
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;