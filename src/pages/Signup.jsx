import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import './Signup.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setUsername] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
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

      alert("Signup Successful!");
      navigate('/login'); // Redirect to login page after signup
    } catch (error) {
      console.error("Signup Failed: ", error);
      alert("Signup Failed!");
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
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit" className="signup-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
