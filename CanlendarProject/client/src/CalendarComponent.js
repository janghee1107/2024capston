import React, { useEffect, useRef, useState } from 'react';
import Calendar,{TZDate} from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.css'; // 올바른 CSS 경로
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import { calendarList } from './Components/DefaultCalendarList';
import CalendarTemplate from './Components/CalendarTemplate';
import { generateEvents } from './Components/GenerateSchedules';
import axios from 'axios';
import CalendarViewButtons from './Components/CalendarViewButtons'; // 버튼 컴포넌트
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; // 왼쪽/오른쪽 화살표 아이콘
import './App.css';

const CalendarComponent = () => {
  const calendarRef = useRef(null);
  const [schedules, setSchedules] = useState([]);
  const [calendar, setCalendar] = useState(null); // 캘린더 인스턴스 상태 추가
  const [renderRange, setRenderRange] = useState(''); // 날짜 범위 상태 추가
  const [theme, setTheme] = useState('red'); // 추가: 테마 상태

    const setRenderRangeText = () => {
      if (calendar) {
        const options = calendar.getOptions();
        const viewName = calendar.getViewName();
        const html = [];
  
        if (viewName === 'day') {
          html.push(moment(calendar.getDate().getTime()).format('YYYY.MM.DD'));
        } else if (viewName === 'month') {
          html.push(moment(calendar.getDate().getTime()).format('YYYY.MM'));
        } else if (viewName === 'week') {
          html.push(moment(calendar.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
          html.push(' ~ ');
          html.push(moment(calendar.getDateRangeEnd().getTime()).format(' MM.DD'));
        }
  
        setRenderRange(html.join(''));
      }
    };
  
    const onClickNavi = (action) => {
      if (calendar) {
        switch (action) {
          case 'move-prev':
            calendar.prev();
            break;
          case 'move-next':
            calendar.next();
            break;
          case 'move-today':
            calendar.today();
            break;
          default:
            return;
        }
  
        setRenderRangeText(); // 날짜 범위 갱신
      }
    };

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      defaultView: 'month',
      useFormPopup: true,
      useDetailPopup: true,
      calendars: calendarList,
      
    });
  
    setCalendar(calendar); // 캘린더 인스턴스를 상태로 저장 추가

    const fetchSchedules = async () => {
      const memberId = sessionStorage.getItem("storeid"); // sessionStorage에서 memberId 가져오기
      try {
        const response = await axios.get(`http://localhost:5000/api/schedules?memberId=${memberId}`);

        response.data.forEach(event => {
          // 각 이벤트의 속성을 직접 수정
          // event.start = new Date(event.start);
          // event.end = new Date(event.end);
          //calendar.createEvents([event]);
          console.log(event);
        });
        
        setSchedules(response.data);
        calendar.createEvents(response.data);
         // 가져온 일정으로 캘린더 업데이트
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      }
    };
  
    fetchSchedules();
  
    // 일정 생성 이벤트 핸들러
    
    calendar.on({
      beforeCreateEvent: (eventData) => {
        const memberId = parseInt(sessionStorage.getItem("storeid")); // sessionStorage에서 memberId 가져오기
        const event = {      
          memberId,
          calendarId: eventData.calendarId,
          title: eventData.title,
          isAllday: eventData.isAllday,
          start: new Date(new TZDate(eventData.start)),
          end: new Date(new TZDate(eventData.end)),
          category: eventData.isAllday ? 'allday' : 'time',          
          location: eventData.location,
          state: eventData.state,
        };

        axios.post('http://localhost:5000/api/schedules', event)
        .then(response => {

          const responseData = response.data;

          // 응답받은 데이터의 start와 end를 TZDate로 변환하고 시간대 조정
          responseData.start = new TZDate(responseData.start);
          responseData.end = new TZDate(responseData.end);
  
          calendar.createEvents([responseData]);
          console.log(responseData);
          
        })
        .catch(error => {
          console.error('Error creating schedule:', error);
        });

      },
      beforeUpdateEvent: (e) => {
        const { event, changes } = e;
        const memberId = parseInt(sessionStorage.getItem("storeid")); // sessionStorage에서 memberId 가져오기
        const changesData = {          
          memberId,
          calendarId: changes.calendarId ?? event.calendarId,  // 변경된 값이 없으면 기존 값 사용
          title: changes.title ?? event.title,
          isAllday: changes.isAllday !== undefined ? changes.isAllday : event.isAllday,  // 변경되지 않으면 기존 값 사용
          start: changes.start ? new Date(changes.start.getTime()) : new Date(event.start.getTime()),
          end: changes.end ? new Date(changes.end.getTime()) : new Date(event.end.getTime()),
          category: changes.isAllday !== undefined ? (changes.isAllday ? 'allday' : 'time') : event.category,  // 변경되지 않으면 기존 값 사용
          location: changes.location ?? event.location,
          state: changes.state ?? event.state,
        };

        const putData = {
          ...changesData,
          start: changesData.start.toString(),
          end: changesData.end.toString(),
        }
        console.log('Schedule updated successfully:tprtm', putData);
        axios.put(`http://localhost:5000/api/schedules/${event.id}`, changesData)
          .then(response => {
            calendar.updateEvent(event.id, event.calendarId, changesData);
            console.log('Schedule updated successfully:', changesData);
          })
          .catch(error => {
            console.error('Error updating schedule:', error);
          });
      },

      beforeDeleteEvent: (event) => {
        axios.delete(`http://localhost:5000/api/schedules/${event.id}`)
          .then(() => {
            calendar.deleteEvent(event.id, event.calendarId);
            console.log('Schedule deleted successfully');
          })
          .catch(error => {
            console.error('Error deleting schedule:', error);
          });
      },
    });

     // 초기 날짜 범위 설정
     setRenderRangeText();
  
    return () => {
      calendar.destroy(); // 컴포넌트 언마운트 시 캘린더 인스턴스 정리
    };
  }, []);
  

   // 뷰 변경 함수 추가
   const handleViewChange = (view) => {
    if (calendar) {
      calendar.changeView(view); // 선택된 뷰로 캘린더 전환
      setRenderRangeText(); // 뷰 전환 후 날짜 범위 갱신 
    }
  };

  // 테마 변경
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };
  

  return (
    <div className={`calendar-container theme-${theme}`}>
      {/* 상단 메뉴 */}
      <div>
        <CalendarViewButtons onViewChange={handleViewChange} /> {/* 뷰 변경 버튼 렌더링 */}        
      <div id="calendarMenu">
        <div className="calendar-controls">
          <div id="menu-navi">
            <button
              type="button"
              className="calendar-btn calendar-move-today"
              onClick={() => onClickNavi('move-today')}
            >
              Today
            </button>
            <button
              type="button"
              className="calendar-btn calendar-move-day"
              onClick={() => onClickNavi('move-prev')}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              type="button"
              className="calendar-btn calendar-move-day"
              onClick={() => onClickNavi('move-next')}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          <span className="calendar-render-range">{renderRange}</span>
        </div>
        </div>
        <div className="theme-selector">
          <label htmlFor="theme">테마 선택:</label>
          <select id="theme" value={theme} onChange={handleThemeChange}>
            <option value="red">빨강</option>
            <option value="orange">주황</option>
            <option value="yellow">노랑</option>
            <option value="green">초록</option>
            <option value="blue">파랑</option>
            <option value="indigo">남색</option>
            <option value="violet">보라</option>
          </select>
        </div>
      </div>

      {/* 캘린더 */}
      <div ref={calendarRef} style={{ height: '720px' }}></div>
    </div>
    </div>
  );
};

export default CalendarComponent;

