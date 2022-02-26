const express = require("express");
const router = express.Router(); //Create Route Page

router.get("/categories", (request, response) => {
  response.send();
})
module.exports = router;