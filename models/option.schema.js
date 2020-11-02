const mongoose = require('mongoose');
const { getConnection } = require('./connection');

const { Schema } = mongoose;

const schema = new Schema({
  name: { type: String },
  count : { type: Number, default: 0 },
}, { timestamps: true });

schema.set('toObject', { getters: true, virtuals: true });
schema.set('toJSON', { getters: true, virtuals: true });

const model = getConnection().model('options', schema);

module.exports = model;
