/* eslint-disable require-jsdoc */
import Chance from 'chance';
import moment from 'moment';

const chance = new Chance();
const EVENT_CATEGORY = ['milestone', 'task'];

let events = [];

function EventObject() {
  this.id = null;
  this.calendarId = null;

  this.title = null;
  this.isAllday = false;
  this.start = null;
  this.end = null;
  this.category = '';
  this.dueDateClass = '';

  this.color = null;
  this.backgroundColor = null;
  this.dragBackgroundColor = null;
  this.borderColor = null;
  this.customStyle = '';

  this.isFocused = false;
  this.isPending = false;
  this.isVisible = true;
  this.isReadOnly = false;

  this.raw = {
    memo: '',
    hasToOrCc: false,
    hasRecurrenceRule: false,
    location: null,
    class: 'public', // or 'private'
    creator: {
      name: '',
      avatar: '',
      company: '',
      email: '',
      phone: '',
    },
  };
}

function generateTime(event, renderStart, renderEnd, options) {
  let endDate = moment(renderEnd.getTime());
  const startDate = moment(renderStart.getTime());
  const diffDate = endDate.diff(startDate, 'days');
  const { taskView, scheduleView } = options;

  event.isAllday = chance.bool({ likelihood: 20 });
  if (event.isAllday) {
    event.category = 'allday';
  } else if (taskView && !scheduleView) {
    event.category = EVENT_CATEGORY[chance.integer({ min: 0, max: 1 })];
    if (event.category === EVENT_CATEGORY[1]) {
      event.dueDateClass = 'morning';
    }
  } else if (chance.bool({ likelihood: 30 })) {
    event.category = EVENT_CATEGORY[chance.integer({ min: 0, max: 1 })];
    if (event.category === EVENT_CATEGORY[1]) {
      event.dueDateClass = 'morning';
    }
  } else {
    event.category = 'time';
  }

  startDate.add(chance.integer({ min: 0, max: diffDate }), 'days');
  startDate.hours(chance.integer({ min: 0, max: 23 }));
  startDate.minutes(chance.bool() ? 0 : 30);
  event.start = startDate.toDate();

  endDate = moment(startDate);
  if (event.isAllday) {
    endDate.add(chance.integer({ min: 0, max: 2 }), 'days');
  }

  event.end = endDate.add(chance.integer({ min: 1, max: 4 }), 'hour').toDate();
}

function generateRandomSchedule(calendar, renderStart, renderEnd, options) {
  const event = new EventObject();

  event.id = chance.guid();
  event.calendarId = calendar.id;

  event.title = chance.sentence({ words: 3 });
  event.isReadOnly = chance.bool({ likelihood: 20 });
  generateTime(event, renderStart, renderEnd, options);

  event.isPrivate = chance.bool({ likelihood: 10 });
  event.location = chance.address();
  event.attendees = chance.bool({ likelihood: 70 }) ? ['anyone'] : [];
  event.recurrenceRule = chance.bool({ likelihood: 20 });

  if (event.category === 'milestone') {
    event.color = event.backgroundColor;
    event.backgroundColor = 'transparent';
    event.dragBackgroundColor = 'transparent';
    event.borderColor = 'transparent';
  }

  event.raw.memo = chance.sentence();
  event.raw.creator.name = chance.name();
  event.raw.creator.avatar = chance.avatar();
  event.raw.creator.company = chance.company();
  event.raw.creator.email = chance.email();
  event.raw.creator.phone = chance.phone();

  events.push(event);
}

export function generateEvents(calendars, viewName, renderStart, renderEnd, options) {
  events = [];
  calendars.forEach((calendar) => {
    let i = 0,
      length = 5;

    if (viewName === 'month') {
      length = 6;
    } else if (viewName === 'day') {
      length = 4;
    }
    for (; i < length; i += 1) {
      generateRandomSchedule(calendar, renderStart, renderEnd, options);
    }
  });

  return events;
}
