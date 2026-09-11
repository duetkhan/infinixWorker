const firebaseConfig = {
  apiKey: "AIzaSyAol34j6urO2CNxM0QWEb7bMLkGYbuzmnM",
  authDomain: "infinix-worker.firebaseapp.com",
  projectId: "infinix-worker",
  storageBucket: "infinix-worker.firebasestorage.app",
  messagingSenderId: "611505824571",
  appId: "1:611505824571:web:aa0baf4393a77a0cef4d1e",
  measurementId: "G-BC1D0LC6J4"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.firebaseApp = firebase.app();
window.firebaseAuth = firebase.auth();
window.firebaseDb = firebase.firestore();
