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

  return (
    <div className="login-container">
      <img src="/BlaBlaCar.png" alt="Logo" className="logo" />
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="login-btn">Log In</button>
      </form>
    </div>
  );
}

export default Login;
