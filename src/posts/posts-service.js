const PostsService = {
  getAllPosts(knex) {
    return knex('posts').select('*');
  },
  insertPost(knex, newPost) {
    return knex('posts')
      .insert(newPost)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex('posts').select('*').where({ id }).first();
  },
  deletePost(knex, id) {
    return knex('posts').where({ id }).delete();
  },
  updatePost(knex, id, newPostFields) {
    return knex('posts').where({ id }).update(newPostFields);
  }
};

module.exports = PostsService;
