/* Metodo up é utilizado para evoluir seu sistema. Sempre tornando seu banco mais recente  */
exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("name").notNull();
    table
      .string("email")
      .notNull()
      .unique();
    table.string("password").notNull();
    table
      .boolean("admin")
      .notNull()
      .defaultTo(false);
  });
};
/* Metodo down sempre faz o contrario que foi feito no up  */
exports.down = function(knex) {
  return knex.schema.dropTable("users");
};
