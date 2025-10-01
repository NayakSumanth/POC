import React, { useState } from 'react';
import './AddEvent.css';

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
    // Always save date as 'YYYY-MM-DD' string to avoid timezone issues
    let dateStr = selectedDate;
    if (selectedDate instanceof Date) {
      dateStr = selectedDate.toISOString().slice(0, 10);
    } else if (typeof selectedDate === 'string') {
      // If string but not in YYYY-MM-DD, try to parse and convert
      if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
        const d = new Date(selectedDate);
        if (!isNaN(d)) {
          dateStr = d.toISOString().slice(0, 10);
        }
      }
    }
    onSave({
      title,
      date: dateStr,
      fromTime,
      toTime,
      description,
      attendees,
    });
    onClose();
  };

  return (
  <form className="add-event-popup-content" onSubmit={handleSubmit} data-testid="add-event-form">
      {/* Left: Event Fields */}
      <div className="add-event-left">
        <div>
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="text"
            value={
              selectedDate
                ? (selectedDate instanceof Date
                    ? selectedDate.toDateString()
                    : (() => {
                        // If string in YYYY-MM-DD, format as readable
                        const d = new Date(selectedDate);
                        return isNaN(d) ? selectedDate : d.toDateString();
                      })()
                  )
                : ''
            }
            readOnly
          />
        </div>
        <div>
          <label htmlFor="fromTime">From:</label>
          <input id="fromTime" type="time" value={fromTime} onChange={e => setFromTime(e.target.value)} required />
          <label htmlFor="toTime" style={{ marginLeft: '10px' }}>To:</label>
          <input id="toTime" type="time" value={toTime} onChange={e => setToTime(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
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