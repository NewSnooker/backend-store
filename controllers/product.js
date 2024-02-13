const Product = require("../models/Product");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    const product = await new Product(req.body).save();
    res.send(product);
    console.log("product", product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Create Product Error");
  }
};
exports.list = async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    const product = await Product.find()
      .limit(count)
      .populate("category")
      .sort([["createdAt", "desc"]]);

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("List Product Error");
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Product.findOneAndDelete({ _id: id });
    res.send(deleted);
  } catch (err) {
    console.log(err);
    res.status(500).send("Remove Product Error");
  }
};
exports.read = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id })
      .populate("category")
      .exec();
    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("Read Product Error");
  }
};
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send(" Update Product Error");
  }
};
exports.listBy = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const product = await Product.find()
      .limit(limit)
      .populate("category")
      .sort([[sort, order]]);

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send("ListBy Product Error");
  }
};

const handleQuery = async (req, res, query) => {
  let products = await Product.find({ $text: { $search: query } }).populate(
    "category" ,"_id name"
  );
  res.send(products);
};

const handlePrice = async (req, res, price) => {
  let products = await Product.find({
    price: {
      $gte: price[0],
      $lte: price[1]
    }
  }).populate(
    "category" ,"_id name"
  );
  res.send(products);
};

const handleCategory = async (req, res, category) => {
  let products = await Product.find({
    category
  }).populate(
    "category" ,"_id name"
  );
  res.send(products);
};

exports.searchFilters = async (req, res) => {
  const { query ,price ,category } = req.body;
  if (query) {
    await handleQuery(req, res, query);
  }
  if (price !== undefined) {
    await handlePrice(req, res, price);
  }
  if (category) {
    await handleCategory(req, res, category);
  }
};
