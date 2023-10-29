const Product = require("../modal/productModal");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");

// Add Product
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

//Get All Products
exports.getAllProduct = async (req, res) => {
  // let condition = {};

  const { category, subCategory, for: gender, sortBy, discount } = req.query;
  let subCategoryArray;

  if (subCategory) {
    subCategoryArray = JSON.parse(subCategory);
  }

  const filter = {};
  const sortOptions = {};
  if (category) {
    filter.category = category;
  }
  if (subCategoryArray?.length > 0) {
    console.log(subCategory, "subCategory");
    filter.subCategory = subCategoryArray;
  }
  if (gender) {
    filter.for = gender;
  }

  if (discount) {
    // Add a filter for products with a discount of 10% or more
    filter.discountPercentage = { $gte: discount };
  }

  if (sortBy === "price") {
    sortOptions.price = 1; // 1 for ascending order, -1 for descending order
  }
  // const filter = {
  //   category,
  //   subCategory: { $in: subCategoryArray },
  //   for: gender,
  // };

  Product.find(filter)
    .sort(sortOptions)
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      console.error("Error finding products:", error);
      res.status(500).send("Internal Server Error");
    });

  // Initialize the main query and the total count query
  // let query = Product.find(condition);
  // let totalProductsQuery = Product.find(condition);

  // // Filtering based on category
  // if (req.query.category) {
  //   const categories = req.query.category.split(",");
  //   query = query.where("category").in(categories);
  //   totalProductsQuery = totalProductsQuery.where("category").in(categories);
  // }

  // if (req.query.subCategory) {
  //   const subcategories = req.query.subCategory.split(",");
  //   query = query.where("subCategory").in(subcategories);
  //   totalProductsQuery = totalProductsQuery
  //     .where("subCategory")
  //     .in(subcategories);
  // }

  // if (req.query.for) {
  //   const fors = req.query.for.split(",");
  //   query = query.where("for").in(fors);
  //   totalProductsQuery = totalProductsQuery.where("for").in(fors);
  // }

  // if (req.query.brand) {
  //   const brands = req.query.brand.split(",");
  //   query = query.where("brand").in(brands);
  //   totalProductsQuery = totalProductsQuery.where("brand").in(brands);
  // }

  // // Pagination
  // if (req.query._page && req.query._limit) {
  //   const pageSize = parseInt(req.query._limit);
  //   const page = parseInt(req.query._page);
  //   query = query.skip(pageSize * (page - 1)).limit(pageSize);
  // }

  // // Sorting
  // if (req.query._sort && req.query._order) {
  //   const sortField = req.query._sort;
  //   const sortOrder = req.query._order === "desc" ? -1 : 1; // Default to ascending order
  //   query = query.sort({ [sortField]: sortOrder });
  // }

  // try {
  //   const docs = await query.exec();
  //   const totalDocs = await totalProductsQuery.countDocuments();

  //   // Set the total count response header
  //   res.set("X-Total-Count", totalDocs);

  //   res.status(200).json(docs);
  // } catch (error) {
  //   console.log(error);
  //   res.status(400).json(error);
  // }
};

//get single Product
exports.fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

// exports.getSingleProduct = async (req, res, next) => {
//   const { id } = req.params;

//   let Product = await Product.findById(id);
//   if (!Product) {
//     return res.status(500).json({
//       success: false,
//       message: "product not found",
//     });
//   }
//   res.status(200).json({
//     success: true,
//     Product,
//   });
// };

// update product

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    product.discountPrice = Math.round(
      product.price * (1 - product.discountPercentage / 100)
    );
    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

// exports.updateProduct = async (req, res) => {
//   let Product = await Prodc.findById({ _id: req.params.id });
//   if (!Product) {
//     res.status(500).json({
//       success: false,
//       message: "product not found",
//     });
//   }
//   Product = await Prodc.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     Product,
//   });
// };

//deltete Product
exports.deleteProduct = async (req, res) => {
  let Product = await Prodc.findById({ _id: req.params.id });
  if (!Product) {
    res.status(500).json({
      success: false,
      message: "product not found",
    });
  }
  await Product.remove();
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
};
