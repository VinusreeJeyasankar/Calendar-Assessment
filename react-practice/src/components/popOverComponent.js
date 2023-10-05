import React from "react";

function PopoverComponent({ events, onEventClick, onClose }) {
    return (
      <div className="popover-content">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {events.map((event, index) => (
          <div key={index} onClick={() => onEventClick(event)}>
            {event.title}
          </div>
        ))}
      </div>
    );
  }
export default PopoverComponent;