import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../src/models/user';
import { events } from './merge';


export default {
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => ({
        ...user._doc,
        createdEvents: events.bind(this, user._doc.createdEvent)
      }))
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
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email does not Exist');
      }
      const isEqual = bcrypt.compare(password, user.password)
      if (!isEqual) {
        throw new Error('incorrect password');
      }
      const token = jwt.sign({
        userId: user.id,
        email
      }, 'supersecretkey', { expiresIn: '24h' })
      return {
        userId: user.id,
        token,
        tokenExpiration: 24
      }
    } catch (err) {
      throw err;
    }
  }
}
