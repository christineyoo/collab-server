const GroupsService = {
  getAllGroups(knex) {
    return knex.select('*').from('groups');
  }
};

module.exports = GroupsService;
