import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    level: 'Intermediate',
    totalSessions: 24,
    averageScore: 82,
    coachName: 'Sarah Miller'
  });

  // Home dashboard state
  const [recentActivity, setRecentActivity] = useState([
    { type: 'swing', message: 'Swing analysis completed', time: '2 hours ago' },
    { type: 'message', message: 'New message from coach', time: '5 hours ago' },
    { type: 'session', message: 'Practice session logged', time: '1 day ago' }
  ]);

  // Swing recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '14:30',
      duration: '0:45',
      status: 'Analyzed',
      feedback: 'Great improvement in your backswing! Focus on follow-through.',
      rating: 8.5
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '10:15',
      duration: '1:20',
      status: 'Pending Review',
      feedback: null,
      rating: null
    },
    {
      id: 3,
      date: '2024-01-12',
      time: '16:45',
      duration: '0:38',
      status: 'Analyzed',
      feedback: 'Work on your stance. Your weight distribution needs adjustment.',
      rating: 7.2
    }
  ]);
  const [recordingTime, setRecordingTime] = useState(0);
  const videoRef = useRef(null);

  // Coach messaging state
  const [messages, setMessages] = useState([
    { id: 1, sender: 'coach', content: 'Great progress on your last session! Keep it up.', time: '10:30 AM', isRead: true },
    { id: 2, sender: 'user', content: 'Thank you! I felt much more confident with my swing.', time: '10:45 AM', isRead: true },
    { id: 3, sender: 'coach', content: 'For tomorrow\'s session, focus on your follow-through. I\'ve uploaded a new drill video.', time: '2:15 PM', isRead: true },
    { id: 4, sender: 'coach', content: 'How did the putting practice go today?', time: '4:20 PM', isRead: false }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [coachOnline, setCoachOnline] = useState(true);

  // Progress tracking state
  const [progressData, setProgressData] = useState({
    swingSpeed: { current: 95, goal: 105, improvement: 8 },
    accuracy: { current: 78, goal: 85, improvement: 12 },
    consistency: { current: 72, goal: 80, improvement: 5 },
    distance: { current: 245, goal: 260, improvement: 15 }
  });
  
  const [goals, setGoals] = useState([
    { id: 1, title: 'Increase swing speed to 105 mph', progress: 75, deadline: '2024-03-01' },
    { id: 2, title: 'Achieve 85% accuracy rating', progress: 60, deadline: '2024-02-15' },
    { id: 3, title: 'Reduce handicap to 8', progress: 40, deadline: '2024-04-01' }
  ]);

  // Recording timer effect
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsRecording(false);
    
    // Add new recording to list
    const newRecording = {
      id: recordings.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`,
      status: 'Processing',
      feedback: null,
      rating: null
    };
    setRecordings([newRecording, ...recordings]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'user',
        content: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const ProgressBar = ({ current, goal, label }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">{label}</span>
          <span className="text-sm text-gray-600">{current}/{goal}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Navigation component
  const Navigation = () => (
    <nav className="bg-green-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">🏌️ Golf Coach Pro</h1>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className={`px-4 py-2 rounded ${currentPage === 'home' ? 'bg-green-600' : 'hover:bg-green-700'}`}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => setCurrentPage('recording')}
            className={`px-4 py-2 rounded ${currentPage === 'recording' ? 'bg-green-600' : 'hover:bg-green-700'}`}
          >
            📹 Record Swing
          </button>
          <button 
            onClick={() => setCurrentPage('messages')}
            className={`px-4 py-2 rounded ${currentPage === 'messages' ? 'bg-green-600' : 'hover:bg-green-700'}`}
          >
            💬 Coach Chat
          </button>
          <button 
            onClick={() => setCurrentPage('progress')}
            className={`px-4 py-2 rounded ${currentPage === 'progress' ? 'bg-green-600' : 'hover:bg-green-700'}`}
          >
            📊 Progress
          </button>
        </div>
      </div>
    </nav>
  );

  // Home Dashboard Page
  const HomePage = () => (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-4">Welcome back, {userProfile.name}! 👋</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-800">{userProfile.totalSessions}</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-800">{userProfile.averageScore}</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-800">{userProfile.level}</div>
            <div className="text-sm text-gray-600">Skill Level</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-800">{userProfile.coachName}</div>
            <div className="text-sm text-gray-600">Your Coach</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button 
            onClick={() => setCurrentPage('recording')}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-3xl mb-2">📹</div>
            <div className="font-semibold">Record New Swing</div>
            <div className="text-sm opacity-90">Capture and analyze</div>
          </button>
          <button 
            onClick={() => setCurrentPage('messages')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-3xl mb-2">💬</div>
            <div className="font-semibold">Message Coach</div>
            <div className="text-sm opacity-90">Get instant feedback</div>
          </button>
          <button 
            onClick={() => setCurrentPage('progress')}
            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition-colors"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">View Progress</div>
            <div className="text-sm opacity-90">Track improvements</div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mr-4">
                {activity.type === 'swing' && '📹'}
                {activity.type === 'message' && '💬'}
                {activity.type === 'session' && '🏌️'}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{activity.message}</div>
                <div className="text-sm text-gray-600">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Swing Recording Page
  const RecordingPage = () => (
    <div className="max-w-4xl mx-auto">
      {/* Camera Interface */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Swing Recording Studio</h2>
        <div className="text-center">
          <div className="bg-black rounded-lg mb-4 relative" style={{ height: '400px' }}>
            <video 
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover rounded-lg"
              style={{ display: isRecording ? 'block' : 'none' }}
            />
            {!isRecording && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <div className="text-xl">Click "Start Recording" to begin</div>
                </div>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full">
                🔴 REC {formatTime(recordingTime)}
              </div>
            )}
          </div>
          
          <div className="space-x-4">
            {!isRecording ? (
              <button 
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                🎬 Start Recording
              </button>
            ) : (
              <button 
                onClick={stopRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                ⏹️ Stop Recording
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Previous Recordings */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Previous Recordings</h3>
        <div className="space-y-4">
          {recordings.map((recording) => (
            <div key={recording.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{recording.date} at {recording.time}</div>
                  <div className="text-sm text-gray-600">Duration: {recording.duration}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  recording.status === 'Analyzed' ? 'bg-green-100 text-green-800' :
                  recording.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {recording.status}
                </div>
              </div>
              {recording.feedback && (
                <div className="bg-green-50 p-3 rounded-lg mb-2">
                  <div className="font-semibold text-green-800">Coach Feedback:</div>
                  <div className="text-green-700">{recording.feedback}</div>
                  {recording.rating && (
                    <div className="mt-2">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold ml-1">{recording.rating}/10</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Coach Messaging Page
  const MessagesPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg h-96">
        {/* Chat Header */}
        <div className="bg-green-800 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{userProfile.coachName}</h2>
              <div className="flex items-center text-sm">
                <div className={`w-2 h-2 rounded-full mr-2 ${coachOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                {coachOnline ? 'Online' : 'Offline'}
              </div>
            </div>
            <div className="text-2xl">👨‍🏫</div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 h-64 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {message.content}
              </div>
              <div className="text-xs text-gray-500 mt-1">{message.time}</div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            />
            <button 
              onClick={sendMessage}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Progress Tracking Page
  const ProgressPage = () => (
    <div className="max-w-6xl mx-auto">
      {/* Progress Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-6">Your Progress</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ProgressBar 
              current={progressData.swingSpeed.current} 
              goal={progressData.swingSpeed.goal} 
              label="Swing Speed (mph)" 
            />
            <ProgressBar 
              current={progressData.accuracy.current} 
              goal={progressData.accuracy.goal} 
              label="Accuracy (%)" 
            />
          </div>
          <div>
            <ProgressBar 
              current={progressData.consistency.current} 
              goal={progressData.consistency.goal} 
              label="Consistency (%)" 
            />
            <ProgressBar 
              current={progressData.distance.current} 
              goal={progressData.distance.goal} 
              label="Average Distance (yards)" 
            />
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Active Goals</h3>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">{goal.title}</div>
                <div className="text-sm text-gray-600">Due: {goal.deadline}</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 mt-1">{goal.progress}% complete</div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4">Session Statistics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-800">24</div>
            <div className="text-sm text-gray-600">Total Sessions</div>
            <div className="text-xs text-green-600">+3 this week</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-800">45</div>
            <div className="text-sm text-gray-600">Hours Practiced</div>
            <div className="text-xs text-green-600">+5.5 this week</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-800">89</div>
            <div className="text-sm text-gray-600">Swings Analyzed</div>
            <div className="text-xs text-green-600">+12 this week</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-800">8.2</div>
            <div className="text-sm text-gray-600">Avg. Rating</div>
            <div className="text-xs text-green-600">+0.5 this week</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'recording' && <RecordingPage />}
        {currentPage === 'messages' && <MessagesPage />}
        {currentPage === 'progress' && <ProgressPage />}
      </main>

      <footer className="bg-green-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Golf Coach Pro. Professional golf coaching platform.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
