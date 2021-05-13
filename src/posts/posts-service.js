const PostsService = {
  getAllPosts(knex) {
    return knex.select('*').from('posts');
  }
};

module.exports = PostsService;
