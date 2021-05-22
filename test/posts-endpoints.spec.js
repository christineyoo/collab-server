const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const {
  makePostsArray,
  makeGroupsArray,
  makeCommentsArray
} = require('./collab.fixtures');

describe('Posts endpoints', function () {
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

  describe('GET /api/posts', () => {
    context('Given no posts', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/posts').expect(200, []);
      });
    });

    context('Given there are posts in the database', () => {
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
      it('GET /api/posts responds with 200 and all the posts', () => {
        return supertest(app).get('/api/posts').expect(200, testPosts);
      });
    });
  });

  describe('GET /api/posts/:post_id', () => {
    context('Given no posts', () => {
      it('responds with 404', () => {
        const postId = 123456;
        return supertest(app)
          .get(`/api/posts/${postId}`)
          .expect(404, { error: { message: `Post doesn't exist` } });
      });
    });

    context('Given there are posts in the database', () => {
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
      it('responds with 200 and the specified post', () => {
        const postId = 2;
        const expectedPost = testPosts[postId - 1];
        return supertest(app)
          .get(`/api/posts/${postId}`)
          .expect(200, expectedPost);
      });
    });
  });
});
