const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Connection to database
const connection = require("./database/database");

// Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

//Modals
const Article = require("./articles/Article");
const Category = require("./categories/Category");

//View Engine
app.set('view engine', 'ejs');

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

//Routes
app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (request, response) => {
  response.render("index"); //Show rendered view 
})

//Listener Port
app.listen(2003, () => {
  console.log("Running Server")
})