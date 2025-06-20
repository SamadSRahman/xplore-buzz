// Placeholder video API functions
// In a real application, these would handle HLS uploads and video processing

let videoStorage = [
  {
    id: 'demo-video-1',
    title: 'Highlander check shirts review',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '',
    duration: 272, // 4:32 in seconds
    views: 91,
    impressions: 101,
    timePlayed: '5 hr 10 sec',
    createdAt: '2025-01-12T00:00:00Z',
    annotations: [
      {
        id: 1,
        type: 'product',
        name: 'Highlander Men Textured Dobby Checked Relax Fit Shirt',
        url: 'https://example.com/product/shirt',
        startTime: 30,
        endTime: 45,
        position: 'bottom-right',
        backgroundColor: '#240CEF',
        fontColor: '#FFFFFF',
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200'
      },
      {
        id: 2,
        type: 'survey',
        question: 'What do you think about this shirt?',
        type: 'yes-no',
        options: ['Yes', 'No'],
        startTime: 60,
        endTime: 75
      }
    ]
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function uploadVideo(file, onProgress) {
  // Simulate upload progress
  const totalSteps = 10;
  for (let i = 0; i <= totalSteps; i++) {
    await delay(200);
    const progress = (i / totalSteps) * 100;
    onProgress?.(progress);
  }
  
  // Create video record
  const videoId = 'video-' + Date.now();
  const newVideo = {
    id: videoId,
    title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
    src: URL.createObjectURL(file), // In real app, this would be the processed HLS URL
    thumbnail: '',
    duration: 300, // Default duration, would be extracted from video
    views: 0,
    impressions: 0,
    timePlayed: '0 sec',
    createdAt: new Date().toISOString(),
    annotations: []
  };
  
  videoStorage.push(newVideo);
  
  return {
    id: videoId,
    url: newVideo.src,
    success: true
  };
}

export async function getVideoById(id) {
  await delay(500);
  
  const video = videoStorage.find(v => v.id === id);
  if (!video) {
    throw new Error('Video not found');
  }
  
  return video;
}

export async function getAllVideos() {
  await delay(300);
  
  return videoStorage.map(video => ({
    ...video,
    // Don't include full annotations in list view
    annotationCount: video.annotations?.length || 0
  }));
}

export async function updateVideo(id, updates) {
  await delay(500);
  
  const videoIndex = videoStorage.findIndex(v => v.id === id);
  if (videoIndex === -1) {
    throw new Error('Video not found');
  }
  
  videoStorage[videoIndex] = {
    ...videoStorage[videoIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return videoStorage[videoIndex];
}

export async function deleteVideo(id) {
  await delay(500);
  
  const videoIndex = videoStorage.findIndex(v => v.id === id);
  if (videoIndex === -1) {
    throw new Error('Video not found');
  }
  
  videoStorage.splice(videoIndex, 1);
  
  return { success: true };
}

export async function addAnnotation(videoId, annotation) {
  await delay(300);
  
  const video = videoStorage.find(v => v.id === videoId);
  if (!video) {
    throw new Error('Video not found');
  }
  
  const newAnnotation = {
    id: Date.now() + Math.random(),
    ...annotation,
    createdAt: new Date().toISOString()
  };
  
  if (!video.annotations) {
    video.annotations = [];
  }
  
  video.annotations.push(newAnnotation);
  
  return newAnnotation;
}

export async function updateAnnotation(videoId, annotationId, updates) {
  await delay(300);
  
  const video = videoStorage.find(v => v.id === videoId);
  if (!video) {
    throw new Error('Video not found');
  }
  
  const annotationIndex = video.annotations.findIndex(a => a.id === annotationId);
  if (annotationIndex === -1) {
    throw new Error('Annotation not found');
  }
  
  video.annotations[annotationIndex] = {
    ...video.annotations[annotationIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  return video.annotations[annotationIndex];
}

export async function deleteAnnotation(videoId, annotationId) {
  await delay(300);
  
  const video = videoStorage.find(v => v.id === videoId);
  if (!video) {
    throw new Error('Video not found');
  }
  
  const annotationIndex = video.annotations.findIndex(a => a.id === annotationId);
  if (annotationIndex === -1) {
    throw new Error('Annotation not found');
  }
  
  video.annotations.splice(annotationIndex, 1);
  
  return { success: true };
}

// HLS specific functions
export async function processHLSUpload(file) {
  await delay(2000); // Simulate processing time
  
  // In a real app, this would:
  // 1. Upload the .m3u8 manifest and .ts segments
  // 2. Validate the HLS stream
  // 3. Generate thumbnails
  // 4. Extract metadata (duration, resolution, etc.)
  
  return {
    manifestUrl: URL.createObjectURL(file),
    duration: 300,
    resolution: '1920x1080',
    bitrate: '2000kbps',
    segments: 30
  };
}

export async function getVideoAnalytics(videoId) {
  await delay(500);
  
  // Mock analytics data
  return {
    views: Math.floor(Math.random() * 1000),
    impressions: Math.floor(Math.random() * 2000),
    engagementRate: Math.random() * 100,
    averageWatchTime: Math.floor(Math.random() * 300),
    annotationClicks: Math.floor(Math.random() * 50),
    surveyResponses: Math.floor(Math.random() * 30)
  };
}