const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};

// INIT
firebase.initializeApp(firebaseConfig);

// SERVICES
const auth = firebase.auth();
const db = firebase.firestore();