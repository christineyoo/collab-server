const CommentsService = {
  getAllComments(knex) {
    return knex.select('*').from('comments');
  },
  getById(knex, id) {
    return knex.from('comments').select('*').where('id', id).first();
  },
  insertComment(knex, newComment) {
    return knex
      .insert(newComment)
      .into('comments')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  deleteComment(knex, id) {
    return knex('comments').where({ id }).delete();
  }
};

module.exports = CommentsService;
