const { authSecret } = require("../.env");
const jwt = require("jwt-simple");
/* bcrypt para compara as senha criptografada com a senha para fazer o login */
const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const signin = async (request, response) => {
    if (!request.body.email || !request.body.password) {
      return response.status(400).send("Informe o usuario e senha!");
    }
    const user = await app
      .db("users")
      .where({ email: request.body.email })
      .first();
    if (!user) return response.status(400).send("Usuario não encontrado!");
    /* Não podemos utilizar password = request.body.password, pois a senha é criptografada. Precisamos utilzar o bcrypt.compareSync()*/
    const isMatch = bcrypt.compareSync(request.body.password, user.password);
    if (!isMatch) return response.status(401).send("Email/Senha inválidos!");
    /* Date.now() retorna o numero em milissegundos desde 1970. Dividimos por 1000 para termos em segundos */
    const now = Math.floor(Date.now() / 1000);
    /* iat data de geração e exp data de expiração*/
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
      iat: now,
      exp: now + 60 * 60 * 24 * 3,
    };
    response.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  };
  const validateToken = async (request, response) => {
    const userData = request.body || null;
    try{
      if(userData) {
        const token = jwt.decode(userData.token, authSecret)
        if(new Date(token.exp*1000) > new Date()){
          return response.send(true)
        }
      }
    }catch(e){
      /* Problema de token */
    }
  response.send(false)
  };
  return { signin, validateToken}
};
