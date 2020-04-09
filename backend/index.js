/* Consign é utilizado para gerenciar nossas dependencias */
const app = require("express")();
const consign = require("consign");
/* Peguei o que foi exportado no module config/db e armazenei em db */
const db = require("./config/db");
const mongoose = require("mongoose");

require('./config/mongodb')
/* Atribui o valor db para app para que esteja disponiível nas diversas exportações */
app.db = db;
app.mongoose = mongoose;

consign()
  .include("./config/passport.js")
  .then("./config/middlewares.js")
  .then("./api/validation.js")
  .then("./api")
  .then("./schedule")
  .then("./config/routes.js")
  .into(app);

app.listen(3000, () => {
  console.log("Backend executando...");
});
