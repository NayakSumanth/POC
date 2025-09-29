import React, { useState, useEffect } from 'react';
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
  const defaultEvents = [
    {
      title: 'Team Meeting',
      date: '2025-09-25',
      fromTime: '10:00',
      toTime: '11:00',
      description: 'Monthly team sync-up.',
      attendees: ['Alice', 'Bob', 'Charlie']
    },
    {
      title: 'Project Deadline',
      date: '2025-09-28',
      fromTime: '09:00',
      toTime: '17:00',
      description: 'Final submission for Q3 project.',
      attendees: ['Project Team']
    },
    {
      title: 'Client Call',
      date: '2025-09-30',
      fromTime: '15:00',
      toTime: '16:00',
      description: 'Discuss requirements with client.',
      attendees: ['Alice', 'Client']
    }
  ];

  const [events, setEvents] = useState([]);

  // Load events from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('calendar_events');
    if (stored) {
      setEvents(JSON.parse(stored).map(ev => ({ ...ev, date: new Date(ev.date) })));
    } else {
      setEvents(defaultEvents.map(ev => ({ ...ev, date: new Date(ev.date) })));
    }
  }, []);
  const [editMode, setEditMode] = useState(false);

  // No need to fetch events.json, events are imported as a module

  const handleAddEvent = (date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setEditMode(false);
    setShowPopup(true);
  };

  // FullCalendar passes an EventApi object to eventClick, not your raw event
  const handleEventClick = (arg) => {
    // If arg has .event, it's a FullCalendar eventClick
    const fcEvent = arg.event;
    if (fcEvent) {
      // Get extendedProps and other fields
      const eventData = {
        title: fcEvent.title,
        date: fcEvent.start,
        fromTime: fcEvent.extendedProps.fromTime || '',
        toTime: fcEvent.extendedProps.toTime || '',
        description: fcEvent.extendedProps.description || '',
        attendees: fcEvent.extendedProps.attendees || [],
      };
      setSelectedEvent(eventData);
    } else {
      // Fallback for manual event click (shouldn't happen)
      setSelectedEvent(arg);
    }
    setEditMode(true);
    setShowPopup(true);
  };

  const handleSaveEvent = (eventData) => {
    let updatedEvents;
    if (editMode && selectedEvent) {
      // Update event
      updatedEvents = events.map(ev =>
        ev === selectedEvent ? { ...eventData } : ev
      );
    } else {
      // Add new event
      updatedEvents = [...events, eventData];
    }
    setEvents(updatedEvents);
    // Save to localStorage
    localStorage.setItem('calendar_events', JSON.stringify(updatedEvents));
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
        events={events.map(ev => ({
          title: ev.title,
          start: ev.date,
          fromTime: ev.fromTime,
          toTime: ev.toTime,
          description: ev.description,
          attendees: ev.attendees,
        }))}
        dayCellContent={(e) => (
          <div className="day-cell">
            <span className="day-number left-align">{e.date.getDate()}</span>
            <span className="add-icon" onClick={() => handleAddEvent(e.date)} style={{ cursor: 'pointer', marginLeft: 4 }}>+</span>
          </div>
        )}
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
