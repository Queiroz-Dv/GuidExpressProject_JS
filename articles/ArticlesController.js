const express = require("express");
const router = express.Router(); //Create Route Page
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");


//Routes

//Article Index 
router.get("/admin/articles", (request, response) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(articles => {
    response.render("admin/articles/index", { articles: articles })
  });
});

//Create a new article
router.get("/admin/articles/new", (request, response) => {
  Category.findAll().then(categories => {
    response.render("admin/articles/new", { categories: categories })
  });
});

//Create a new article
router.post("/articles/save", (request, response) => {
  var title = request.body.title;
  var body = request.body.body;
  var category = request.body.category;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category
  }).then(() => {
    response.redirect("/admin/articles");
  });
});

//Delete an article
router.post("/articles/delete", (request, response) => {
  var id = request.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => {
        response.redirect("/admin/articles");
      });
    } else {// It's not a number 
      response.redirect("/admin/articles");
    }
  } else { //Nulls
    response.redirect("/admin/articles");
  }
});
module.exports = router;