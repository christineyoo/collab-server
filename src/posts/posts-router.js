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
  group_id: post.group_id,
  modified: post.modified,
  author: xss(post.author)
});

postsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    PostsService.getAllPosts(knexInstance)
      .then((posts) => {
        res.json(posts.map(serializePost));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { post_name, content, group_id, author, modified } = req.body;
    const newPost = { post_name, content, group_id, author };

    for (const [key, value] of Object.entries(newPost)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    newPost.modified = modified;

    PostsService.insertPost(req.app.get('db'), newPost)
      .then((post) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(serializePost(post));
      })
      .catch(next);
  });

postsRouter.route('/:post_id').all((req, res, next) => {
  PostsService.getById(req.app.get('db'), req.params.post_id)
    .then((post) => {
      if (!post) {
        return res
          .status(404)
          .json({ error: { message: `Post doesn't exist` } });
      }
      res.post = post;
      next();
    })
    .catch(next);
});

module.exports = postsRouter;
