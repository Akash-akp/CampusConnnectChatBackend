const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  nameOfUniversity: {
    type: String,
    required: true,
    trim: true,
  },
  universityId: {
    type: String,
    required: true,
    unique: true,
  },
  universityReg: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  branch: {
    type: String,
    required: true,
    trim: true,
  },
  currentCompany: {
    type: String,
    trim: true,
  },
  placementStatement: {
    type: String,
    required: true,
    enum: ['on-campus', 'off-campus'], // Assuming placement type is limited to these options
  },
  posts: {
    type: Array,
    default: [],
  },
  allChats: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Message',
    default: [],
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Users',
    default: [],
  },
  friendRequest: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Users',
    default: [],
  },
},{
    collection: 'Users',
});

module.exports = mongoose.model('Users', userSchema);