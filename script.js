/* ============================================================
   INTERVIEW CONFIDENCE COACH - ADVANCED JAVASCRIPT
   ============================================================
   Production-Ready Application Logic
   Version: 2.0 Advanced Edition
   ============================================================ */

// ============ CONFIGURATION ============
const CONFIG = {
  STORAGE_KEY: 'icc_sessions',
  USER_KEY: 'icc_user',
  INTERVIEW_TIME: 25,
  QUESTIONS_COUNT: 4,
  MIN_ANSWER_LENGTH: 20,
};

// ============ APPLICATION STATE ============
const appState = {
  currentUser: null,
  currentQuestion: 0,
  currentAnswer: '',
  sessionScores: [],
  timeRemaining: CONFIG.INTERVIEW_TIME,
  timerInterval: null,
  isAnswering: false,
  chart: null,
};

// ============ INTERVIEW QUESTIONS ============
const interviewQuestions = [
  "Tell me about yourself and your professional background",
  "What motivates you to apply for this position?",
  "Describe a challenging project and how you overcame it",
  "Where do you see yourself in 5 years?"
];

// ============ SCORING ENGINE CLASS ============
class ScoringEngine {
  static calculateScore(answer) {
    if (!answer || answer.trim().length === 0) return 0;

    const trimmedAnswer = answer.trim().toLowerCase();
    
    // Length Score (0-30 points)
    const lengthScore = this.calculateLengthScore(trimmedAnswer);
    
    // Quality Score (0-40 points)
    const qualityScore = this.calculateQualityScore(trimmedAnswer);
    
    // Clarity Score (0-30 points)
    const clarityScore = this.calculateClarityScore(trimmedAnswer);
    
    return Math.round(lengthScore + qualityScore + clarityScore);
  }

  static calculateLengthScore(answer) {
    const wordCount = answer.split(/\s+/).length;
    if (wordCount < 10) return 0;
    if (wordCount < 20) return 10;
    if (wordCount < 50) return 20;
    return 30;
  }

  static calculateQualityScore(answer) {
    const keywords = [
      'achievement', 'success', 'experience', 'skill', 'learn',
      'improve', 'team', 'collaboration', 'problem', 'solution',
      'develop', 'responsible', 'manage', 'lead', 'project',
      'accomplished', 'result', 'implement', 'innovative', 'deliver'
    ];

    let keywordCount = 0;
    keywords.forEach(keyword => {
      if (answer.includes(keyword)) keywordCount++;
    });

    return Math.min(keywordCount * 2, 40);
  }

  static calculateClarityScore(answer) {
    const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = answer.split(/\s+/).length / Math.max(sentences.length, 1);

    let clarityScore = 15;

    // Check for filler words
    const fillers = ['um', 'uh', 'like', 'basically', 'literally', 'actually'];
    fillers.forEach(filler => {
      if (answer.includes(filler)) clarityScore -= 3;
    });

    // Sentence variety check
    if (sentences.length > 3) clarityScore += 10;
    if (avgSentenceLength > 8 && avgSentenceLength < 20) clarityScore += 5;

    return Math.max(Math.min(clarityScore, 30), 0);
  }

  static getScoreFeedback(score) {
    if (score >= 85) return "Excellent! Outstanding answer with great depth and clarity.";
    if (score >= 70) return "Very good! Well-structured answer with good content.";
    if (score >= 55) return "Good attempt. Consider adding more specific examples.";
    if (score >= 40) return "Fair response. Try to be more detailed and structured.";
    return "Needs improvement. Provide longer, more detailed answers.";
  }

  static generateSuggestions(answer, score) {
    const suggestions = [];
    const trimmed = answer.trim().toLowerCase();
    const wordCount = trimmed.split(/\s+/).length;

    if (wordCount < 20) {
      suggestions.push("Expand your answer with more details and examples");
    }

    if (trimmed.includes('um ') || trimmed.includes('uh ') || trimmed.includes(' like ')) {
      suggestions.push("Avoid using filler words for better professionalism");
    }

    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length < 3) {
      suggestions.push("Break your answer into more distinct points");
    }

    if (!trimmed.includes('achieved') && !trimmed.includes('accomplish') && !trimmed.includes('success')) {
      suggestions.push("Highlight specific achievements and results");
    }

    if (!trimmed.includes('team') && !trimmed.includes('collaborate') && !trimmed.includes('work')) {
      suggestions.push("Mention teamwork and collaboration examples");
    }

    return suggestions.length > 0 ? suggestions : ["Great answer! Keep practicing to improve further."];
  }
}

// ============ STORAGE MANAGER CLASS ============
class StorageManager {
  static getSessions() {
    const data = localStorage.getItem(CONFIG.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static addSession(sessionData) {
    const sessions = this.getSessions();
    sessions.push({
      ...sessionData,
      timestamp: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(sessions));
    return sessions;
  }

  static getUser() {
    return localStorage.getItem(CONFIG.USER_KEY);
  }

  static setUser(username) {
    localStorage.setItem(CONFIG.USER_KEY, username);
  }

  static clearUser() {
    localStorage.removeItem(CONFIG.USER_KEY);
  }

  static clearAllData() {
    if (confirm('Are you sure? This will delete all your interview data permanently.')) {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      localStorage.removeItem(CONFIG.USER_KEY);
      return true;
    }
    return false;
  }

  static exportToCSV() {
    const sessions = this.getSessions();
    if (sessions.length === 0) {
      alert('No data to export');
      return;
    }

    let csv = 'Date,User,Score\n';
    sessions.forEach(session => {
      const date = new Date(session.timestamp).toLocaleString();
      csv += `"${date}","${session.user}",${session.score}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-results-${Date.now()}.csv`;
    a.click();
  }
}

// ============ UI CONTROLLER CLASS ============
class UIController {
  static showSection(sectionId) {
    document.querySelectorAll('[id$="Box"], #dashboard, #interview, #result').forEach(el => {
      el.classList.add('hidden');
    });
    const section = document.getElementById(sectionId);
    if (section) section.classList.remove('hidden');
  }

  static updateDashboard() {
    const sessions = StorageManager.getSessions();
    
    if (sessions.length === 0) {
      document.getElementById('totalSessions').textContent = '0';
      document.getElementById('avgScore').textContent = '0';
      document.getElementById('bestScore').textContent = '0';
      document.getElementById('overallProgress').style.width = '0%';
      document.getElementById('progressText').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Start your first interview to see progress';
      return;
    }

    const totalSessions = sessions.length;
    const scores = sessions.map(s => s.score);
    const avgScore = Math.round(scores.reduce((a, b) => a + b) / scores.length);
    const bestScore = Math.max(...scores);

    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('avgScore').textContent = avgScore;
    document.getElementById('bestScore').textContent = bestScore;
    document.getElementById('overallProgress').style.width = `${Math.min((avgScore / 100) * 100, 100)}%`;
    document.getElementById('progressText').textContent = `📊 Average score: ${avgScore}/100 across ${totalSessions} sessions`;

    this.updateChart(sessions);
  }

  static updateChart(sessions) {
    const ctx = document.getElementById('scoreChart');
    if (!ctx) return;

    if (appState.chart) {
      appState.chart.destroy();
    }

    const labels = sessions.map((_, i) => `Session ${i + 1}`);
    const data = sessions.map(s => s.score);

    appState.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Confidence Score',
          data: data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { family: "'Poppins', sans-serif", size: 12 }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 }
          }
        }
      }
    });
  }
}

// ============ TIMER MANAGER CLASS ============
class TimerManager {
  static startTimer(onTick, onComplete) {
    appState.timeRemaining = CONFIG.INTERVIEW_TIME;
    this.updateDisplay();

    if (appState.timerInterval) {
      clearInterval(appState.timerInterval);
    }

    appState.timerInterval = setInterval(() => {
      appState.timeRemaining--;
      this.updateDisplay();
      if (onTick) onTick(appState.timeRemaining);

      if (appState.timeRemaining <= 0) {
        clearInterval(appState.timerInterval);
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  static stopTimer() {
    if (appState.timerInterval) {
      clearInterval(appState.timerInterval);
      appState.timerInterval = null;
    }
  }

  static updateDisplay() {
    const timeEl = document.getElementById('time');
    if (timeEl) {
      timeEl.textContent = appState.timeRemaining;
      
      if (appState.timeRemaining <= 5) {
        timeEl.style.color = '#ef4444';
      } else if (appState.timeRemaining <= 10) {
        timeEl.style.color = '#f59e0b';
      } else {
        timeEl.style.color = '#10b981';
      }
    }
  }
}

// ============ PUBLIC FUNCTIONS ============

function login() {
  const username = document.getElementById('usernameInput').value.trim();
  if (!username) {
    alert('Please enter your name');
    return;
  }

  appState.currentUser = username;
  StorageManager.setUser(username);
  
  document.getElementById('userLabel').textContent = `Welcome, ${username}!`;
  UIController.updateDashboard();
  UIController.showSection('dashboard');
}

function startInterview() {
  appState.currentQuestion = 0;
  appState.sessionScores = [];
  
  document.getElementById('totalQuestions').textContent = CONFIG.QUESTIONS_COUNT;
  
  loadQuestion();
  UIController.showSection('interview');
  TimerManager.startTimer(null, () => {
    alert('Time is up! Moving to next question.');
    nextQuestion();
  });
}

function loadQuestion() {
  const question = interviewQuestions[appState.currentQuestion];
  document.getElementById('questionText').textContent = question;
  document.getElementById('questionNum').textContent = appState.currentQuestion + 1;
  document.getElementById('answerBox').value = '';
  document.getElementById('answerBox').focus();
  
  TimerManager.startTimer();
}

function nextQuestion() {
  TimerManager.stopTimer();
  
  const answer = document.getElementById('answerBox').value;
  const score = ScoringEngine.calculateScore(answer);
  appState.sessionScores.push({
    question: interviewQuestions[appState.currentQuestion],
    answer: answer,
    score: score
  });

  appState.currentQuestion++;

  if (appState.currentQuestion < CONFIG.QUESTIONS_COUNT) {
    loadQuestion();
  } else {
    finishInterview();
  }
}

function finishInterview() {
  TimerManager.stopTimer();
  
  const totalScore = Math.round(
    appState.sessionScores.reduce((sum, s) => sum + s.score, 0) / CONFIG.QUESTIONS_COUNT
  );

  StorageManager.addSession({
    user: appState.currentUser,
    score: totalScore,
    details: appState.sessionScores
  });

  document.getElementById('finalScore').textContent = `${totalScore}/100`;
  document.getElementById('scoreLabelResult').textContent = ScoringEngine.getScoreFeedback(totalScore);
  document.getElementById('feedbackText').textContent = 
    `Your overall confidence score is ${totalScore}/100. ${ScoringEngine.getScoreFeedback(totalScore)}`;

  const suggestions = ScoringEngine.generateSuggestions(
    appState.sessionScores.map(s => s.answer).join(' '),
    totalScore
  );

  const suggestionsList = document.getElementById('suggestionsList');
  suggestionsList.innerHTML = suggestions.map(s => `<li>${s}</li>`).join('');

  UIController.showSection('result');
}

function goDashboard() {
  TimerManager.stopTimer();
  UIController.updateDashboard();
  UIController.showSection('dashboard');
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    StorageManager.clearUser();
    appState.currentUser = null;
    UIController.showSection('loginBox');
    document.getElementById('usernameInput').value = '';
    document.getElementById('usernameInput').focus();
  }
}

function exportResults() {
  StorageManager.exportToCSV();
}

function clearAllData() {
  if (StorageManager.clearAllData()) {
    appState.sessionScores = [];
    UIController.updateDashboard();
    goDashboard();
  }
}

// ============ EVENT LISTENERS ============
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is already logged in
  const savedUser = StorageManager.getUser();
  if (savedUser) {
    appState.currentUser = savedUser;
    document.getElementById('userLabel').textContent = `Welcome, ${savedUser}!`;
    UIController.updateDashboard();
    UIController.showSection('dashboard');
  } else {
    UIController.showSection('loginBox');
    document.getElementById('usernameInput').focus();
  }

  // Login form submission
  document.querySelector('form').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') login();
  });

  // Answer box character limit warning
  document.getElementById('answerBox').addEventListener('input', (e) => {
    const charCount = e.target.value.length;
    if (charCount > 500) {
      e.target.value = e.target.value.substring(0, 500);
    }
  });
});

// ============ DEBUG EXPORTS ============
const AppDebug = {
  appState,
  ScoringEngine,
  StorageManager,
  UIController,
  TimerManager,
  config: CONFIG,
  getSessions: () => StorageManager.getSessions(),
  clearAllData: () => StorageManager.clearAllData(),
  simulateScore: (text) => ScoringEngine.calculateScore(text)
};

// Make debug available globally
window.AppDebug = AppDebug;

// ============ PERFORMANCE MONITORING ============
window.addEventListener('load', () => {
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  console.log(`%c⚡ Interview Confidence Coach loaded in ${pageLoadTime}ms`, 'color: #6366f1; font-weight: bold;');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Alt+D: Dashboard
  if (e.altKey && e.key === 'd') {
    e.preventDefault();
    if (appState.currentUser) goDashboard();
  }
  // Alt+L: Logout
  if (e.altKey && e.key === 'l') {
    e.preventDefault();
    logout();
  }
});
