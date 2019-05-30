import Event from '../../models/event';
import User from '../../models/user';
import { transformEvent } from './merge';

export default {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => transformEvent(event));
    } catch (error) {
      throw error;
    }
  },
  createEvent: async ({ inputEvent }, { isAuth, userId }) => {
    if (!isAuth) {
      throw new Error('Unauthenticated')
    }
    try {
      const event = new Event({
        title: inputEvent.title,
        description: inputEvent.description,
        price: +inputEvent.price,
        date: new Date(),
        creator: userId
      });
      const result = await event.save();
      const createdEvent = transformEvent(result);
      const savedUser = await User.findById(userId)
      if (!savedUser) {
        throw new Error('User not Found.');
      }
      savedUser.createdEvents.push(event);
      await savedUser.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
  }
}
