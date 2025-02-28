import React, { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);

  const onChange = (newDate) => {
    setDate(newDate);
    setShowCalendar(false); // Hide calendar after selecting a date
  };

  const handleInputClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleClickOutside = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={calendarRef}>
      <input
        type="text"
        value={date.toDateString()}
        onClick={handleInputClick}
        readOnly
      />
      {showCalendar && (
        <Calendar onChange={onChange} value={date} />
      )}
    </div>
  );
};

export default CalendarComponent;
