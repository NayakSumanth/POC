import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditEvent from '../Events/EditEvent';

describe('EditEvent', () => {
  const eventData = {
    title: 'Edit Me',
    date: '2025-10-01',
    fromTime: '10:00',
    toTime: '11:00',
    description: 'Edit this event',
    attendees: ['Alice']
  };

  it('renders with event data', () => {
    render(<EditEvent eventData={eventData} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('11:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit this event')).toBeInTheDocument();
  });

  it('calls onSave when form is submitted', () => {
    const onSave = jest.fn();
    render(<EditEvent eventData={eventData} onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Changed' } });
  fireEvent.submit(screen.getByTestId('edit-event-form'));
    expect(onSave).toHaveBeenCalled();
  });
});
