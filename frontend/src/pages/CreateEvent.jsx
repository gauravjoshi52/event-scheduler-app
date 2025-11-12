import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService.js';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    event_time: '',
    location: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Client-side validation
    if (!formData.title.trim() || !formData.event_date || !formData.event_time || !formData.location.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setLoading(false);
      return;
    }

    // Check if date is in the future
    const selectedDate = new Date(formData.event_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setMessage({ type: 'error', text: 'Event date must be in the future' });
      setLoading(false);
      return;
    }

    try {
      // Send event data to API
      const response = await eventService.createEvent(formData);
      setMessage({ type: 'success', text: 'Event created successfully! Redirecting...' });
      
      // Redirect to events page after successful creation
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create event. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for date input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h2 className="form-title">Create New Event</h2>
      
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter a descriptive event title"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Event Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your event... What should attendees expect?"
            rows="5"
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="event_date">Event Date *</label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            required
            min={today}
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="event_time">Event Time *</label>
          <input
            type="time"
            id="event_time"
            name="event_time"
            value={formData.event_time}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Event Location *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Where will the event take place?"
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
              Creating Event...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;