/* preciso do authSecret para ler o token e ver se ele foi validado de forma correta */
const { authSecret } = require("../.env");
const passaport = require("passport");
const passaportJwt = require("passport-jwt");
/* A partir do Strategy e ExtractJwt faz a busca da validação no cabeçalho da requisição */
const { Strategy, ExtractJwt } = passaportJwt;

module.exports = (app) => {
  const params = {
    secretOrKey: authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  /* done é uma função que recebe como primeiro parametro como erro e por isso utilizamos null */
  const strategy = new Strategy(params, (payload, done) => {
    app
      .db("users")
      .where({ id: payload.id })
      .first()
      .then((user) => done(null, user ? { ...payload } : false))
      .catch((error) => done(error, false));
  });

  passaport.use(strategy);

  return {
    authenticate: () => passaport.authenticate("jwt", { session: false }),
  };
};
