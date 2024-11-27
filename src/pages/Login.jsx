// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userDetails= await signInWithEmailAndPassword(auth, email, password);
      console.log('userDetails=',userDetails)
      alert('Login successful!');
      navigate('/home');
    } catch (error) {
      alert("Login Failed!");
    }
  };
//cookie 
// const uid = "I4WCueo15pa3g6dCBQooQRhzwii1";
// document.cookie = `uid=${uid}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`;

// // Read the cookie
//  function getCookie(name) {
//   const cookies = document.cookie.split('; ');
//   for (let cookie of cookies) {
//     const [key, value] = cookie.split('=');
//     if (key === name) return value;
//   }
//   return null;
// }

// console.log("Stored UID:", getCookie('uid'));


  return (
    <div>
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
export default Login;
