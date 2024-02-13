const mongoose = require('mongoose');
const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.DATABASE_DEPLOY)
        console.log('ConnectDB success');
    }catch(err){
        console.log(err);
        console.error(err.message);
        process.exit(1)
    }
}

module.exports = connectDB;