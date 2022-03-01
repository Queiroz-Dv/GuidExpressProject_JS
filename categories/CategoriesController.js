const { request } = require("express");
const express = require("express");
const router = express.Router(); //Create Route Page
const Category = require("./Category");
const slugify = require("slugify");
const res = require("express/lib/response");

//Create New Category
router.get("/admin/categories/new", (request, response) => {
  response.render("admin/categories/new");;
});

//Add new category in the database
router.post("/categories/save", (request, response) => {
  var title = request.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title)
    }).then(() => {
      response.redirect("/");
    })
  } else {
    response.redirect("/admin/categories/new");
  }
});

//Show all categories
router.get("/admin/categories", (request, response) => {
  Category.findAll().then(categories => {
    response.render("admin/categories/index", { categories: categories });;
  });
});

//Delete category
router.post("/categories/delete", (request, response) => {
  var id = request.body.id;
  if (id != undefined) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id: id
        }
      }).then(() => {
        response.redirect("/admin/categories");
      });
    } else {// It's not a number 
      response.redirect("/admin/categories");
    }
  } else { //Nulls
    response.redirect("/admin/categories");
  }
});
module.exports = router;