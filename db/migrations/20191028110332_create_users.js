
 exports.up = function(knex) {
  console.log('created user tables')
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.string('username').primary();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  })
};

exports.down = function(knex) {
  console.log('dropped user tables');
  return knex.schema.dropTable('users');
};
