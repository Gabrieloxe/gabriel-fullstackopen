import mongoose from 'mongoose';
import { mongoUrl } from './config.js';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

const phoneValidator = number => {
  const regex = /^\d{2,3}-\d+$/;
  return regex.test(number);
};

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: phoneValidator,
      message: props =>
        `${props.value} is not a valid phone number! Numbers must have a length of 8 or more and be formed of two parts separated by a hyphen (-), with the first part having two or three digits and the second part consisting of digits`,
    },
  },
});

const Contact = mongoose.model('Contact', contactSchema);

export const createContact = async (name, number) => {
  await connectToDatabase();
  try {
    const contact = new Contact({ name, number });
    return await contact.save();
  } finally {
    await mongoose.connection.close();
  }
};

export const getContacts = async () => {
  await connectToDatabase();
  try {
    return await Contact.find({});
  } finally {
    await mongoose.connection.close();
  }
};

export const getContact = async id => {
  await connectToDatabase();
  try {
    return await Contact.findById(id);
  } finally {
    await mongoose.connection.close();
  }
};

export const updateContact = async (id, updatedData) => {
  await connectToDatabase();
  try {
    return await Contact.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
      context: 'query',
    });
  } finally {
    await mongoose.connection.close();
  }
};

export const deleteContact = async id => {
  await connectToDatabase();
  try {
    return await Contact.findByIdAndDelete(id);
  } finally {
    await mongoose.connection.close();
  }
};
