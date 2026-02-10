import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Code, Sparkles, Upload, X } from 'lucide-react';

export default function AICodeReviewer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    
    setLoading(true);
    setReview(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are an expert code reviewer. Analyze this ${language} code and provide a structured review with:
1. Overall quality score (0-100)
2. Specific issues found (bugs, security, performance, style)
3. Positive aspects
4. Actionable suggestions for improvement

Format your response as JSON with this structure:
{
  "score": number,
  "issues": [{"type": "bug|security|performance|style", "severity": "high|medium|low", "line": number or null, "description": string}],
  "positives": [string],
  "suggestions": [string]
}

Code to review:
\`\`\`${language}
${code}
\`\`\``
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setReview(parsed);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      setReview({
        score: 0,
        issues: [{ type: 'error', severity: 'high', description: 'Failed to analyze code. Please try again.' }],
        positives: [],
        suggestions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-green-600';
    if (score >= 60) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'security': return '🔒';
      case 'performance': return '⚡';
      case 'style': return '🎨';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-200 via-violet-200 to-purple-200 bg-clip-text text-transparent"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI Code Reviewer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Leveraging Claude AI to provide instant, intelligent code reviews with actionable feedback
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-slate-200 font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  Your Code
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here for AI-powered review..."
                className="w-full h-96 bg-slate-950/50 border border-slate-800 rounded-xl p-4 text-slate-200 
                         font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 
                         placeholder-slate-600 resize-none transition-all"
                style={{ fontFamily: "'Fira Code', monospace" }}
              />

              <button
                onClick={analyzeCode}
                disabled={loading || !code.trim()}
                className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 
                         text-white font-bold rounded-xl shadow-lg shadow-indigo-500/50
                         hover:shadow-indigo-500/70 hover:scale-[1.02] disabled:opacity-50 
                         disabled:cursor-not-allowed disabled:hover:scale-100 transition-all
                         flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {review ? (
              <>
                {/* Score Card */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getScoreColor(review.score)} 
                                  flex items-center justify-center shadow-2xl`}>
                      <span className="text-5xl font-black text-white">{review.score}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-200 mb-1">Code Quality Score</h3>
                      <p className="text-slate-400">
                        {review.score >= 80 ? 'Excellent code!' : review.score >= 60 ? 'Good, with room for improvement' : 'Needs attention'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Issues */}
                {review.issues && review.issues.length > 0 && (
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      Issues Found ({review.issues.length})
                    </h3>
                    <div className="space-y-3">
                      {review.issues.map((issue, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${getSeverityStyle(issue.severity)}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{getTypeIcon(issue.type)}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                                  {issue.type}
                                </span>
                                {issue.line && (
                                  <span className="text-xs opacity-60">Line {issue.line}</span>
                                )}
                              </div>
                              <p className="text-sm leading-relaxed">{issue.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Positives */}
                {review.positives && review.positives.length > 0 && (
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      What's Working Well
                    </h3>
                    <ul className="space-y-2">
                      {review.positives.map((positive, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                          <span className="text-emerald-400 mt-1">✓</span>
                          <span className="text-sm leading-relaxed">{positive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {review.suggestions && review.suggestions.length > 0 && (
                  <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                      Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {review.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                          <span className="text-indigo-400 mt-1">→</span>
                          <span className="text-sm leading-relaxed">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-12 shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 mx-auto bg-slate-800/50 rounded-2xl flex items-center justify-center">
                    <Upload className="w-12 h-12 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-400">Ready to Review</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Paste your code and click "Analyze with AI" to get instant, intelligent feedback powered by Claude
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>Built with Claude API • Demonstrates practical AI integration in development workflows</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&family=Inter:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap');
      `}</style>
    </div>
  );
}