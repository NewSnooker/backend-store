const express = require('express');
const router  = express.Router();
//Controllers
const { 
        create,
        list,
        remove,
        read,
        update,
        listBy,
        searchFilters
      } = require('../controllers/product');

//middleware
const {
        auth,
        adminCheck
      } = require('../middleware/auth');

//@Endpoint http://localhost:5000/api/products
router.get('/products/:count',list)

router.post('/product',auth ,adminCheck ,create)
router.delete('/product/:id',auth ,adminCheck,remove)

//get by id And update
//@Endpoint http://localhost:5000/api/product
router.get('/product/:id',read )
router.put('/product/:id',auth ,adminCheck ,update)


//@Endpoint http://localhost:5000/api/search/filters
router.post('/productby',listBy)
router.post('/search/filters',searchFilters)

module.exports = router;

