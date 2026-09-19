// frontend/src/App.jsx
import { useState } from 'react';
import { GraduationCap, TrendingUp, Clock, UserCheck, Loader2 } from 'lucide-react';

// IMPORTANT: Change this to your Render backend URL when you deploy!
// For local testing, keep it as http://localhost:8000
const API_URL = "http://localhost:8000/predict";

function App() {
  const [formData, setFormData] = useState({
    StudyHours: 5,
    Attendance: 70,
    PreviousMarks: 65,
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Failed to get prediction");
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Could not connect to the backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 mb-4">
            <GraduationCap className="w-8 h-8 text-purple-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Student Result Predictor</h1>
          <p className="text-purple-200 mt-2">Powered by Random Forest ML</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Study Hours Input */}
            <div>
              <label className="flex items-center text-sm font-medium text-purple-100 mb-2">
                <Clock className="w-4 h-4 mr-2" /> Study Hours (per day)
              </label>
              <input
                type="range"
                name="StudyHours"
                min="0"
                max="15"
                step="0.5"
                value={formData.StudyHours}
                onChange={handleChange}
                className="w-full h-2 bg-purple-200/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="text-right text-purple-300 text-sm mt-1">{formData.StudyHours} hrs</div>
            </div>

            {/* Attendance Input */}
            <div>
              <label className="flex items-center text-sm font-medium text-purple-100 mb-2">
                <UserCheck className="w-4 h-4 mr-2" /> Attendance (%)
              </label>
              <input
                type="range"
                name="Attendance"
                min="0"
                max="100"
                step="1"
                value={formData.Attendance}
                onChange={handleChange}
                className="w-full h-2 bg-purple-200/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="text-right text-purple-300 text-sm mt-1">{formData.Attendance}%</div>
            </div>

            {/* Previous Marks Input */}
            <div>
              <label className="flex items-center text-sm font-medium text-purple-100 mb-2">
                <TrendingUp className="w-4 h-4 mr-2" /> Previous Marks
              </label>
              <input
                type="range"
                name="PreviousMarks"
                min="0"
                max="100"
                step="1"
                value={formData.PreviousMarks}
                onChange={handleChange}
                className="w-full h-2 bg-purple-200/20 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <div className="text-right text-purple-300 text-sm mt-1">{formData.PreviousMarks} / 100</div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "🔮 Predict Result"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`mt-6 p-6 rounded-xl border text-center transition-all duration-500 animate-fade-in ${
              result.prediction === 'Pass' 
                ? 'bg-green-500/20 border-green-500/50' 
                : 'bg-red-500/20 border-red-500/50'
            }`}>
              <h3 className={`text-2xl font-bold mb-2 ${result.prediction === 'Pass' ? 'text-green-300' : 'text-red-300'}`}>
                {result.prediction === 'Pass' ? '✅ PASS' : '❌ FAIL'}
              </h3>
              <p className="text-white/80 text-sm">
                Model Confidence: <span className="font-bold text-white">{result.confidence}%</span>
              </p>
            </div>
          )}
        </div>
        
        <p className="text-center text-purple-300/50 text-xs mt-6">
          Built with FastAPI, React & Tailwind CSS
        </p>
      </div>
    </div>
  );
}

export default App;