import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService.js';
import { useAuth } from '../context/AuthContext.jsx';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useAuth();

  // Fetch event details when component mounts or ID changes
  useEffect(() => {
    fetchEvent();
  }, [id]);

  // Fetch single event details
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load event details. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is attending the event
  const isUserAttending = () => {
    if (!user || !event || !event.attendees) return false;
    return event.attendees.some(attendee => attendee.id === user.id);
  };

  // Handle joining an event
  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      await eventService.joinEvent(id);
      setMessage({ type: 'success', text: 'Successfully joined the event!' });
      // Refresh event data to show updated attendees list
      fetchEvent();
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to join event. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle leaving an event
  const handleLeave = async () => {
    setActionLoading(true);
    try {
      await eventService.leaveEvent(id);
      setMessage({ type: 'success', text: 'Successfully left the event!' });
      // Refresh event data to show updated attendees list
      fetchEvent();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to leave event. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
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

  // Format timestamp for attendee join time
  const formatJoinTime = (timestamp) => {
    return new Date(timestamp).toLocaleDateString() + ' at ' + 
           new Date(timestamp).toLocaleTimeString([], { 
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
        <p>Loading event details...</p>
      </div>
    );
  }

  // Show error if event not found
  if (!event) {
    return (
      <div className="message error">
        <h3>Event Not Found</h3>
        <p>The event you're looking for doesn't exist or may have been removed.</p>
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Back to Events
        </button>
      </div>
    );
  }

  const userIsAttending = isUserAttending();

  return (
    <div className="event-details">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="event-details-header">
        <h1 className="event-details-title">{event.title}</h1>
        <div className="event-details-meta">
          <div><strong>Date:</strong> {formatDate(event.event_date)}</div>
          <div><strong>Time:</strong> {formatTime(event.event_time)}</div>
          <div><strong>Location:</strong> {event.location}</div>
          <div><strong>Created by:</strong> {event.creator_name}</div>
        </div>
      </div>

      <div className="event-details-description">
        <h3>About This Event</h3>
        <p>{event.description || 'No description provided for this event.'}</p>
      </div>

      {/* Event actions (Join/Leave buttons) */}
      {user && (
        <div className="event-actions">
          {userIsAttending ? (
            <button 
              onClick={handleLeave}
              disabled={actionLoading}
              className="btn btn-danger"
              style={{ minWidth: '120px' }}
            >
              {actionLoading ? 'Leaving...' : 'Leave Event'}
            </button>
          ) : (
            <button 
              onClick={handleJoin}
              disabled={actionLoading}
              className="btn btn-success"
              style={{ minWidth: '120px' }}
            >
              {actionLoading ? 'Joining...' : 'Join Event'}
            </button>
          )}
        </div>
      )}

      {/* Prompt for non-logged in users */}
      {!user && (
        <div className="message info">
          <p>
            Please <Link to="/login">login</Link> or <Link to="/signup">sign up</Link> to join this event.
          </p>
        </div>
      )}

      {/* Attendees section */}
      <div className="attendees-section">
        <h3>
          Attendees ({event.attendees ? event.attendees.length : 0})
        </h3>
        <div className="attendees-list">
          {event.attendees && event.attendees.length > 0 ? (
            event.attendees.map((attendee, index) => (
              <div key={attendee.id} className="attendee-item">
                <span>
                  {index + 1}. {attendee.name} 
                  {attendee.id === event.creator_id && ' (Organizer)'}
                </span>
                <small>Joined: {formatJoinTime(attendee.joined_at)}</small>
              </div>
            ))
          ) : (
            <div className="message info">
              No attendees yet. Be the first to join!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;