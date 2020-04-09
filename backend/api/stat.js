module.exports = (app) => {
  const Stat = app.mongoose.model("Stat", {
    users: Number,
    categories: Number,
    articles: Number,
    createdAt: Date,
  });
  const get = (request, response) => {
    Stat.findOne({}, {}, { sort: { createdAt: -1 } }).then((stat) => {
      const defaultState = {
        users: 0,
        categories: 0,
        articles: 0,
      };
      response.json(stat);
    });
  };
  return { Stat, get };
};
