import mongoose, { Schema } from 'mongoose';

const userSchema = Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }]
});

export default mongoose.model('User', userSchema);
