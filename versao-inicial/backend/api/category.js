module.exports = app => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = (request, response) => {
    const category = { ...request.body };
    if (req.params.id) category.id = req.params.id;

    try {
      existsOrError(category.name, "Nome não informado");
    } catch (msg) {
      response.status(400).send(msg);
    }

    if (category.id) {
      app
        .db("categories")
        .update(category)
        .where({ id: category.id })
        .then(_ => response.status(204).send())
        .catch(error => response.status(500).send(error));
    } else {
      app
        .db("categories")
        .insert(category)
        .then(_ => response.status(204).send())
        .catch(error => response.status(500).send(error));
    }
  };
  const remove = async (request, response) => {
    try {
      existsOrError(request.params.id, "Código da categoria não informado.");
      const subcategory = await app
        .db("categories")
        .where({ parentId: request.params.id });
      notExistsOrError(subcategory, "Categoria possui subcatogorias.");
      const articles = await app
        .db("articles")
        .where({ categoryId: req.params.id });
      notExistsOrError(articles, "Categoria possui artigos");

      const rowDeleted = await app
        .db("categories")
        .where({ id: request.params.id })
        .del();

      existsOrError(rowDeleted, "Categoria não foi encontrada");

      response.status(204).send();
    } catch {
      response.status(400).send(msg);
    }
  };
  const withPath = categories => {
    const getParent = (categories, parentId) => {
        const parent = categories.filter(parent => parent.id === parentId)
    };
  };
};
