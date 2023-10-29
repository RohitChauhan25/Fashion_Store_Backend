const express = require("express");
const {
  fetchCategories,
  createCategory,
} = require("../controller/categoryController");

const router = express.Router();

router.route("/category").get(fetchCategories).post(createCategory);

module.exports = router;
