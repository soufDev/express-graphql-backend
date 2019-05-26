const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const user = async (userId) => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            password: null,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err
    }
}

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds }});
        return events.map(event => ({
            ...event._doc,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event.creator)
        }));
    } catch (err) {
        throw err
    }
}

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            creator: user.bind(this, event.creator),
        }
    } catch (error) {
        throw error;
    }
}
module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map((event => ({
                ...event._doc,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event._doc.creator)
            })))
        } catch (error) {
            throw error;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find({});
            return bookings.map(booking => ({
                ...booking._doc,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                createdAt: new Date(booking._doc.createdAt).toISOString(),
                updatedAt: new Date(booking._doc.updatedAt).toISOString(),
            }));
        } catch (error) {
            throw error
        }
    },
    users: async () => {
        try {
            const users = await User.find();
            return users.map(user => ({
                ...user._doc,
                createdEvents: events.bind(this, user._doc.createdEvent),
            }))
        } catch (error) {
            throw error;
        }
    },
    createEvent: async ({inputEvent}) => {
        try {
            const event = new Event({
                title: inputEvent.title,
                description: inputEvent.description,
                price: +inputEvent.price,
                date: new Date(),
                creator: '5ce9631aa2d47b4fed6d2f63'
            });
            const result = await event.save();
            const createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            };
            const savedUser = await User.findById('5ce9631aa2d47b4fed6d2f63')
            if (!savedUser) {
                throw new Error('User not Found.');
            }
            savedUser.createdEvents.push(event);
            await savedUser.save();
            return createdEvent;
        } catch (error) {
            throw error;
        }
    },
    createUser: async ({ inputUser }) => {
        try {
            const user = await User.findOne({ email: inputUser.email })
            if (user) {
                throw new Error('Email Already Exist')
            }
            const hashedPassword = await bcrypt.hash(inputUser.password, 12);
            const userObj = new User({
                email: inputUser.email,
                password: hashedPassword
            })
            const result = await userObj.save();
            return ({
                ...result._doc, password: null
            });
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async ({ eventId }) => {
        try {
            const fetchedEvent = await Event.findOne({ _id: eventId });
            const booking = new Booking({
                event: fetchedEvent,
                user: '5ce9631aa2d47b4fed6d2f63',
            });
            const storedBooking = await booking.save();
            return {
                ...storedBooking._doc,
                user: user.bind(this, booking._doc.user),
                event: singleEvent.bind(this, booking._doc.event),
                updatedAt: new Date(storedBooking._doc.updatedAt).toISOString(),
                createdAt: new Date(storedBooking._doc.createdAt).toISOString(),
            }
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async ({ bookingId }) => {
        console.log({ bookingId });
        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = {
              ...booking.event._doc,
              _id: booking.event.id,
              creator: user.bind(this, booking.event._doc.creator)
            };
            console.log({ booking });
            await Booking.deleteOne({ _id: bookingId });
            return event;
          } catch (err) {
            throw err;
          }
    }
}