const express = require("express");
const router = express.Router();

//Controller
const {
    changOderStatus,
    getOrderAdmin
} = require("../controllers/admin");

//middleware
const { auth, adminCheck } = require('../middleware/auth'); 

//@Endpoint  http://localhost:3000/api/admin/order-status
//@Method  PUT
//@Access  Publish
router.put("/admin/order-status",auth ,adminCheck , changOderStatus);

//@Endpoint  http://localhost:3000/api/admin/order
//@Method  get
//@Access  Publish
router.get("/admin/order",auth ,adminCheck , getOrderAdmin);

module.exports = router;
