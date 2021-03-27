const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const app = express();
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
<<<<<<< HEAD
<<<<<<< HEAD
=======
const {OAuth2Client} = require("google-auth-library");
>>>>>>> 6b9a830... create google login server
=======

const {OAuth2Client} = require("google-auth-library");
const { SocialUser } = require("./models/SocialUser");
>>>>>>> b90c401... tested token data passed

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
<<<<<<< HEAD
    useUnifiedTopology: true,
<<<<<<< HEAD
    useFindAndModify: false,
=======
>>>>>>> 6b9a830... create google login server
=======
    useFindAndModify : false,
>>>>>>> 9a56d46... success connect to DB
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

<<<<<<< HEAD
=======
const notesRouter = require("./routes/notes");

app.use("/notes", notesRouter);

>>>>>>> 6b9a830... create google login server
// probably dont need
// https
//   .createServer(
//     {
//       key: fs.readFileSync("./localhost-key.pem"),
//       cert: fs.readFileSync("./localhost.pem"),
//     },
//     app
//   )
//   .listen(port, () => {
//     console.log(`Server is running on port: ${443}`);
//   });

//////////////////////////////login server/////////////////////////////

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ userId: req.body.userId }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "해당 아이디의 사용자가 없습니다.",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  //미들웨어를 거친 후 실행됨
  res.status(200).json({
    //유저 정보를 json 형태로 전달
    _id: req.user._id,
    userId: req.user.userId,
    name: req.user.name,
    isAuth: true,
  });
});

app.get("/api/users/logout", auth, (res, req) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

<<<<<<< HEAD
const port = process.env.PORT || 5000;
const notesRouter = require("./routes/notes");
const foldersRouter = require("./routes/folders");

app.use("/api/notes", notesRouter);
app.use("/api/folders", foldersRouter);
=======
/////////Google Login/////////
const client=new OAuth2Client(process.env.GOOGLE_ID);
app.post("/api/users/auth/google", async (req, res)=>{
  const token  = req.body.tokenId;
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_ID
  });
  const payload=ticket.getPayload();
  const userId=payload['sub'];
  const name=payload['name'];

  SocialUser.findOneAndUpdate({userId : userId},{
    name : name,
    userId : userId
  },{upsert : true, new : true},  function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.status(200).send({
      _id : doc._id,
      userId : doc.userId,
      name : doc.name,
      isAuth : true
    });
});
})

/////////Kakao Login/////////
app.post("/api/users/auth/kakao", (req, res)=>{
  const token = req.body;
  const name=token.userName;
  const userId=token.userId;

  SocialUser.findOneAndUpdate({userId : userId},{
    name : name,
    userId : userId
  },{upsert : true}, function(err, doc) {
    if (err) return res.send(500, {error: err});
    return res.status(200).send({
      _id : doc._id,
      userId : doc.userId,
      name : doc.name,
      isAuth : true
    });
  });
})


const port = process.env.PORT || 5000;
>>>>>>> 6b9a830... create google login server

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
