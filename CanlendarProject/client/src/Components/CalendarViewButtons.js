import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // 스타일 추가

const CalendarViewButtons = ({ onViewChange }) => {
  return (
    <div className="calendar-view-buttons">
      {/* 월간 버튼 */}
      <button 
        className="calendar-btn" 
        onClick={() => onViewChange('month')}
      >
        월간
      </button>

      {/* 주간 버튼 */}
      <button 
        className="calendar-btn" 
        onClick={() => onViewChange('week')}
      >
        주간
      </button>

      {/* 일간 버튼 */}
      <button 
        className="calendar-btn" 
        onClick={() => onViewChange('day')}
      >
        일간 
      </button>
    </div>
  );
};

export default CalendarViewButtons;
