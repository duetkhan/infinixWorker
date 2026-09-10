// ==========================================
// Infinix Worker - Firebase Configuration
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyAoI34j6uor02CNxM9QWEb7bMLkGYbuzmnM",
  authDomain: "infinix-worker.firebaseapp.com",
  projectId: "infinix-worker",
  storageBucket: "infinix-worker.firebasestorage.app",
  messagingSenderId: "611505824571",
  appId: "1:611505824571:web:aa0baf4393a77a0cef4d1e",
  measurementId: "G-BC1D0LCJ6R"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Make Firebase services available to existing pages
window.firebaseApp = firebase.app();
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();
