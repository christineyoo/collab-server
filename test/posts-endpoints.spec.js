const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makePostsArray, makeGroupsArray } = require('./collab.fixtures');

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
    db.raw('TRUNCATE groups, posts RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE groups, posts RESTART IDENTITY CASCADE')
  );

  //   get all
  describe('GET /api/posts', () => {
    context('Given no posts', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/posts').expect(200, []);
      });
    });

    context('Given there are posts in the database', () => {
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
      it('GET /api/posts responds with 200 and all the posts', () => {
        return supertest(app).get('/api/posts').expect(200, testPosts);
      });
    });
  });

  //   get by id
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
      beforeEach('Insert posts', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('posts').insert(testPosts);
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

  //   post
  describe('POST /api/posts', () => {
    const testGroups = makeGroupsArray();
    beforeEach('Insert groups', () => {
      return db.into('groups').insert(testGroups);
    });
    it('creates a post responding with 201 and the new post', () => {
      const newPost = {
        author: 'Author four',
        content: 'Content for post four',
        group_id: 3,
        modified: '2021-05-25T00:00:00.000Z',
        post_name: 'Post four'
      };
      return supertest(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201)
        .expect((res) => {
          expect(res.body.author).to.eql(newPost.author);
          expect(res.body.content).to.eql(newPost.content);
          expect(res.body.group_id).to.eql(newPost.group_id);
          expect(res.body.modified).to.eql(newPost.modified);
          expect(res.body.post_name).to.eql(newPost.post_name);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/posts/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/posts/${res.body.id}`).expect(res.body)
        );
    });
  });

  // delete
  describe('DELETE /api/posts/:post_id', () => {
    context('Given there are posts in the database', () => {
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
      it('responds with 200 and removes the post', () => {
        const idToRemove = 2;
        const expectedPosts = testPosts.filter(
          (post) => post.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/posts/${idToRemove}`)
          .expect(200)
          .then((res) =>
            supertest(app).get('/api/posts').expect(expectedPosts)
          );
      });
    });
  });

  //   update
  describe('PATCH /api/posts/:post_id', () => {
    context('Given there are posts in the database', () => {
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
      it('responds with 200 and updates the post', () => {
        const idToUpdate = 2;
        const updatePost = {
          post_name: 'Updated name',
          content: 'Updated content',
          author: 'Updated author',
          group_id: 1,
          modified: '2021-05-21T00:00:00.000Z'
        };
        const expectedPost = {
          ...testPosts[idToUpdate - 1],
          ...updatePost
        };
        return supertest(app)
          .patch(`/api/posts/${idToUpdate}`)
          .send(updatePost)
          .expect(200)
          .then((res) =>
            supertest(app).get(`/api/posts/${idToUpdate}`).expect(expectedPost)
          );
      });
    });
  });
});
