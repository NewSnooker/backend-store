    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const morgan = require('morgan');
    const { readdirSync } = require('fs');
    
    const connectDB = require('./config/db');
    require('dotenv').config()
    const app = express()

    connectDB()

    //middleware
    app.use(morgan('dev'))
    app.use(bodyParser.json({limit: '20mb'}))
    app.use(cors())


    readdirSync('./routes').map((r)=> app.use('/api',require('./routes/'+ r)))

    const port = process.env.PORT
    app.listen(port,()=>{
        console.log('Sever is running on port ' + port);
    })