module.exports = (app) => {
  /* Se existir*/
  function existsOrError(value, msg) {
    /* Exceção: caso value seja igual a false */
    if (!value) throw msg;
    /* Exceção: se for um array e esse array estiver vazio */
    if (Array.isArray(value) && value.length === 0) throw msg;
    /* Se for string e for vazio*/
    if (typeof value === "string" && !value.trim()) throw msg;
  }
  /* Se não existir */
  function notExistsOrError(value, msg) {
    try {
      existsOrError(value, msg);
    } catch (msg) {
      return;
    }
    throw msg;
  }

  function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) throw msg;
  }
  function passwordValidation(value, msg) {
    if (value.length <= 6) throw msg;
  }
  return { existsOrError, notExistsOrError, equalsOrError, passwordValidation};
};
