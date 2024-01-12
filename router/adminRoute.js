const express = require("express");
const router = express.Router();
const adminContoller = require("../controller/adminController");
const prefix = "/admin";

router
  .route(`${prefix}/register`)
  .get(adminContoller.adminregisterPageView)
  .post(adminContoller.adminDataSave);
router
  .route(`${prefix}/login`)
  .get(adminContoller.adminloginPageView)
  .post(adminContoller.adminloginPageValidation);
/////////admin dashboard
router.route(`${prefix}/dashboard`).get(adminContoller.admindashboardPageView)
// .post(adminContoller.adminDataSave)
////////////
router.route(`${prefix}/dashboard/users`).get(adminContoller.usersdashboardPageView);
////transition route
router.route(`${prefix}/dashboard/transition`).get(adminContoller.transitionPageView);
////   Show All User Route
router.route(`${prefix}/dashboard/allusers`).get(adminContoller.showAllUserPageView);
router.route(`${prefix}/dashboard/:id/edit`).get(adminContoller.EditAllUserPageView).post(adminContoller.EditAllUserSave)
//////delete Routes
router.route(`${prefix}/dashboard/:id/delete`).post(adminContoller.deleteUserRoute)









module.exports = router;
