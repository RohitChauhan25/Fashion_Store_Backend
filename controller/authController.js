const Users = require("../modal/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isExist = await Users.findOne({ email });
    if (isExist) {
      res.status(400).send("User already exist");
    } else {
      const user = new Users({
        password,
        email,
      });
      bcryptjs.hash(password, 10, (err, hashedPassword) => {
        if (err) next(err);
        user.set("password", hashedPassword);
        user.save((error) => {
          if (error) next(error);
          return res.status(200).json({
            success: true,
            message: "user registered",
          });
        });
      });
    }
  } catch (error) {
    res.status(500).send("Server Error");
    console.log(error, "error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email: email });
  if (!user) res.status(401).send("invalid username or password ");
  else {
    const validate = await bcryptjs.compare(password, user.password);
    if (!validate) res.status(401).send("invalid username or password ");
    else {
      const payload = {
        id: user?._id,
        email: user?.email,
      };
      const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "this is screte key";
      jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 86400 }, (err, token) => {
        console.log(token);
        if (err) res.json({ message: err });
        res.status(200).json({ id: user.id, email: user.email, token });
      });
    }
  }
};

// exports.createUser = async (req, res) => {
//   try {
//     const salt = crypto.randomBytes(16);
//     crypto.pbkdf2(
//       req.body.password,
//       salt,
//       310000,
//       32,
//       "Roh256",
//       async function (err, hashedPassword) {
//         const user = new User({ ...req.body, password: hashedPassword, salt });
//         const doc = await user.save();

//         req.login(sanitizeUser(doc), (err) => {
//           // this also calls serializer and adds to session
//           if (err) {
//             res.status(400).json(err);
//           } else {
//             const token = jwt.sign(
//               sanitizeUser(doc),
//               process.env.JWT_SECRET_KEY
//             );
//             res
//               .cookie("jwt", token, {
//                 expires: new Date(Date.now() + 3600000),
//                 httpOnly: true,
//               })
//               .status(201)
//               .json({ id: doc.id, role: doc.role });
//           }
//         });
//       }
//     );
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };
