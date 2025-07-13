import { motion } from 'framer-motion';
import { Play, Upload, Users, BarChart3, Zap, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const features = [
  {
    icon: Upload,
    title: 'Easy Upload',
    description: 'Drag and drop HLS video files with seamless processing',
    color: 'text-emerald-600',
  },
  {
    icon: Play,
    title: 'Smart Player',
    description: 'Advanced video player with time-based annotations',
    color: 'text-blue-600',
  },
  {
    icon: Users,
    title: 'Interactive Surveys',
    description: 'Engage viewers with contextual surveys and feedback forms',
    color: 'text-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track engagement, views, and interaction metrics',
    color: 'text-orange-600',
  },
  {
    icon: Zap,
    title: 'Real-time',
    description: 'Instant updates and live collaboration features',
    color: 'text-yellow-600',
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Enterprise-grade security for your video content',
    color: 'text-red-600',
  },
];

// Simple Button component (if you don't have shadcn/ui)
const Button = ({ children, onClick, variant = 'default', size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    default: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Simple Card components (if you don't have shadcn/ui)
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="p-6 pb-4">{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-buzz-gradient bg-clip-text text-transparent">
            Welcome to BUZZ
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            The ultimate video annotation and survey platform. Create interactive experiences 
            that engage your audience and drive meaningful insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-purple-gradient hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
              onClick={() => navigate('/upload')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 rounded-xl font-semibold"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants} className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Videos?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of creators who are already using BUZZ to create engaging video experiences.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold"
            onClick={() => navigate('/upload')}
          >
            Start Creating
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}