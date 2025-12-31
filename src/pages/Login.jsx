import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Shield, Lock } from 'lucide-react';

const Login = () => {
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
			const result = await signInWithPopup(auth, googleProvider);

			// --- CAPTURE THE CALENDAR KEY ---
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;

			// Save the key to Local Storage so Dashboard can use it
			if (token) {
				localStorage.setItem('google_access_token', token);
			}

			navigate("/");
		} catch (error) {
			console.error("Login failed:", error);
			alert("Access Denied: " + error.message);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1120] text-white p-4">
			{/* Color Correction: #0f1522 */}
			<div className="max-w-md w-full bg-[#0f1522] border border-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-6 relative overflow-hidden">
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
				<div className="flex justify-center mb-4">
					<div className="p-4 bg-slate-900 rounded-full border border-slate-800 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
						<Shield size={40} className="text-blue-500" />
					</div>
				</div>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Guardian Protocol</h1>
					<p className="text-slate-400 mt-2 text-sm">Identity Verification Required</p>
				</div>
				<button
					onClick={handleLogin}
					className="w-full bg-white text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-slate-200 transition-all shadow-lg hover:scale-[1.02]"
				>
					<img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
					<span>Authenticate with Google</span>
				</button>
				<div className="text-xs text-slate-600 flex items-center justify-center space-x-1 pt-4 border-t border-slate-800">
					<Lock size={10} />
					<span>Secure Connection | Aspiration-Web-App</span>
				</div>
			</div>
		</div>
	);
};

export default Login;
