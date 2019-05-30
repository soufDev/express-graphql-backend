const Booking = require('../../models/booking');
const Event = require('../../models/event');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
    bookings: async (args, { isAuth }) => {
        if (!isAuth) {
            throw new Error('Unauthenticated')
        }
        try {
            const bookings = await Booking.find({});
            return bookings.map(booking => transformBooking(booking));
        } catch (error) {
            throw error
        }
    },
    bookEvent: async ({ eventId }, { isAuth, userId }) => {
        if (!isAuth) {
            throw new Error('Unauthenticated')
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: eventId });
            const booking = new Booking({
                event: fetchedEvent,
                user: userId,
            });
            const storedBooking = await booking.save();
            return transformBooking(storedBooking);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async ({ bookingId }, { isAuth }) => {
        if (!isAuth) {
            throw new Error('Unauthenticated')
        }
        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: bookingId });
            return event;
          } catch (err) {
            throw err;
          }
    }
}