const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');

describe('Groups Endpoints', function () {
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
    db.raw('TRUNCATE groups RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE groups RESTART IDENTITY CASCADE')
  );

  describe(`GET /api/groups`, () => {
    context(`Given no articles`, () => {
      it(`reponds with 200 and an empty list`, () => {
        return supertest(app).get('/api/groups').expect(200, []);
      });
    });
  });
});