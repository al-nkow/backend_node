const mongoose = require('mongoose');
const Content = require('../models/content');

// GET CONTENT
exports.content_get = async (req, res) => {
  try {
    const content = await Content.findOne({ key: 'main_content' }).select('main about');
    res.status(200).json(content);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

// UPDATE CONTENT
exports.content_create = async (req, res) => {
  const content = await Content.findOne({ key: 'main_content' });
  try {
    if (content) {
      // Update one
      await Content.update({key: 'main_content'}, {$set: req.body});
      res.status(201).json({ message: 'Content updated' });
    } else {
      // Create new if no content found
      const newContent = new Content({
        ...req.body,
        _id: new mongoose.Types.ObjectId(),
        key: 'main_content',
      });
      await newContent.save();
      res.status(201).json({ message: 'Content created' });
    }
  } catch(err) {
    return res.status(500).json({ error: err });
  }
};