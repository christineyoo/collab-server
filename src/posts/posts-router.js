const express = require('express');
const path = require('path');
const PostsService = require('./posts-service');
const xss = require('xss');

const postsRouter = express.Router();
const jsonParser = express.json();

const serializePost = (post) => ({
  id: post.id,
  post_name: xss(post.post_name),
  content: xss(post.content),
  group_id: post.folder_id,
  modified: post.modified,
  author: xss(post.author)
});

postsRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  PostsService.getAllPosts(knexInstance)
    .then((posts) => {
      res.json(posts.map(serializePost));
    })
    .catch(next);
});

module.exports = postsRouter;
