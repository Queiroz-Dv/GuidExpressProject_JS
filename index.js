const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");

//Connection to database
const connection = require("./database/database");

// Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController")
//Modals
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User")

//View Engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
secret: "DeveloperQueiroz", cookie:{maxAge: 30000000}
}));

//Static Files
app.use(express.static('public'));

//Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database Connection
connection.authenticate()
  .then(() => {
    console.log("Database connection success");
  }).catch((error) => {
    console.log(error);
  })

//Routes' Controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//Routes's Views
app.get("/", (request, response) => {
  Article.findAll({
    order: [
      ['id', 'DESC']
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      response.render("index", { articles: articles, categories: categories });
    });
  });
})

app.get("/:slug", (request, response) => {
  var slug = request.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if (article != undefined) {
      Category.findAll().then(categories => {
        response.render("article", { article: article, categories: categories });
      });
    } else {
      response.redirect("/");
    }
  }).catch(error => {
    response.redirect("/");
  });
});

app.get("/category/:slug", (request, response) => {
  var slug = request.params.slug;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if (category != undefined) {
      Category.findAll().then(categories => {
        response.render("index", { articles: category.articles, categories: categories });
      });
    } else {
      response.redirect("/");
    }
  }).catch(error => {
    response.redirect("/");
  })
})
//Listener Port
app.listen(2003, () => {
  console.log("Running Server")
})