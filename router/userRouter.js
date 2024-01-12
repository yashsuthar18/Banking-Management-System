const express = require("express")
const router = express.Router()
const UserController =  require('../controller/userController')


router.route('/register').get(UserController.registerPageView).post(UserController.validationSchema,UserController.registerDataSave)
////login page routes
router.route('/login').get(UserController.loginPageView).post(UserController.loginPageValidation)
////dashboard page routes
router.route('/dashboard').get(UserController.dashboardPageView)
////balance  page routes
router.route('/dashboard/:id/editbal').get(UserController.addBalancePage).post(UserController.addBalancedone)
//////////////tranfer routes
router.route('/dashboard/transfer').get(UserController.transferPageview).post(UserController.transferBalancedone)
//////Withdraw 
router.route('/dashboard/:id/withdraw').get(UserController.withdrawPageview).post(UserController.withdrawBalancedone)
/////////////Chat Route
router.route('/dashboard/chatUser').get(UserController.ChatPageView)
//////////logout Route
router.route('/dashboard/logout').post(UserController.logOutRoute)
//////////forget Route
router.route('/forget').get(UserController.forgetPassword).post(UserController.forgetPasswordPost)





//////////

module.exports = router