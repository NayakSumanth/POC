import React from 'react';

// DeleteEvent receives eventData and onDelete callback
const DeleteEvent = ({ eventData, onDelete }) => {
	const handleDelete = () => {
		if (window.confirm('Are you sure you want to delete this event?')) {
			onDelete(eventData);
		}
	};
	return (
		<button type="button" onClick={handleDelete} style={{ color: 'red' }}>Delete</button>
	);
};

export default DeleteEvent;
