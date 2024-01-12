const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const uniqid = require("uniqid");
const registerValidation = require("../models/joiSchema/registerValidationJoi");
const Transition = require("../models/transitionModel");
const Chat = require("../models/chatModel");
// const jwt = require("jsonwebtoken");

//////Joi Schema Register Validation User
module.exports.validationSchema = async (req, res, next) => {
  let { name, account, email, phone, password } = req.body;
  const { error } = await registerValidation.validate(req.body);
  if (error) {
    res.status(404).send({ message: error.message });
    // res.redirect("/register");
  } else {
    return next();
  }
};

////////////register Route
module.exports.registerPageView = (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    res.status(404).send({ message: err.message });
  }
};
module.exports.registerDataSave = async (req, res) => {
  let { name, account, email, phone, password } = req.body;
  try {
    let dateCur = new Date();
    let todayDate = dateCur.toString().split(" ").slice(1, 4).join("-");
    const hash = await bcrypt.hash(password, saltRounds);
    const userPro = req.file.filename;
    const newUser = await new userModel({
      name,
      account,
      email,
      phone,
      image: userPro,
      register_date: todayDate,
      password: hash,
    });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.log("sdf", err.message);
    res.status(404).send({ message: err.message });
  }
};

////login route
module.exports.loginPageView = (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/dashboard");
    } else {
      res.render("login");
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
};
module.exports.loginPageValidation = async (req, res) => {
  try {
    let { email, password } = req.body;
    let dataBase = await userModel.findOne({ email: email });
    if (dataBase) {
      const newhash = await bcrypt.compare(password, dataBase.password);
      if (newhash == true) {
        req.session.user = dataBase;
        res.redirect("/dashboard");
      } else {
        res
          .status(404)
          .json({ message: "Invalid password. Please try again." });
      }
    } else {
      res.status(404).json({
        message:
          "We couldn't find a matching user in our database. Please verify your credentials or register if you are a new user.",
      });
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};

/////dashboard route
module.exports.dashboardPageView = async (req, res) => {
  try {
    if (req.session.user) {
      let id = req.session.user._id;
      let dataBase = await userModel.findOne({ _id: id });
      let history = await Transition.find({});
      res.render("dashboard", { dataBase, history, id });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    res.status(404).json(error.message);
  }
};

////balance amount route
module.exports.addBalancePage = async (req, res) => {
  try {
    if (req.session.user.status == "active") {
      let id = req.params.id;
      let dataBase = await userModel.findOne({ _id: id });
      res.render("editBalance", { dataBase });
    } else {
      res.render("Block");
    }
  } catch (err) {
    res.status(404).json(error.message);
  }
};
module.exports.addBalancedone = async (req, res) => {
  try {
    let dateCur = new Date();
    let todayDate = dateCur.toString().split(" ").slice(1, 4).join("-");
    let { id, account, balance } = req.body;
    const newTransition = await Transition({
      transition_id: uniqid(),
      to_user: req.session.user._id,
      from_user: id,
      tr_type: "deposit",
      tr_status: "completed",
      tr_date: todayDate,
      tr_amount: balance,
    });
    await newTransition.save();
    let dataBase = await userModel.findOne({ _id: id, account: account });
    let totalBalance = parseInt(dataBase.balance) + parseFloat(balance);
    let newEditBalance = await userModel.findByIdAndUpdate(
      { _id: dataBase._id },
      { balance: totalBalance }
    );
    req.session.user.balance = totalBalance;
    res.redirect("/dashboard");
  } catch (err) {
    res.status(404).json(err.message);
  }
};

/////////////transfer amount route
module.exports.transferPageview = (req, res) => {
  if (req.session.user.status == "active") {
    res.render("transferPage");
  } else {
    res.render("Block");
  }
};
module.exports.transferBalancedone = async (req, res) => {
  try {
    let { tr_amount, account } = req.body;
    let dateCur = new Date();
    let todayDate = dateCur.toString().split(" ").slice(1, 4).join("-");
    let findUserdb = await userModel.findOne({ account: account });
    let id = req.session.user._id;
    let findUser = await userModel.findOne({ _id: id });
    let curruntBalance = findUser.balance;
    let curruntaccount = findUser.account;
    const newTransition = await Transition({
      transition_id: uniqid(),
      to_user: findUserdb._id,
      from_user: req.session.user._id,
      tr_type: "transfer",
      tr_status: "completed",
      tr_date: todayDate,
      tr_amount,
    });
    await newTransition.save();
    if (curruntBalance >= tr_amount && curruntaccount != account) {
      let totalBala = parseInt(findUser.balance) - parseInt(tr_amount);
      let newEditBala = await userModel.findByIdAndUpdate(
        { _id: findUser._id },
        { balance: totalBala }
      );
      ////
      let totalBalance = parseInt(findUserdb.balance) + parseInt(tr_amount);
      let newEditBalance = await userModel.findByIdAndUpdate(
        { _id: findUserdb._id },
        { balance: totalBalance }
      );
    } else {
      res.status(404).json(error.message);
    }

    //////////////////////////

    /////
    res.redirect("/dashboard");
  } catch (err) {
    res.status(404).json(err.message);
  }
};

/////////////transfer amount route
module.exports.withdrawPageview = async (req, res) => {
  try {
    if (req.session.user.status == "active") {
      let id = req.params.id;
      let dataBase = await userModel.findOne({ _id: id });
      res.render("withdraw", { dataBase });
    } else {
      res.render("Block");
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};
module.exports.withdrawBalancedone = async (req, res) => {
  try {
    let dateCur = new Date();
    let todayDate = dateCur.toString().split(" ").slice(1, 4).join("-");
    let { id, phone, email, balance } = req.body;
    let dataBase = await userModel.findOne({ phone: phone, email: email });
    let curruntBalance = dataBase.balance;
    if (curruntBalance >= balance) {
      let totalBalance = parseInt(dataBase.balance) - parseInt(balance);
      let newEditBalance = await userModel.findByIdAndUpdate(
        { _id: dataBase._id },
        { balance: totalBalance }
      );
      req.session.user.balance = totalBalance;
      ////
      const newTransition = await Transition({
        transition_id: uniqid(),
        to_user: id,
        from_user: id,
        tr_type: "widthdraw",
        tr_status: "completed",
        tr_date: todayDate,
        tr_amount: balance,
      });
      await newTransition.save();
      /////////
      res.redirect("/dashboard");
    } else {
      res.status(404).json({
        error: {
          message:
            "Unable to process withdrawal due to insufficient balance. Please ensure sufficient funds and try again.",
        },
      });
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};

///////////////////chat
module.exports.ChatPageView = async (req, res) => {
  try {
    if (req.session.user.status == "active") {
      let id = req.session.user._id;
      let dataBase = await userModel.findOne({ _id: id });
      let chatdata = await Chat.find({});
      res.render("chatArea", { dataBase, chatdata, id });
    } else {
      res.render("Block");
    }
  } catch (err) {
    res.status(404).json(err.message);
  }
};

///logout route
module.exports.logOutRoute = (req, res) => {
  req.session.user = null;
  res.redirect("/login");
};

/////////forgot Pass
module.exports.forgetPassword = (req, res) => {
  res.render("forgetPassword");
};
// module.exports.forgetPasswordPost = async (req, res) => {
//   let { email } = req.body;
//   let dataBase = await userModel.findOne({ email: email });
//   if (dataBase) {
//     let { email } = dataBase;
//     let token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
//     console.log(token);
//   } else {
//     res.status(404).json(error.message);
//   }
// };
