import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Basic client-side validation
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      setLoading(false);
      return;
    }

    // Attempt login
    const result = await login(email, password);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      // Redirect to home page after successful login
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login to Your Account</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="loading-spinner" style={{ 
                display: 'inline-block', 
                width: '16px', 
                height: '16px', 
                marginRight: '8px' 
              }}></div>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ fontWeight: '600' }}>
          Create one here
        </Link>
      </p>
    </div>
  );
};

export default Login;