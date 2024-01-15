const Translation = require('../models/Translation');

exports.getTranslationByKey = async (req, res, next) => {
  const { key } = req.params;

  try {
    const translation = await Translation.findOne({ key });

    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    const userLanguage = req.user.language; // Assuming you store user language in req.user

    let translatedText = translation.en; // Default to English
    if (userLanguage === 'am') {
      translatedText = translation.am;
    }

    res.json({ key, translation: translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
