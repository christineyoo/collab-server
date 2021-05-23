const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const {
  makePostsArray,
  makeGroupsArray,
  makeCommentsArray
} = require('./collab.fixtures');

describe('Comments endpoints', function () {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE groups, posts, comments RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE groups, posts, comments RESTART IDENTITY CASCADE')
  );

  //   get all
  describe('GET /api/comments', () => {
    context('Given there are comments in the database', () => {
      const testGroups = makeGroupsArray();
      const testPosts = makePostsArray();
      const testComments = makeCommentsArray();
      beforeEach('Insert posts', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('posts').insert(testPosts);
          })
          .then(() => {
            return db.into('comments').insert(testComments);
          });
      });
      it('GET /api/comments responds with 200 and all the comments', () => {
        return supertest(app).get('/api/comments').expect(200, testComments);
      });
    });
  });

  // get by id
  describe('GET /api/comments/:comment_id', () => {
    context('Given there are comments in the database', () => {
      const testGroups = makeGroupsArray();
      const testPosts = makePostsArray();
      const testComments = makeCommentsArray();
      beforeEach('Insert posts', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('posts').insert(testPosts);
          })
          .then(() => {
            return db.into('comments').insert(testComments);
          });
      });
      it('responds with 200 and the specified comment', () => {
        const commentId = 2;
        const expectedComment = testComments[commentId - 1];
        return supertest(app)
          .get(`/api/comments/${commentId}`)
          .expect(200, expectedComment);
      });
    });
  });

  // post
  describe('POST /api/comments', () => {
    const testGroups = makeGroupsArray();
    const testPosts = makePostsArray();
    beforeEach('Insert posts', () => {
      return db
        .into('groups')
        .insert(testGroups)
        .then(() => {
          return db.into('posts').insert(testPosts);
        });
    });
    it('creates a new comment responding with 201 and the new comment', () => {
      const newComment = {
        author: 'Author 4',
        content: 'Content for comment 4',
        modified: '2024-05-20T00:00:00.000Z',
        post_id: 3
      };
      return supertest(app)
        .post('/api/comments')
        .send(newComment)
        .expect(201)
        .expect((res) => {
          expect(res.body.author).to.eql(newComment.author);
          expect(res.body.content).to.eql(newComment.content);
          expect(res.body.modified).to.eql(newComment.modified);
          expect(res.body.post_id).to.eql(newComment.post_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/comments/${res.body.id}`).expect(res.body)
        );
    });
  });

  // delete
  describe('DELETE /api/comments/:comment_id', () => {
    context('Given there are comments in the database', () => {
      const testGroups = makeGroupsArray();
      const testPosts = makePostsArray();
      const testComments = makeCommentsArray();
      beforeEach('Insert comments', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('posts').insert(testPosts);
          })
          .then(() => {
            return db.into('comments').insert(testComments);
          });
      });
      it('responds with 200 and removes the comment', () => {
        const idToRemove = 2;
        const expectedComments = testComments.filter(
          (comment) => comment.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/comments/${idToRemove}`)
          .expect(200)
          .then((res) =>
            supertest(app).get('/api/comments').expect(expectedComments)
          );
      });
    });
  });
});
