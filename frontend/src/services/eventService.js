import api from './api.js';

// Event service for handling all event-related API calls
export const eventService = {
  // Get all events
  getAllEvents: () => 
    api.get('/events'),
  
  // Get single event by ID
  getEventById: (id) => 
    api.get(`/events/${id}`),
  
  // Create new event
  createEvent: (eventData) => 
    api.post('/events', eventData),
  
  // Join an event
  joinEvent: (eventId) => 
    api.post(`/events/${eventId}/join`),
  
  // Leave an event
  leaveEvent: (eventId) => 
    api.post(`/events/${eventId}/leave`),
};