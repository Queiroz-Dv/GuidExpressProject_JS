const { request } = require("express");
const express = require("express");
const router = express.Router(); //Create Route Page
const Category = require("./Category");
const slugify = require("slugify");

//Create New Category
router.get("/admin/categories/new", (request, response) => {
  response.render("admin/categories/new");;
});

//Add new category in the database
router.post("/categories/save", (request, response)=>{
  var title = request.body.title;
  if (title!=undefined) {
    Category.create({
      title:title,
      slug: slugify(title)
    }).then(()=>{
      response.redirect("/");
    })
  } else {
    response.redirect("/admin/categories/new");
  }
})
module.exports = router;