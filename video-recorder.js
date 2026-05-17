/* ============================================================
   VIDEO RECORDING MANAGER
   Handles webcam recording, storage, and management
   ============================================================ */

class VideoRecorder {
  constructor() {
    this.mediaStream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.startTime = null;
    this.recordingTime = 0;
    this.timerInterval = null;
    this.currentSessionId = null;
    this.initDB();
  }

  initDB() {
    const request = indexedDB.open('InterviewCoachDB', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('videos')) {
        const store = db.createObjectStore('videos', { keyPath: 'id' });
        store.createIndex('user', 'user', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  }

  async initializeWebcam() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      const videoElement = document.getElementById('liveVideo');
      if (videoElement) videoElement.srcObject = this.mediaStream;
      return true;
    } catch (error) {
      console.error('Webcam access denied:', error);
      return false;
    }
  }

  startRecording(sessionId = null) {
    if (!this.mediaStream) return false;
    this.currentSessionId = sessionId || Date.now();
    this.recordedChunks = [];
    const mimeType = this.getSupportedMimeType();
    this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType, videoBitsPerSecond: 2500000 });
    this.mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) this.recordedChunks.push(event.data); };
    this.mediaRecorder.onstop = () => this.saveRecording();
    this.mediaRecorder.start();
    this.isRecording = true;
    this.startTime = Date.now();
    this.updateRecordingTime();
    return true;
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      clearInterval(this.timerInterval);
    }
  }

  updateRecordingTime() {
    this.timerInterval = setInterval(() => {
      this.recordingTime = Math.floor((Date.now() - this.startTime) / 1000);
      const minutes = Math.floor(this.recordingTime / 60);
      const seconds = this.recordingTime % 60;
      const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      const timeEl = document.getElementById('recordingTime');
      if (timeEl) timeEl.textContent = display;
    }, 1000);
  }

  async saveRecording() {
    if (this.recordedChunks.length === 0) return;
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const blobUrl = URL.createObjectURL(blob);
    const videoData = {
      id: Date.now(),
      sessionId: this.currentSessionId,
      user: appState.currentUser,
      question: appState.currentQuestion + 1,
      timestamp: new Date().toISOString(),
      duration: this.recordingTime,
      size: blob.size,
      blobUrl: blobUrl
    };
    await this.storeVideo(videoData);
  }

  async storeVideo(videoData) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewCoachDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        store.put(videoData);
        transaction.oncomplete = () => resolve(videoData);
        transaction.onerror = () => reject(transaction.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getVideos() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewCoachDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        const query = store.getAll();
        query.onsuccess = () => resolve(query.result.sort((a, b) => b.id - a.id));
        query.onerror = () => reject(query.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getVideo(videoId) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewCoachDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['videos'], 'readonly');
        const store = transaction.objectStore('videos');
        const query = store.get(videoId);
        query.onsuccess = () => resolve(query.result);
        query.onerror = () => reject(query.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteVideo(videoId) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewCoachDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        const query = store.delete(videoId);
        query.onsuccess = () => resolve();
        query.onerror = () => reject(query.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllVideos() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('InterviewCoachDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['videos'], 'readwrite');
        const store = transaction.objectStore('videos');
        const query = store.clear();
        query.onsuccess = () => resolve();
        query.onerror = () => reject(query.error);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getVideoStats() {
    try {
      const videos = await this.getVideos();
      const totalVideos = videos.length;
      const totalDuration = videos.reduce((sum, v) => sum + (v.duration || 0), 0);
      const totalSize = videos.reduce((sum, v) => sum + (v.size || 0), 0);
      return { totalVideos, totalDuration, totalSize };
    } catch (error) {
      console.error('Error getting video stats:', error);
      return { totalVideos: 0, totalDuration: 0, totalSize: 0 };
    }
  }

  downloadVideo(videoId) {
    this.getVideo(videoId).then(video => {
      if (video) {
        const a = document.createElement('a');
        a.href = video.blobUrl;
        a.download = `interview-video-q${video.question}-${videoId}.webm`;
        a.click();
      }
    });
  }

  getSupportedMimeType() {
    const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return 'video/webm';
  }

  stopAllStreams() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    clearInterval(this.timerInterval);
  }
}

// Initialize video recorder
let videoRecorder = new VideoRecorder();
