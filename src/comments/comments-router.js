const express = require('express');
const path = require('path');
const CommentsService = require('./comments-service');
const xss = require('xss');
const PostsService = require('../posts/posts-service');

const commentsRouter = express.Router();
const jsonParser = express.json();

const serializeComment = (comment) => ({
  id: comment.id,
  content: xss(comment.content),
  author: xss(comment.author),
  modified: comment.modified,
  post_id: comment.post_id
});

commentsRouter
  .route('/:post_id')
  .get((req, res, next) => {
    PostsService.getAllComments(req.app.get('db'))
      .then((comments) => {
        res.json(comments.map(serializePost));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { content, author, modified, post_id } = req.body;
    const newComment = { content, author, post_id };

    for (const [key, value] of Object.entries(newComment)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    newComment.modified = modified;

    CommentsService.insertComment(req.app.get('db'), newComment)
      .then((comment) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(serializeComment(comment));
      })
      .catch(next);
  });

commentsRouter
  .route('/:comment_id')
  .all((req, res, next) => {
    CommentsService.getById(req.app.get('db'), req.params.comment_id)
      .then((comment) => {
        if (!comment) {
          return res
            .status(404)
            .json({ error: { message: `Comment doesn't exist` } });
        }
        res.comment = comment;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeComment(res.comment));
  })
  .delete((req, res, next) => {
    CommentsService.deleteComment(req.app.get('db'), req.params.comment_id)
      .then((numRowsAffected) => {
        res.json({ message: `Succesfully deleted` });
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = commentsRouter;
