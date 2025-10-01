import React, { useState, useEffect } from 'react';
import './AddEvent.css';
import DeleteEvent from './DeleteEvent';

const EditEvent = ({ eventData, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [description, setDescription] = useState('');
  const [attendeeInput, setAttendeeInput] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || '');
      setFromTime(eventData.fromTime || '');
      setToTime(eventData.toTime || '');
      setDescription(eventData.description || '');
      setAttendees(eventData.attendees || []);
      setDate(eventData.date ? new Date(eventData.date).toDateString() : '');
    }
  }, [eventData]);

  const handleAddAttendee = () => {
    if (attendeeInput.trim()) {
      setAttendees([...attendees, attendeeInput.trim()]);
      setAttendeeInput('');
    }
  };

  const handleRemoveAttendee = (idx) => {
    setAttendees(attendees.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...eventData,
      title,
      fromTime,
      toTime,
      description,
      attendees,
      date: eventData.date,
    });
  };

  return (
  <form className="add-event-popup-content" onSubmit={handleSubmit} data-testid="edit-event-form">
      {/* Left: Event Fields */}
      <div className="add-event-left">
        <div>
          <label htmlFor="edit-title">Title:</label>
          <input id="edit-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="edit-date">Date:</label>
          <input id="edit-date" type="text" value={date} readOnly />
        </div>
        <div>
          <label htmlFor="edit-fromTime">From:</label>
          <input id="edit-fromTime" type="time" value={fromTime} onChange={e => setFromTime(e.target.value)} required />
          <label htmlFor="edit-toTime" style={{ marginLeft: '10px' }}>To:</label>
          <input id="edit-toTime" type="time" value={toTime} onChange={e => setToTime(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="edit-description">Description:</label>
          <textarea id="edit-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </div>
      </div>
      {/* Right: Attendees */}
      <div className="add-event-right">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Add attendee"
            value={attendeeInput}
            onChange={e => setAttendeeInput(e.target.value)}
          />
          <button type="button" onClick={handleAddAttendee} style={{ marginLeft: '8px' }}>+</button>
        </div>
        <ul>
          {attendees.map((name, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
              <span>{name}</span>
              <button
                type="button"
                onClick={() => handleRemoveAttendee(idx)}
                style={{ marginLeft: 8, color: 'red' }}
              >x</button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
          <DeleteEvent eventData={eventData} onDelete={onDelete} />
        </div>
      </div>
    </form>
  );
};

export default EditEvent;