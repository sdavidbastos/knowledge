const config = require("../knexfile");
const knex = require("knex")(config);
/* A migração sera executada assim que o backend carregar */
/* Por as chamadas migrates dentro do codigo da aplicação pode não ser algo positivo */
knex.migrate.latest([config]);

module.exports = knex;
