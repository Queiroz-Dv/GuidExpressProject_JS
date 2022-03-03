const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (request, response) => {
  User.findAll().then(users => {
    response.render("admin/users/index", { users: users });
  });
});

//Create a new user
router.get("/admin/users/create", (request, response) => {
  response.render("admin/users/create");
});

router.post("/users/create", (request, response) => {
  var email = request.body.email;
  var password = request.body.password;

  User.findOne({ where: { email: email } }).then(user => {
    if (user == undefined) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      User.create({
        email: email,
        password: hash
      }).then(() => {
        response.redirect("/");
      }).cath((error) => {
        response.redirect("/")
      })

    } else {
      response.redirect("/admin/users/create");
    }
  });
  //response.json({email, password}); FOR TEST
});
module.exports = router;