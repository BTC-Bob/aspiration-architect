import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBU1SoZTVe-JYcwivpHtg7Kj2ZxWG4pJ1g",
	authDomain: "aspiration-architect-b90be.firebaseapp.com",
	projectId: "aspiration-architect-b90be",
	storageBucket: "aspiration-architect-b90be.firebasestorage.app",
	messagingSenderId: "140808598138",
	appId: "1:140808598138:web:56aae5fcc904ef4b43c1c3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// --- UPDATED PROVIDER ---
export const googleProvider = new GoogleAuthProvider();
// Request Calendar Read-Only Access
googleProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');

export default app;
