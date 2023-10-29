const express = require("express");
const { fetchBrands, createBrand } = require("../controller/brandController");

const router = express.Router();

router.route("/brands").get(fetchBrands).post(createBrand);

module.exports = router;
