const express = require("express");
const app = express();
const port = 8080;
const mongodb = require("./config/mongodbConnection");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cookieSession = require("cookie-session");
const Chat = require("./models/chatModel");
const userRoute = require("./router/userRouter");
const adminRoute = require("./router/adminRoute");
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const upload = require("./middleware/multer");
////
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "html");
nunjucks.configure("view", {
  autoescape: true,
  express: app,
});

// COOKIESSESSION APLLY
app.use(
  cookieSession({
    name: "root",
    secret: "keyboard cat",
    maxAge: 60 * 60 * 1000, // 1hr
  })
);

/////////////////               All User Routes Starts                  //////////////////////////////
///register Page Routes
app.get("/register", userRoute);
app.post("/register", upload.single("image"), userRoute);
///login Page Routes
app.get("/login", userRoute);
app.post("/login", userRoute);
///Dashboard Page Routes
app.get("/dashboard", userRoute);
/////add balance route
app.get("/dashboard/:id/editbal", userRoute);
app.post("/dashboard/:id/editbal", userRoute);
////////transfer amount route
app.get("/dashboard/transfer", userRoute);
app.post("/dashboard/transfer", userRoute);
////////withdraw amount route
app.get("/dashboard/:id/withdraw", userRoute);
app.post("/dashboard/:id/withdraw", userRoute);
///////////chat route
app.get("/dashboard/chatUser", userRoute);
///////////logout route
app.post("/dashboard/logout", userRoute);
///////////forget route
app.get("/forget", userRoute);
app.post("/forget", userRoute);
////////
/////////////////               All User Routes End                  //////////////////////////////

/////////////////               All Admin Routes Starts                  //////////////////////////

app.get("/admin/register", adminRoute);
app.post("/admin/register", adminRoute);
//////login Admin Route
app.get("/admin/login", adminRoute);
app.post("/admin/login", adminRoute);
////dashboard
app.get("/admin/dashboard", adminRoute);
////users
app.get("/admin/dashboard/users", adminRoute);
////transition
app.get("/admin/dashboard/transition", adminRoute);
////show all users AND Edit Routs
app.get("/admin/dashboard/allusers", adminRoute);
app.get("/admin/dashboard/:id/edit", adminRoute);
app.post("/admin/dashboard/:id/edit", adminRoute);
/////Delete User
app.post("/admin/dashboard/:id/delete", adminRoute);

/////////////////               All Admin Routes End                  //////////////////////////////
//Socket Io Starts//
io.on("connection", (socket) => {
  console.log("User Conected...................!!!");
  require("./socketio");
  socket.on("disconnect", () => {
    console.log("User disconected...................!!!");
  });
});
//Socket Io Ends//

server.listen(port, (req, res) => {
  console.log("Server listening......");
});
