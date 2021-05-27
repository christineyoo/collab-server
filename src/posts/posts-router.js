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
      .catch((err) => {
        // helps with logging errors rather than generic 500 status
        console.log({ err });
        next();
      });
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
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

    PostsService.insertPost(knexInstance, newPost)
      .then((post) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(serializePost(post));
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  });

postsRouter
  .route('/:post_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    PostsService.getById(knexInstance, req.params.post_id)
      .then((post) => {
        if (!post) {
          return res
            .status(404)
            .json({ error: { message: `Post doesn't exist` } });
        }
        res.post = post;
        next();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .get((req, res, next) => {
    res.json(serializePost(res.post));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    PostsService.deletePost(knexInstance, req.params.post_id)
      .then((numRowsAffected) => {
        res.json({ message: `Succesfully deleted` });
        res.status(204).end();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const { post_name, content, author, group_id, modified } = req.body;
    const postToUpdate = { post_name, content, author, group_id, modified };

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'post_name', 'content', 'author', 'group_id', or 'modified'`
        }
      });

    PostsService.updatePost(knexInstance, req.params.post_id, postToUpdate)
      .then((numRowsAffected) => {
        res.json({ message: `Succesfully updated ` });
        res.status(204).end();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  });

module.exports = postsRouter;
