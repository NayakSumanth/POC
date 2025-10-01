import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Calendar.css';
import AddEvent from '../Events/AddEvent';
import EditEvent from '../Events/EditEvent';

const Calendar = () => {
  // Delete event handler
  const handleDeleteEvent = (eventData) => {
    // Remove event by matching unique fields
    const filteredEvents = events.filter(ev =>
      !(
        ev.title === eventData.title &&
        String(ev.date) === String(eventData.date) &&
        ev.fromTime === eventData.fromTime &&
        ev.toTime === eventData.toTime
      )
    );
    setEvents(filteredEvents);
    localStorage.setItem('calendar_events', JSON.stringify(filteredEvents));
    setShowPopup(false);
    setSelectedEvent(null);
    setEditMode(false);
  };
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
      setEvents(JSON.parse(stored));
    } else {
      setEvents(defaultEvents);
    }
  }, []);
  const [editMode, setEditMode] = useState(false);


  const handleAddEvent = (date) => {
    // Format date as 'YYYY-MM-DD' in local time to avoid timezone issues
    const dateStr = date instanceof Date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      : date;
    setSelectedDate(dateStr);
    setSelectedEvent(null);
    setEditMode(false);
    setShowPopup(true);
  };

  const handleEventClick = (arg) => {
    const fcEvent = arg.event;
    if (fcEvent) {
      const eventData = {
        title: fcEvent.title,
        // Always use YYYY-MM-DD string for date
        date: fcEvent.startStr,
        fromTime: fcEvent.extendedProps.fromTime || '',
        toTime: fcEvent.extendedProps.toTime || '',
        description: fcEvent.extendedProps.description || '',
        attendees: fcEvent.extendedProps.attendees || [],
      };
      setSelectedEvent(eventData);
    } else {
      setSelectedEvent(arg);
    }
    setEditMode(true);
    setShowPopup(true);
  };

  const handleSaveEvent = (eventData) => {
    // Always store date as YYYY-MM-DD string
    const eventToSave = { ...eventData, date: typeof eventData.date === 'string' ? eventData.date : (eventData.date instanceof Date ? eventData.date.toISOString().slice(0, 10) : String(eventData.date)) };
    let updatedEvents;
    if (editMode && selectedEvent) {
      updatedEvents = events.map(ev => {
        if (
          ev.title === selectedEvent.title &&
          String(ev.date) === String(selectedEvent.date) &&
          ev.fromTime === selectedEvent.fromTime &&
          ev.toTime === selectedEvent.toTime
        ) {
          return { ...eventToSave };
        }
        return ev;
      });
    } else {
      updatedEvents = [...events, eventToSave];
    }
    setEvents(updatedEvents);
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
          start: ev.date, // always a YYYY-MM-DD string
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
              onDelete={handleDeleteEvent}
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
