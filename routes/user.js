const express = require("express");
const router = express.Router();

//Controller
const { 
    listUsers,
    readUsers,
    updateUsers,
    removeUsers,
    changStatus,
    changRole,
    userCart,
    getUserCart,
    saveAddress,
    saveOrder,
    getOrder,
    emptyCart,
    addToWishList,
    getWishList,
    deleteWishList,
 } = require('../controllers/user');

//middleware
const { auth, adminCheck } = require('../middleware/auth'); 

//@Endpoint  http://localhost:5000/api/users
//@Method  GET
//@Access  Private
router.get("/users",auth ,adminCheck ,listUsers)

//@Endpoint  http://localhost:5000/api/users/:id
//@Method  GET
//@Access  Private
router.get("/users/:id",readUsers)

//@Endpoint  http://localhost:5000/api/users/:id
//@Method  PUT
//@Access  Private
router.put("/users/:id",auth ,adminCheck ,updateUsers)

//@Endpoint  http://localhost:5000/api/users/:id
//@Method  DELETE
//@Access  Private
router.delete("/users/:id",auth ,adminCheck ,removeUsers)

//@Endpoint  http://localhost:5000/api/chang-status
//@Method  POST
//@Access  Private
router.post("/chang-status",auth ,adminCheck ,changStatus)

//@Endpoint  http://localhost:5000/api/chang-role
//@Method  POST
//@Access  Private
router.post("/chang-role",auth ,adminCheck ,changRole)

//@Endpoint  http://localhost:5000/api/user/cart
//@Method  POST
//@Access  Private
router.post("/user/cart",auth ,userCart)

//@Endpoint  http://localhost:5000/api/user/cart
//@Method  GET
//@Access  Private
router.get("/user/cart",auth ,getUserCart)

//@Endpoint  http://localhost:5000/api/user/cart
//@Method  DELETE
//@Access  Private
router.delete("/user/cart",auth ,emptyCart)

//@Endpoint  http://localhost:5000/api/user/address
//@Method  POST
//@Access  Private
router.post("/user/address",auth ,saveAddress)

//@Endpoint  http://localhost:5000/api/user/order
//@Method  POST
//@Access  Private
router.post("/user/order",auth ,saveOrder)

//@Endpoint  http://localhost:5000/api/user/order
//@Method  GET
//@Access  Private
router.get("/user/order",auth ,getOrder)

//@Endpoint  http://localhost:5000/api/user/wishlist
//@Method  POST
//@Access  Private
router.post("/user/wishlist",auth ,addToWishList)

//@Endpoint  http://localhost:5000/api/user/wishlist
//@Method  GET
//@Access  Private
router.get("/user/wishlist",auth ,getWishList)

//@Endpoint  http://localhost:5000/api/user/wishlist/:productId
//@Method  PUT
//@Access  Private
router.put("/user/wishlist/:productId",auth ,deleteWishList)

module.exports = router;














