import moment from 'moment';

// eslint-disable-next-line complexity
function getTimeTemplate(event, isAllDay) {
  const html = [];

  if (!isAllDay) {
    html.push(`<strong>${moment(event.start.getTime()).format('HH:mm')}</strong> `);
  }
  if (event.isPrivate) {
    html.push('<span class="calendar-font-icon ic-lock-b"></span>');
    html.push(' Private');
  } else {
    if (event.isReadOnly) {
      html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
    } else if (event.recurrenceRule) {
      html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
    } else if (event.attendees.length) {
      html.push('<span class="calendar-font-icon ic-user-b"></span>');
    } else if (event.location) {
      html.push('<span class="calendar-font-icon ic-location-b"></span>');
    }
    html.push(` ${event.title}`);
  }

  return html.join('');
}

const CalendarTemplate = {
  milestone(event) {
    return `<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ${event.bgColor}">${event.title}</span>`;
  },
  allday(event) {
    return getTimeTemplate(event, true);
  },
  time(event) {
    return getTimeTemplate(event, false);
  },
};

export default CalendarTemplate;
