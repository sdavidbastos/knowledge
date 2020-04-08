/* O parametro representa a instância do express do index.js */
const bcrypt = require("bcrypt-nodejs");
module.exports = app => {
  const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

  const encryptPassword = password => {
    /* Salt = tempero. Gera um hash diferente para para cada senha ou até para mesma senha */
   const salt = bcrypt.genSaltSync(10);
    /* Agora eu tenho a senha e sua cryptografia persistida no banco de dados */
   return bcrypt.hashSync(password, salt);
  };
  /* Metdo save serve para inserir um usuario ou altera-lo */
  const save = async (request, response) => {
    /* {...resquest.body} = usando um operado spred para desfragmentar o request body dentro da constante e objeto user */
    const user = { ...request.body };
    /* 1º Caso: Se o usuario estiver logado e quiser fazer alteração
    2º Caso: Se o usuario quiser se cadastrar e já existir esse cadastro */
    if (request.params.id) user.id = request.params.id;

    try {
      existsOrError(user.name, "Nome não informado");
      existsOrError(user.email, "E-mail não informado");
      equalsOrError(user.password, user.confirmPassword, "Senhas não conferem");

      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();
      /* 2º caso: Usuario tentou se cadastrar mas já está cadastrado */
      if (!user.id) {
        notExistsOrError(userFromDB, "Usuario ja cadastrado");
      }
    } catch (msg) {
      /* erro 400. Erro do cliente que não informou corretamente */
      return response.status(400).send(msg);
    }
    /* Criptografa a senha */
    user.password = encryptPassword(user.password);

    delete user.confirmPassword;

    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
        /* Status 204: deu tudo certo e não há retorno de dados */
        .then(_ => response.status(204).send())
        /* Status 500: os dados foram validados, logo o erro foi no backend. */
        .catch(error => response.status(500).send(error));
    } else {
      app
        .db("users")
        .insert(user)
        .then(_ => response.status(204).send())
        .catch(error => response.status(500).send(error));
    }
  };

  const get = (request, response) => {
    app
      .db("users")
      /* Os parametros do select são equivalentes as colunas da tabela */
      .select("id", "name", "email", "admin")
      .then(users => response.json(users))
      .catch(error => response.status(500).send(error));
  };
  const getById = (request, response) => {
    app
      .db("users")
      /* Os parametros do select são equivalentes as colunas da tabela */
      .select("id", "name", "email", "admin")
      .where({ id: request.params.id })
      /* first(): significa que é para busar somente um resultado e não uma lista de usuarios */
      .first()
      .then(user => response.json(user))
      .catch(error => response.status(500).send(error));
  };
  return { save, get, getById };
};
