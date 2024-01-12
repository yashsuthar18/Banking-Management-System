const admin = require("../models/admin/adminModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Transition = require("../models/transitionModel");
const userModel = require("../models/userModel");
///////register admin route
module.exports.adminregisterPageView = (req, res) => {
  try {
    res.render("admin/registerpage");
  } catch (error) {
    res.status(404).json(error.message);
  }
};
module.exports.adminDataSave = async (req, res) => {
  try {
    let { email, password } = req.body;
    const hash = await bcrypt.hash(password, saltRounds);
    const newUser = await new admin({
      email,
      password: hash,
    });
    await newUser.save();
    res.redirect("/admin/login");
  } catch (error) {
    res.status(404).json(error.message);
  }
};
///////////////admin login route
module.exports.adminloginPageView = (req, res) => {
  try {
    res.render("admin/loginPage");
  } catch (error) {
    res.status(404).json(error.message);
  }
};
module.exports.adminloginPageValidation = async (req, res) => {
  try {
    let { email, password } = req.body;
    let dataBase = await admin.findOne({ email: email });

    const hash = await bcrypt.compare(password, dataBase.password);
    req.session.admin = dataBase;
    if (hash == true) {
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/loginPage");
    }
  } catch (error) {
    res.status(404).json(error.message);
  }
};
/////show dashboard
module.exports.admindashboardPageView = async (req, res) => {
  let ShowAllUsers = await Transition.find({});
  try {
    const depositTotal = await Transition.aggregate([
      {
        $match: {
          tr_type: "deposit",
        },
      },
      {
        $group: {
          _id: "$tr_type",
          total: {
            $sum: "$tr_amount",
          },
        },
      },
    ]);
    const WithdrawTotal = await Transition.aggregate([
      {
        $match: {
          tr_type: "widthdraw",
        },
      },
      {
        $group: {
          _id: "tr_type",
          total: {
            $sum: "$tr_amount",
          },
        },
      },
    ]);
    const allUserCount = await userModel.aggregate([
      {
        $count: "account",
      },
    ]);
    res.render("admin/adminDashboard", {
      depositTotal,
      WithdrawTotal,
      allUserCount,
    });
  } catch (error) {
    res.status(404).json(error.message);
  }
};
////////User Edit routes
module.exports.usersdashboardPageView = async (req, res) => {
  try {
    let findAllUser = await userModel.find({});
    res.render("admin/users", { findAllUser });
  } catch (error) {
    res.status(404).json(error.message);
  }
};

////transition
module.exports.transitionPageView = async (req, res) => {
  try {
    let findAllTransition = await Transition.find({});
    const Count = await Transition.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "to_user",
          foreignField: "_id",
          as: "value",
        },
      },
    ]);
    const CountTwo = await Transition.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "from_user",
          foreignField: "_id",
          as: "value",
        },
      },
    ]);
    res.render("admin/transition", { findAllTransition, Count, CountTwo });
  } catch (error) {
    res.status(404).json(error.message);
  }
};
//// Show All User Route
module.exports.showAllUserPageView = async (req, res) => {
  try {
    let ShowAllUsers = await userModel.find({});
    res.render("admin/showAllUserModel", { ShowAllUsers });
  } catch (error) {
    res.status(404).json(error.message);
  }
};
//// Show All User Route edit Route
module.exports.EditAllUserPageView = async (req, res) => {
  try {
    let id = req.params.id;
    let editUser = await userModel.findOne({ _id: id });
    res.render("admin/userEdit", { editUser });
  } catch (error) {
    res.status(404).json(error.message);
  }
};
module.exports.EditAllUserSave = async (req, res) => {
  try {
    let id = req.params.id;
    let { name, email, phone, balance, status } = req.body;
    const saveUserData = await userModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        phone,
        balance,
        status: status,
      }
    );
    res.redirect("/admin/dashboard/allusers");
  } catch (error) {
    res.status(404).json(error.message);
  }
};

////////User Delete Route
module.exports.deleteUserRoute = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    let deleteUser = await userModel.findByIdAndDelete({ _id: id });
    res.redirect("/admin/dashboard/allusers");
  } catch (error) {
    res.status(404).json(error.message);
  }
};
