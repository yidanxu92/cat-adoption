import mongoose from 'mongoose';

const Cat = mongoose.models.Cat || mongoose.model('Cat', new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  details: {
    gender: {
      type: String,
      required: true
    },
    breed: {
      type: String,
      required: true
    },
    declawed: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    markings: {
      type: mongoose.Schema.Types.Mixed, // 允许 String 或 [String]
      required: true
    },
    personality: {
      type: [String],
      required: true
    },
    how_i_feel_about_children: {
      type: String,
      required: true
    },
    how_i_feel_about_dogs: {
      type: String,
      required: true
    },
    how_i_feel_about_cats: {
      type: String,
      required: true
    },
  },

  age: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  }
}, { timestamps: true }), 'catsCollection');

export default Cat;
