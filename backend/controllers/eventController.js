import { pool } from '../config/database.js';

// Get all events with attendee count
export const getAllEvents = async (req, res) => {
  try {
    const events = await pool.query(`
      SELECT 
        e.*,
        u.name as creator_name,
        COUNT(ea.id) as attendee_count
      FROM events e
      LEFT JOIN users u ON e.creator_id = u.id
      LEFT JOIN event_attendees ea ON e.id = ea.event_id
      GROUP BY e.id, u.name
      ORDER BY e.event_date, e.event_time
    `);

    res.json(events.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get single event with attendees list
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const eventResult = await pool.query(`
      SELECT 
        e.*,
        u.name as creator_name
      FROM events e
      LEFT JOIN users u ON e.creator_id = u.id
      WHERE e.id = $1
    `, [id]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.rows[0];

    // Get attendees for this event
    const attendeesResult = await pool.query(`
      SELECT u.id, u.name, u.email, ea.joined_at
      FROM event_attendees ea
      JOIN users u ON ea.user_id = u.id
      WHERE ea.event_id = $1
      ORDER BY ea.joined_at
    `, [id]);

    event.attendees = attendeesResult.rows;

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

// Create new event (only for logged-in users)
export const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, event_time, location } = req.body;
    const creator_id = req.userId;

    // Validation for required fields
    if (!title || !event_date || !event_time || !location) {
      return res.status(400).json({ error: 'Title, date, time, and location are required' });
    }

    const newEvent = await pool.query(`
      INSERT INTO events (title, description, event_date, event_time, location, creator_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [title, description, event_date, event_time, location, creator_id]);

    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent.rows[0]
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Join event (RSVP functionality)
export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId;

    // Check if event exists
    const eventResult = await pool.query('SELECT id FROM events WHERE id = $1', [eventId]);
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user already joined (prevent duplicate joins)
    const existingJoin = await pool.query(
      'SELECT id FROM event_attendees WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    if (existingJoin.rows.length > 0) {
      return res.status(400).json({ error: 'Already joined this event' });
    }

    // Add user to event attendees
    await pool.query(
      'INSERT INTO event_attendees (event_id, user_id) VALUES ($1, $2)',
      [eventId, userId]
    );

    res.json({ message: 'Successfully joined the event' });
  } catch (error) {
    console.error('Join event error:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
};

// Leave event (Remove RSVP)
export const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId;

    await pool.query(
      'DELETE FROM event_attendees WHERE event_id = $1 AND user_id = $2',
      [eventId, userId]
    );

    res.json({ message: 'Successfully left the event' });
  } catch (error) {
    console.error('Leave event error:', error);
    res.status(500).json({ error: 'Failed to leave event' });
  }
};