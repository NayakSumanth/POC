import React, { useState } from 'react';
import './AddEvent.css'; // Optional: for custom styles

const AddEvent = ({ selectedDate, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [description, setDescription] = useState('');
  const [attendeeInput, setAttendeeInput] = useState('');
  const [attendees, setAttendees] = useState([]);

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
      title,
      date: selectedDate,
      fromTime,
      toTime,
      description,
      attendees,
    });
    onClose();
  };

  return (
    <form className="add-event-popup-content" onSubmit={handleSubmit}>
      {/* Left: Event Fields */}
      <div className="add-event-left">
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Date:</label>
          <input type="text" value={selectedDate ? selectedDate.toDateString() : ''} readOnly />
        </div>
        <div>
          <label>From:</label>
          <input type="time" value={fromTime} onChange={e => setFromTime(e.target.value)} required />
          <label style={{ marginLeft: '10px' }}>To:</label>
          <input type="time" value={toTime} onChange={e => setToTime(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
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
            {attendees.map((name, idx) => (-
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
        <div style={{ marginTop: 'auto' }}>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </div>
    </form>
  );
};

export default AddEvent;