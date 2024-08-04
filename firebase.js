import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAoEWAoDasQo5d0OGikhl74vSDOEZIkkg",
  authDomain: "track-now-1bf7b.firebaseapp.com",
  projectId: "track-now-1bf7b",
  storageBucket: "track-now-1bf7b.appspot.com",
  messagingSenderId: "1024831002542",
  appId: "1:1024831002542:web:363efbe8f254e399b05a3f",
  measurementId: "G-N58VWY3RF5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
