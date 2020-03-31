exports.up = function(knex) {
  return knex.schema.createTable("categories", table => {
    table.increments("id").primary();
    table.string("name").notNull();
    /* Auto relacionamento. Referencia o campo id da tablea categories */
    table
      .integer("parentId")
      .references("id")
      .inTable("categories");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("categories");
};
