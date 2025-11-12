import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService.js';
import { useAuth } from '../context/AuthContext.jsx';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch all events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load events. Please try again later.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time to 12-hour format
  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="events-header">
        <h1 className="events-title">Upcoming Events</h1>
        {user && (
          <Link to="/create-event" className="btn btn-primary">
            + Create New Event
          </Link>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {events.length === 0 ? (
        <div className="message info">
          <h3>No Events Found</h3>
          <p>
            {user 
              ? 'Be the first to create an event!' 
              : 'No events have been created yet. Sign up to create the first event!'
            }
          </p>
          {!user && (
            <Link to="/signup" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Sign Up Now
            </Link>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3 className="event-title">{event.title}</h3>
              
              <p className="event-description">
                {event.description || 'No description provided.'}
              </p>
              
              <div className="event-meta">
                <div>
                  <strong>Date:</strong> {formatDate(event.event_date)}
                </div>
                <div>
                  <strong>Time:</strong> {formatTime(event.event_time)}
                </div>
                <div>
                  <strong>Location:</strong> {event.location}
                </div>
                <div>
                  <strong>Attendees:</strong> {event.attendee_count}
                </div>
                <div className="event-creator">
                  Created by: {event.creator_name}
                </div>
              </div>
              
              <Link 
                to={`/events/${event.id}`} 
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                View Details & RSVP
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;