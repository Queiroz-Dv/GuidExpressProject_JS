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

//Edit an article
router.get("/admin/articles/edit/:id", (request, response) => {
  var id = request.params.id;
  Article.findByPk(id).then(article => {
    if (article != undefined) {
      Category.findAll().then(categories => {
        response.render("admin/articles/edit", { categories: categories, article: article })
      });
    } else {
      response.redirect("/");
    }
  }).catch(erro => {
    response.redirect("/");
  });
});

router.post("/articles/update", (request, response) => {
  var id = request.body.id;
  var title = request.body.title;
  var body = request.body.body;
  var category = request.body.category;

  Article.update({
    title: title,
    body: body,
    categoryId: category,
    slug: slugify(title)
  },
    {
      where: {
        id: id
      }
    }).then(() => {
      response.redirect("/admin/articles");
    }).catch(error => {
      response.redirect("/");
    });
});

router.get("/articles/page/:num", (request, response) => {
  var page = request.params.num;
  var offset = 0;
  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 4;
  }
  Article.findAndCountAll({
    limit: 4,
    offset: offset,
    order: [
      ['id', 'DESC']
    ]
  }).then(articles => {
    var next;
    if (offset + 4 >= articles.count) {
      next = false;
    } else {
      next = true;
    }
    var result = {
      page: parseInt(page),
      next: next,
      articles: articles
    }
    Category.findAll().then(categories => {
      response.render("admin/articles/page", { result: result, categories: categories })
    });
  })
});
module.exports = router;