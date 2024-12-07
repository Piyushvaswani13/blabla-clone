import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches valid email formats
    return emailRegex.test(email);
  };

  const validateContact = (contact) => {
    const contactRegex = /^[0-9]{10}$/; // Matches exactly 10 digits
    return contactRegex.test(contact);
  };

  const validateUsername = (name) => {
    const usernameRegex = /^[A-Za-z\s]+$/; // Matches only letters and spaces
    return usernameRegex.test(name);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Username validation
    if (!validateUsername(name)) {
      alert("Error: Username should only contain letters and spaces.");
      return;
    }

    // Contact number validation
    if (!validateContact(contact)) {
      alert("Error: Contact number must be exactly 10 digits.");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      alert("Error: Invalid email address format.");
      return;
    }

    // Password validation
    if (password !== confirmPassword) {
      alert("Error: Passwords do not match. Please check and try again.");
      return;
    }

    if (password.length < 6) {
      alert("Error: Password must be at least 6 characters long.");
      return;
    }

    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user information in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        name,
        contact,
        createdAt: new Date(),
      });

      alert("Signup Successful! Welcome to BlaBlaCar!");
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Signup Failed: ", error.message);
      alert(`Signup Failed: ${error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <img src="/BlaBlaCar.png" alt="Logo" className="logo" />
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Contact Number"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </span>
        </div>
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
