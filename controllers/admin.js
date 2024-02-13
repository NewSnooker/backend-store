const Order = require("../models/Order");

exports.changOderStatus = async (req, res) => {
  try {
    const {orderId ,orderStatus} = req.body;
    let orderUpdate = await Order.findByIdAndUpdate(
        orderId,{orderStatus},{new: true}
    )
    res.send(orderUpdate);
  } catch (err) {
    console.log(err);
    res.status(500).send(" Update Order-Status Error");
  }
};

exports.getOrderAdmin = async (req, res) => {
  try {
    let order = await Order.find()
      .populate("products.product")
      .populate("orderBy","username")
      .exec();

    res.send(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("get Order Error");
  }
};