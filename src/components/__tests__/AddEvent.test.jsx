import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEvent from '../Events/AddEvent';

describe('AddEvent', () => {
  it('renders form fields', () => {
    render(<AddEvent selectedDate={"2025-10-01"} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('calls onSave when form is submitted', () => {
    const onSave = jest.fn();
    render(<AddEvent selectedDate={"2025-10-01"} onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Event' } });
    fireEvent.change(screen.getByLabelText(/from/i), { target: { value: '10:00' } });
    fireEvent.change(screen.getByLabelText(/to/i), { target: { value: '11:00' } });
  fireEvent.submit(screen.getByTestId('add-event-form'));
    expect(onSave).toHaveBeenCalled();
  });
});
