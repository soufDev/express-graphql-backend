import Event from '../../models/event';
import User from '../../models/user';
import { dateToString } from '../../helpers/date';

async function user(userId) {
  try {
    const fetcedUser = await User.findById(userId)
    return {
      ...fetcedUser._doc,
      password: null,
      createdEvents: events.bind(this, fetcedUser._doc.createdEvents)
    };
  } catch (err) {
    throw err
  }
}

function transformEvent(event) {
  return {
    ...event._doc,
    _id: event._doc._id.toString(),
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  }
}

async function events(eventIds) {
  try {
    const fetchedEvents = await Event.find({ _id: { $in: eventIds } });
    return fetchedEvents.map(event => transformEvent(event));
  } catch (err) {
    throw err
  }
}


const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (error) {
    throw error;
  }
}

const transformBooking = booking => ({
  ...booking._doc,
  user: user.bind(this, booking._doc.user),
  event: singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt)
});

export {
  transformBooking,
  transformEvent,
  user,
  events,
  singleEvent
}
