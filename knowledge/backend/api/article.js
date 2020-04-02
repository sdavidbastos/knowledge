module.exports = app => {
  const { existsOrError } = app.api.validation;
  const save = (request, response) => {
    const article = { ...request.body };
    if (request.params.id) article.id = request.params.id;
    try {
      existsOrError(article.name, "Nome não informado");
      existsOrError(article.description, "Descrição não informada");
      existsOrError(article.content, "Conteúdo não informado");
      existsOrError(article.userId, "Autor não informado");
      existsOrError(article.categoryId, "Categoria não informada");
    } catch (msg) {
      response.status(400).send(msg);
    }
    if (article.id) {
      app
        .db("articles")
        .update(article)
        .where({ id: article.id })
        .then(_ => response.status(204).send())
        .catch(error => response.status(500).send(error));
    } else {
      app
        .db("articles")
        .insert(article)
        .then(_ => response.status(204).send())
        .catch(error => response.status(500).send(error));
    }
  };
  const remove = async (request, response) => {
    try {
      const rowDeleted = await app
        .db("articles")
        .where({ id: request.params.id })
        .del();
      try {
        existsOrError(rowDeleted, "Artigo não encontrado.");
      } catch (msg) {
        return response.status(400).send(msg);
      }
      response.status(204).send();
    } catch (msg) {
      response.status(500).send(msg);
    }
  };
  const limit = 10; //usada para paginação
  const get = async (request, response) => {
    const page = request.query.page || 1;
    /* count('id') serve para quantificar o artigos */
    const result = await app
      .db("articles")
      .count("id")
      .first();
    const count = parseInt(result.count);

    app
      .db("articles")
      .select("id", "name", "description")
      /* Offset é o deslocamento. Na pag 1 = 0, pag 2 = 10, pag 3 = 20  */
      .limit(limit)
      .offset(page * limit - limit)
      .then(articles => response.json({ data: articles, limit, count }))
      .catch(error => response.status(500).send(error));
  };
  const getById = (request, response) => {
    app
      .db("articles")
      .where({ id: request.params.id })
      .first()
      .then(articles => {
        /* Article.content chega em formato binario. */
        articles.content = articles.content.toString();
        return response.json(articles);
      })
      .catch(error => response.status(500).send(error));
  };
  return { save, remove, get, getById };
};
