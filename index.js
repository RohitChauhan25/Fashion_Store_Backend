const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

//Import Routes
const Prod = require("./routes/productRoute");
const Brand = require("./routes/brandRoutes");
const Category = require("./routes/categoryRoutes");
const Auth = require("./routes/userRoutes");
const Cart = require("./routes/cartRoutes");

// Import Schema

const uri =
  "mongodb+srv://ronychauhan1:bholenath@cluster0.9evehx2.mongodb.net/E-COM-DATABASE?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
mongoose.set("strictPopulate", false);
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect");
  })
  .catch((err) => console.log(err));

const corsOptions = {
  origin: "*", // Replace with your allowed domain(s)
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 204, // No content status for preflight requests
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", Prod);
app.use("/", Brand);
app.use("/", Category);
app.use("/", Auth);
app.use("/", Cart);

// app.post("/api/register", async (req, res, next) => {
//   try {
//     const { username, email, password } = req.body;
//     const isExist = await Users.findOne({ email });
//     if (isExist) {
//       res.status(400).send("User already exist");
//     } else {
//       const user = new Users({
//         username,
//         email,
//       });
//       bcryptjs.hash(password, 10, (err, hashedPassword) => {
//         if (err) next(err);
//         user.set("password", hashedPassword);
//         user.save((error) => {
//           if (error) next(error);
//           return res.status(200).send("registered");
//         });
//       });
//     }
//   } catch (error) {
//     res.status(500).send("Server Error");
//     console.log(error, "error");
//   }
// });

// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;
//   const user = await Users.findOne({ email });
//   if (!user) res.status(401).send("invalid username or password ");
//   else {
//     const validate = await bcryptjs.compare(password, user.password);
//     if (!validate) res.status(401).send("invalid username or password ");
//     else {
//       const payload = {
//         id: user?._id,
//         username: user?.username,
//       };
//       const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "this is screte key";
//       jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 86400 }, (err, token) => {
//         if (err) res.json({ message: err });
//         return res.status(200).json({ user, token });
//       });
//     }
//   }
// });

// app.post("/api/Post", authenticate, async (req, res) => {
//   const { caption, desc, image } = req.body;
//   const { user } = req;

//   if (!caption || !desc || !image)
//     res.status(401).send("Please fill all the fields");
//   else {
//     const createPost = new Post({
//       caption,
//       desc,
//       image,
//       user: user,
//     });
//     await createPost.save();
//     res.status(200).send("added");
//   }
// });

// app.get("/api/profile", authenticate, async (req, res) => {
//   try {
//     const { user } = req;
//     const profileData = await Post.find({ user: user._id }).populate(
//       "user",
//       "_id, username"
//     );
//     res.status(200).json({ profileData });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.get("/api/getAllPosts", authenticate, async (req, res) => {
//   try {
//     const allPost = await Post.find().populate("user", "_id username email");

//     res.status(200).json({ allPost });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

// app.get("/api/people", authenticate, async (req, res) => {
//   try {
//     const { id } = req.query;
//     const { user } = req;
//     const allPost = await Post.find({ user: id }).populate(
//       "user",
//       "_id username email"
//     );
//     const [followed] = await Contact.find({
//       followerId: user._id,
//       followedId: id,
//     });

//     res.status(200).json({ allPost, isFollowed: !!followed });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.post("/api/follow", authenticate, async (req, res) => {
//   try {
//     const { id } = req.body;
//     const { user } = req;

//     if (!id) return res.status(400).send("id cannot be empty");
//     const [followedUsers] = await Users.find({ _id: id });
//     console.log(followedUsers, "followedUsers");
//     const followUser = new Contact({
//       followerId: user._id,
//       followedId: followedUsers._id,
//     });
//     await followUser.save();
//     res.status(200).send("success");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.post("/api/unfollow", authenticate, async (req, res) => {
//   try {
//     const { id } = req.body;
//     const { user } = req;
//     if (!id) return res.status(400).send("id cannot be empty");
//     await Contact.deleteOne({
//       followerId: user._id,
//       followedId: id,
//     });
//     res.status(200).send("success");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.post("/api/like", authenticate, async (req, res) => {
//   try {
//     const { id } = req.body;
//     const { user } = req;

//     if (!id) return res.status(400).send("id cannot be empty");
//     const updatePost = await Post.updateOne(
//       { _id: id },
//       {
//         $push: { likes: user._id },
//       }
//     );
//     res.status(200).json({ isLike: true });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.post("/api/unlike", authenticate, async (req, res) => {
//   try {
//     const { id } = req.body;
//     const { user } = req;

//     if (!id) return res.status(400).send("id cannot be empty");
//     const updatePost = await Post.updateOne(
//       { _id: id },
//       {
//         $pull: { likes: user._id },
//       }
//     );
//     res.status(200).json({ isLike: true });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.get("/", (req, res) => {
//   res.send("hello");
// });

app.listen(8000, () => {
  console.log("running on server: 8000");
});
