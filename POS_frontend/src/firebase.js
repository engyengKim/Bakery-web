import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: "AIzaSyBShXIArKBBaFsOpL2HuM6FelBcpVokSyk",
  authDomain: "bakery-68da1.firebaseapp.com",
  databaseURL: "https://bakery-68da1.firebaseio.com",
  projectId: "bakery-68da1",
  storageBucket: "",
  messagingSenderId: "67943102626",
  appId: "1:67943102626:web:2b9b7cf629d665799cbffb"
  // Populate your firebase configuration data here.
});

// Export the database for components to use.
// If you want to get fancy, use mixins or provide / inject to avoid redundant imports.
export const db = firebaseApp.database();
