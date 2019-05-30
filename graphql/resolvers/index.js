const authResolvers = require('./Auth');
const bookingResolvers = require('./booking');
const eventsResolvers = require('./events');

module.exports = {
    ...authResolvers,
    ...bookingResolvers,
    ...eventsResolvers
}