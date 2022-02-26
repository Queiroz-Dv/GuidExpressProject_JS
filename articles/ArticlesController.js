const express = require("express");
const router = express.Router(); //Create Route Page

router.get("/articles", (request, response) => {
  response.send();
})
module.exports = router;