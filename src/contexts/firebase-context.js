import React, { createContext } from "react";
import { getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore/lite";
import { Auth, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJTftITSZJV3cqBY4QneTzUwS25rub_sI",
  authDomain: "dercorus.firebaseapp.com",
  projectId: "dercorus",
  storageBucket: "dercorus.appspot.com",
  messagingSenderId: "150642322415",
  appId: "1:150642322415:web:d901e694147c681af4a41a",
};
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export const FirebaseContext = createContext({
  db: db,
  auth: auth,
});

function FireBaseProvider({ children }) {
  return (
    <FirebaseContext.Provider value={{ db: db, auth: auth }}>{children}</FirebaseContext.Provider>
  );
}

export default FireBaseProvider;
