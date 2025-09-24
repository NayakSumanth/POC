import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import AddEvent from '../Events/AddEvent';
import EditEvent from '../Events/EditEvent';

const Calendar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const handleAddEvent = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setEditMode(false);
    setShowPopup(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEditMode(true);
    setShowPopup(true);
  };

  const handleSaveEvent = (eventData) => {
    if (editMode && selectedEvent) {
      // Update event
      setEvents(events.map(ev =>
        ev === selectedEvent ? { ...eventData } : ev
      ));
    } else {
      // Add new event
      setEvents([...events, eventData]);
    }
    setShowPopup(false);
    setSelectedEvent(null);
    setEditMode(false);
  };

  return (
    <div className='calendar-container'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={'dayGridMonth'}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height={'100%'}
        editable={true}
        events={events}
        dayCellContent={(e) => {
          const dayEvents = events
            .filter(ev => new Date(ev.date).toDateString() === e.date.toDateString())
            .sort((a, b) => (a.fromTime || '').localeCompare(b.fromTime || ''));
          return (
            <div className="day-cell">
              <span className="day-number left-align">{e.date.getDate()}</span>
              <span className="add-icon" onClick={() => handleAddEvent(e.date)}>+</span>
              <div className="event-list">
                {dayEvents.map((ev, idx) => (
                  <div
                    key={idx}
                    className="calendar-event"
                    onClick={() => handleEventClick(ev)}
                    style={{ cursor: 'pointer' }}
                  >
                    {ev.title} {ev.fromTime && `(${ev.fromTime})`}
                  </div>
                ))}
              </div>
            </div>
          );
        }}
        eventClick={handleEventClick}
      />
      {showPopup && (
        <div className="popup">
          {editMode ? (
            <EditEvent
              eventData={selectedEvent}
              onClose={() => {
                setShowPopup(false);
                setSelectedEvent(null);
                setEditMode(false);
              }}
              onSave={handleSaveEvent}
            />
          ) : (
            <AddEvent
              selectedDate={selectedDate}
              onClose={() => setShowPopup(false)}
              onSave={handleSaveEvent}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
