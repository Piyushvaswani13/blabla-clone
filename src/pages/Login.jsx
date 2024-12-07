import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches valid email formats
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Email validation
    if (!validateEmail(email)) {
      alert("Error: Invalid email address format.");
      return;
    }

    // Password validation
    if (password.length < 8) {
      alert("Error: Password must be at least 8 characters long.");
      return;
    }

    try {
      const userDetails = await signInWithEmailAndPassword(auth, email, password);
      console.log('userDetails=', userDetails);
      alert('Login successful!');
      navigate('/home', { replace: true });
    } catch (error) {
      console.error("Login Failed: ", error.message);
      alert("Login Failed! Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <img src="/BlaBlaCar.png" alt="Logo" className="logo" />
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <button type="submit" className="login-btn">Log In</button>
      </form>
    </div>
  );
}

export default Login;
