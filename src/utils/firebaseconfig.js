import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJTftITSZJV3cqBY4QneTzUwS25rub_sI",
  authDomain: "dercorus.firebaseapp.com",
  projectId: "dercorus",
  storageBucket: "dercorus.appspot.com",
  messagingSenderId: "150642322415",
  appId: "1:150642322415:web:d901e694147c681af4a41a",
};

let app;
if (!initializeApp?.apps?.length) {
  app = initializeApp(firebaseConfig);
} else {
  app = initializeApp.getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
