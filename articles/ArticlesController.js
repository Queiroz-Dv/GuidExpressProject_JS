const express = require("express");
const router = express.Router(); //Create Route Page
const Category = require("../categories/Category");

//Routes
router.get("/admin/articles/new", (request, response) => {
  Category.findAll().then(categories=>{
    response.render("admin/articles/new", {categories: categories})
  })
  response.render("admin/articles/new");
});
module.exports = router;