module.exports = app => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  const save = (request, response) => {
    const category = { ...request.body };
    if (request.params.id) category.id = request.params.id;

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
        .where({ categoryId: request.params.id });
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
    /* getParent vai pegar exatamente o parent que estamos buscando */
    const getParent = (categories, parentId) => {
      const parent = categories.filter(parent => parent.id === parentId);
      return parent.length ? parent[0] : null;
    };
    /* Transformar um array de categorias em um outro array de categorias com o atributo a mais (ATRIBUTO PATH)*/
    const categoriesWithPath = categories.map(category => {
      let path = category.name;
      let parent = getParent(categories, category.parentId);

      while (parent) {
        path = `${parent.name} > ${path}`;
        parent = getParent(categories, parent.parentId);
      }
      return { ...category, path };
    });
    categoriesWithPath.sort((a, b) => {
      if (a.path < b.path) return -1;
      if (a.path > b.path) return 1;
      return 0;
    });
    return categoriesWithPath;
  };
  const get = (request, response) => {
    app
      .db("categories")
      .then(categories => response.json(withPath(categories)))
      .catch(error => response.status(500).send(error));
  };
  const getById = (request, response) => {
    app
      .db("categories")
      .where({ id: request.params.id })
      .first()
      .then(category => response.json(category))
      .catch(error => response.status(500).send(error));
  };
  const toTree = (categories, tree) => {
    if (!tree) tree = categories.filter(c => !c.parentId);
    tree = tree.map(parentNode => {
      const isChild = node => parentNode.id == node.parentId;
      parentNode.children = toTree(categories, categories.filter(isChild));
      return parentNode;
    });
    return tree;
  };

  const getTree = (request, response) => {
    app
      .db("categories")
      .then(categories => response.json(toTree((categories))))
      .catch(error => response.status(500).send(error));
  };

  return { save, remove, get, getById, getTree };
};
