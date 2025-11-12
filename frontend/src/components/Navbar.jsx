import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          Event Scheduler
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            All Events
          </Link>
          
          {user ? (
            // Show these links when user is logged in
            <>
              <Link to="/create-event" className="nav-link">
                Create Event
              </Link>
              <span className="nav-user">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            // Show these links when user is not logged in
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;