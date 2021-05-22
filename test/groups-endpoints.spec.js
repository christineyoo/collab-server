const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeGroupsArray } = require('./collab.fixtures');

describe('Groups endpoints', function () {
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

  describe('GET /api/groups', () => {
    context('Given no groups', () => {
      it('reponds with 200 and an empty list', () => {
        return supertest(app).get('/api/groups').expect(200, []);
      });
    });

    context('Given there are groups in the database', () => {
      const testGroups = makeGroupsArray();

      beforeEach('Insert groups', () => {
        return db.into('groups').insert(testGroups);
      });

      it('GET /api/groups responds with 200 and all the groups', () => {
        return supertest(app).get('/api/groups').expect(200, testGroups);
      });
    });
  });
});
