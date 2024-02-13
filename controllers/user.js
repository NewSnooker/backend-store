const bcrypt = require("bcryptjs");

//Models
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

exports.listUsers = async (req, res) => {
  try {
    const user = await User.find({}).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.readUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.updateUsers = async (req, res) => {
  try {
    var { id, password } = req.body.values;
    const salt = await bcrypt.genSalt(10);
    const enPassword = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: enPassword }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.removeUsers = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.changStatus = async (req, res) => {
  try {
    const id = req.body.id;
    const enabled = req.body.enabled;
    const user = await User.findOneAndUpdate({ _id: id }, { enabled: enabled });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.changRole = async (req, res) => {
  try {
    const id = req.body.id;
    const role = req.body.role;
    const user = await User.findOneAndUpdate({ _id: id }, { role: role });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;

    //เช็ค user
    let user = await User.findOne({ username: req.user.username }).exec();

    let products = [];

    //ถ้ามีสินค้าในตะกร้า ให้ลบออก
    await Cart.findOneAndDelete({ orderBy: user._id });

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.price = cart[i].price;

      products.push(object);
    }

    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    //save เข้า collection
    let newCart = await new Cart({
      products,
      cartTotal,
      orderBy: user._id,
    }).save();

    console.log("newCart", newCart);
    res.status(200).send("UserCart ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("UserCart Sever Error");
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    let cart = await Cart.findOne({ orderBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

    let { products, cartTotal } = cart;
    res.json({ products, cartTotal });
  } catch (err) {
    console.log(err);
    res.status(500).send("getUser Cart Error");
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();

    const empty = await Cart.findOneAndDelete({ orderBy: user._id }).exec();
    res.status(200).send(empty);
  } catch (err) {
    console.log(err);
    res.status(500).send("Delete Cart Error");
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userAddress = await User.findOneAndUpdate(
      { username: req.user.username },
      { address: address }
    ).exec();

    res.status(200).json({
      ok: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Save Address Error");
  }
};

exports.saveOrder = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    let userCart = await Cart.findOne({ orderBy: user._id }).exec();

    let order = await new Order({
      products: userCart.products,
      orderBy: user._id,
      cartTotal: userCart.cartTotal,
    }).save();

    // + - products
    let bulkOption = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });

    let updated = await Product.bulkWrite(bulkOption, {});

    res.send(updated);
  } catch (err) {
    console.log(err);
    res.status(500).send("Save order Error");
  }
};

exports.getOrder = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();
    let order = await Order.find({ orderBy: user._id })
      .populate("products.product")
      .exec();

    res.send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("get Order Error");
  }
};

exports.addToWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $addToSet: { wishlist: productId } } //การเพิ่มสินค้าโดยใช้สูตร set
    ).exec();

    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Add wishlist Error");
  }
};

exports.getWishList = async (req, res) => {
  try {
    const list = await User.findOne({ username: req.user.username })
      .select("wishlist")
      .populate("wishlist")
      .exec();
    res.json(list);
  } catch (err) {
    console.log(err);
    res.status(500).send("Get wishlist Error");
  }
};

exports.deleteWishList = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { $pull: { wishlist: productId } } //ลบ ข้อมูลในฟิลด์ wishlist
    ).exec();
    res.send(productId)
  } catch (err) {
    console.log(err);
    res.status(500).send("delete wishlist Error");
  }
};
