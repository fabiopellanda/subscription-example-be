const mongoose = require('mongoose');
const { getConnection } = require('./connection');

const { Schema } = mongoose;
const { Types } = Schema;

const schema = new Schema({
  ip: { type: String, required: false },
  online: { type: Boolean, default: true },
  votes: [
    {
      optionId: String,
      createdAt: Date,
    },
  ],
}, { timestamps: true });

schema.set('toObject', { getters: true, virtuals: false });
schema.set('toJSON', { getters: true, virtuals: false });

const model = getConnection().model('users', schema);

module.exports = model;
