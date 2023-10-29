const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProductById,
} = require("../controller/productController");
const router = express.Router();

router.route("/products").get(getAllProduct);
router.route("/product/").post(createProduct);
router
  .route("/product/:id")
  .put(updateProduct)
  .delete(deleteProduct)
  .get(fetchProductById);
module.exports = router;
