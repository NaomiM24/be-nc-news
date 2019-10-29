
exports.up = function(knex) {
  // console.log('created topics table')
  return knex.schema.createTable('topics', (topicsTable) => {
    topicsTable.string("slug").primary();
    topicsTable.string('description').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('topics');
};
