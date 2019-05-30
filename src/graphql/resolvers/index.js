import authResolvers from './Auth';
import bookingResolvers from './booking';
import eventsResolvers from './events';

export default {
  ...authResolvers,
  ...bookingResolvers,
  ...eventsResolvers
}
