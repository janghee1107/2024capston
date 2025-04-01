/* eslint-disable require-jsdoc */
const calendarList = [];

function CalendarInfo() {
  this.id = null;
  this.name = null;
  this.checked = true;
  this.color = null;
  this.backgroundColor = null;
  this.borderColor = null;
}

function addCalendar(calendar) {
  calendarList.push(calendar);
}

function initialize() {
  let calendar;
  let id = 0;

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Family';
  calendar.color = '#000000'; // 연한 파랑색 : 평온함과 신뢰
  calendar.backgroundColor = '#add8e6'; 
  calendar.dragBackgroundColor = '#add8e6'; 
  calendar.borderColor = '#add8e6'; 
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Friends'
  calendar.color = '#000000'; // 연두색 : 생기와 활기
  calendar.backgroundColor = '#90ee90';
  calendar.dragBackgroundColor = '#90ee90';
  calendar.borderColor = '#90ee90';  
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Work';
  calendar.color = '#ffffff'; // 짙은 회색 : 전문성과 안전성
  calendar.backgroundColor = '#696969';
  calendar.dragBackgroundColor = '#696969';
  calendar.borderColor = '#696969';  
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Certification';
  calendar.color = '#000000'; // 주황색 : 열정과 에너지
  calendar.backgroundColor = '#ffa500';
  calendar.dragBackgroundColor = '#ffa500';
  calendar.borderColor = '#ffa500';  
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Travel';
  calendar.color = '#000000'; // 하늘색 : 자유와 탐험
  calendar.backgroundColor = '#87ceeb';
  calendar.dragBackgroundColor = '#87ceeb';
  calendar.borderColor = '#87ceeb';  
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Hobbies';
  calendar.color = '#000000'; // 분홍색 : 즐거움과 창의성
  calendar.backgroundColor = '#ffb6c1';
  calendar.dragBackgroundColor = '#ffb6c1';
  calendar.borderColor = '#ffb6c1';
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'Birthdays';
  calendar.color = '#000000'; // 연한 보라색 : 축하
  calendar.backgroundColor = '#d8bfd8'; 
  calendar.dragBackgroundColor = '#d8bfd8'; 
  calendar.borderColor = '#d8bfd8'; 
  addCalendar(calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = 'etc';
  calendar.color = '#ffffff'; // 기타
  calendar.backgroundColor = '#9d9d9d';
  calendar.dragBackgroundColor = '#9d9d9d';
  calendar.borderColor = '#9d9d9d';
  addCalendar(calendar);
}

function findCalendar(id) {
  let found;

  calendarList.forEach(function (calendar) {
    if (calendar.id === id) {
      found = calendar;
    }
  });

  return found;
}

initialize();

export { calendarList, findCalendar };
