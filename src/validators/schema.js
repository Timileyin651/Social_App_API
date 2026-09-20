const Joi = require('joi');

const objectId = Joi.string().hex().length(24); // matches a Mongo ObjectId

const user = {
  create: Joi.object({
    first_name: Joi.string().trim().min(1).max(50).required(),
    last_name: Joi.string().trim().min(1).max(50).required(),
    username: Joi.string().trim().lowercase().alphanum().min(3).max(30).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().min(8).required(),
  }),
  update: Joi.object({
    first_name: Joi.string().trim().min(1).max(50),
    last_name: Joi.string().trim().min(1).max(50),
    username: Joi.string().trim().lowercase().alphanum().min(3).max(30),
    email: Joi.string().trim().lowercase().email(),
  }).min(1), // at least one field must be present on an update
};

const post = {
  create: Joi.object({
    title: Joi.string().trim().min(1).max(200).required(),
    content: Joi.string().trim().min(1).required(),
    author: objectId.required(),
    tags: Joi.array().items(Joi.string().trim().lowercase().max(30)).default([]),
    state: Joi.string().valid('draft', 'published').default('draft'),
  }),
  update: Joi.object({
    title: Joi.string().trim().min(1).max(200),
    content: Joi.string().trim().min(1),
    tags: Joi.array().items(Joi.string().trim().lowercase().max(30)),
  }).min(1),
};

const comment = {
  create: Joi.object({
    user: objectId.required(),
    content: Joi.string().trim().min(1).max(2000).required(),
    parent: objectId.allow(null).default(null),
  }),
};

const like = {
  create: Joi.object({
    user: objectId.required(),
  }),
};

const idParam = Joi.object({
  id: objectId.required(),
});

module.exports = { user, post, comment, like, idParam };
