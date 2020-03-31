/* Consign é utilizado para gerenciar nossas dependencias */
const app = require("express")();
const consign = require("consign");
/* Peguei o qu foi exportadod no module config/db e armazenei em db */
const db = require("./config/db")
/* Atribui o valor db para app para que esteja disponiível nas diversas exportações */
app.db = db

consign()
  .then("./config/middlewares.js")
  .then('./api/validation.js')
  .then("./api")
  .then("./config/routes.js") 
  .into(app);

app.listen(3000, () => {
  console.log("Backend executando...");
});
