import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../Calendar/Calendar';

describe('Calendar', () => {
  it('renders calendar container', () => {
    render(<Calendar />);
    // Check for the calendar container by class or role
    expect(document.querySelector('.calendar-container')).toBeInTheDocument();
  });

  it('opens add event popup when + is clicked', () => {
    render(<Calendar />);
    // Find the + button by text, fallback to querySelector if needed
    const addButtons = screen.queryAllByText('+');
    if (addButtons.length > 0) {
      fireEvent.click(addButtons[0]);
    } else {
      // fallback: find by class if not found by text
      const plus = document.querySelector('.add-icon');
      fireEvent.click(plus);
    }
    // Check for popup by label or Save button
    expect(screen.getByText(/save/i)).toBeInTheDocument();
  });
});
