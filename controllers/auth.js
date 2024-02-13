const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { token } = require("morgan");

exports.register = async (req, res) => {
  //check user
  try {
    const { username, password } = req.body;
    var user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("User Already exits");
    }
    const salt = await bcrypt.genSalt(10);
    user = new User({
      username,
      password,
    });
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.send("register success");
    //Encrypt
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    var user = await User.findOneAndUpdate({ username },{ new: true });

      //สถานะการใช้งาน เปิดอยู่รึป่าว ถ้าเป็น true ค่อยทำ
    if (user && user.enabled) {
      const isMath = await bcrypt.compare(password, user.password);

      if (!isMath) {
        return res.status(400).send("Password invalid!");
      }
      //Payload
      const payload = {
        user: {
          username: user.username,
          role: user.role,
        },
      };
      //Token
      jwt.sign(payload, "jwtSecret", { expiresIn: 3600 }, (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token, payload });
      });
    } else {
      return res.status(400).send("User Not found!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.currentUser = async (req, res) =>{
  try{
    //model User
    console.log('controller',req.user);
    const user = await User.findOne({username:req.user.username})
    .select('-password').exec()
    res.send(user)
  }catch(err){
    console.log(err);
    res.status(500).send("Sever Error!");
  }
}













exports.listUser = async (req, res) => {
  try {
    res.send("list Get User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.editUser = async (req, res) => {
  try {
    res.send("Edit User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    res.send("remove User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Sever Error!");
  }
};
