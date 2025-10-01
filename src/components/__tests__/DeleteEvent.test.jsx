import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteEvent from '../Events/DeleteEvent';

describe('DeleteEvent', () => {
  it('calls onDelete when delete button is clicked and confirmed', () => {
    const onDelete = jest.fn();
    window.confirm = jest.fn(() => true); //mock confirm true
    render(<DeleteEvent eventData={{ title: 'Test' }} onDelete={onDelete} />);
    fireEvent.click(screen.getByText(/delete/i));
    expect(onDelete).toHaveBeenCalled();
  });

  it('does not call onDelete if not confirmed', () => {
    const onDelete = jest.fn();
    window.confirm = jest.fn(() => false); //mock confirm false
    render(<DeleteEvent eventData={{ title: 'Test' }} onDelete={onDelete} />);
    fireEvent.click(screen.getByText(/delete/i));
    expect(onDelete).not.toHaveBeenCalled();
  });
});
