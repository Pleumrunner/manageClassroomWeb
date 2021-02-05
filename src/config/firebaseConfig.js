var firebase = require("firebase/app");

require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyD1tNJ6WwC-03K5DJZg_q82Mzls_9u2-bY",
  authDomain: "studentchecking.firebaseapp.com",
  databaseURL: "https://studentchecking.firebaseio.com",
  projectId: "studentchecking",
  storageBucket: "studentchecking.appspot.com",
  messagingSenderId: "33470561986",
  appId: "1:33470561986:web:84158a4968f544d752855b",
  measurementId: "G-55BQQZDXKF"
};
firebase.initializeApp(firebaseConfig);

export default firebase


