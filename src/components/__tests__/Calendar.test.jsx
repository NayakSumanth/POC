import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../Calendar/Calendar';

describe('Calendar', () => {
  it('renders calendar container', () => {
    render(<Calendar />);
    expect(document.querySelector('.calendar-container')).toBeInTheDocument();
  });

  it('opens add event popup when + is clicked', () => {
    render(<Calendar />);
    const addButtons = screen.queryAllByText('+');
    if (addButtons.length > 0) {
        fireEvent.click(addButtons[0]);
    }
    else {
        const plus = document.querySelector('.add-icon');
        fireEvent.click(plus);
    }
    expect(screen.getByText(/save/i)).toBeInTheDocument();
  });
});
