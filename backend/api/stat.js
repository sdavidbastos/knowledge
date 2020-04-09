module.exports = (app) => {
  const Stat = app.mongoose.model("Stat", {
    users: Number,
    categories: Number,
    articles: Number,
    createAt: Date,
  });
  const get = (request, response) => {
    Stat.findOne({}, {}, { sort: { createdAt: -1 } }).then((stat) => {
      const defaultState = {
        users: 0,
        categories: 0,
        articles: 0,
      };
      return response.json(stat || defaultState);
    });
  };
  return { Stat, get };
};
