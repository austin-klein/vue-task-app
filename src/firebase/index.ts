import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCv0VQaK8LnNlqBT1DB12lxwQJNw1qfgv8",
  authDomain: "vue-task-app-1d498.firebaseapp.com",
  projectId: "vue-task-app-1d498",
  storageBucket: "vue-task-app-1d498.appspot.com",
  messagingSenderId: "535984018208",
  appId: "1:535984018208:web:549ea1a9470151ae503d45",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
