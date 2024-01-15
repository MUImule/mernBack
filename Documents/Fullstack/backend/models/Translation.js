const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  en: { type: String, required: true },
  am: { type: String, required: true },
});

const Translation = mongoose.model('Translation', translationSchema);

module.exports = Translation;
