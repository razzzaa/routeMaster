require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const port = 3000;
const bcrypt = require("bcrypt");
const saltRounds = 10;
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const verifyUser = require("./authServer");

const app = express();

// DEVELOPMENT:
/* app.use(
  cors({
    origin: [
      "https://routemaster.onrender.com",
      "https://routemasterserver.onrender.com",
    ],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
); */

// PRODUCTION:
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3030"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const conn = mysql.createConnection({
  // PRODUCTION MYSQL//.........................................................................
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,

  //LOCAL//.....................................................................................
  /* host: "localhost",
  user: "root",
  password: "",
  database: "travelroute",
  port: 3306, */
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected succesefully to mySQL!");
  }
});

// app.get("/api/data", (req, res) => {
//   try {
//     conn.query(`SELECT * FROM locations`, (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send(result);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("Internal Server Error");
//   }
// });

app.get("/api/userLocations/:userId", (req, res) => {
  const userId = req.params.userId;
  console.log(userId);
  try {
    conn.query(
      `SELECT locations. *
        FROM locations
        JOIN location_user ON locations.id = location_user.location_id
        WHERE location_user.user_id = ?`,
      [userId],
      (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        }
        console.log(result);

        res.json({ success: true, locations: result });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/cities/:id", (req, res) => {
  const { id } = req.params;
  try {
    conn.query(`SELECT * FROM locations WHERE id= ?`, [id], (err, result) => {
      if (err) {
        res.status(500).json("Failed to Select City");
      } else {
        console.log(result);
        res.status(200).json({
          success: true,
          message: "City Selected Successfully",
          locations: result,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(404).send("city not found");
  }
});

// app.post("/api/addCity", (req, res) => {
//   const { city, country, countryIso, date, notes, id, lat, lng, userId } =
//     req.body;
//   console.log(city);
//   try {
//     conn.query(
//       `INSERT INTO locations (city, country, countryIso, date, notes, id, lat ,lng)
//         VALUES (?,?,?,?,?,?,?,?)`,
//       [city, country, countryIso, date, notes, id, lat, lng],
//       (error, result) => {
//         if (error) {
//           console.log(error);
//           return res.status(500).json({
//             success: false,
//             message: "upload failed",
//           });
//         } else {
//           console.log(result);
//           return res.status(200).json({
//             success: true,
//             message: "city added succesefully",
//           });
//         }
//       }
//     );
//   } catch {}
// });

app.post("/api/addCity", (req, res) => {
  const { city, country, countryIso, MYSQLdate, notes, lat, lng, userId } =
    req.body;
  console.log(city);
  try {
    conn.query(
      `INSERT INTO locations (city, country, countryIso, date, notes, lat ,lng) 
        VALUES (?,?,?,?,?,?,?)`,
      [city, country, countryIso, MYSQLdate, notes, lat, lng],
      (error, result) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "upload failed",
          });
        } else {
          const locationId = result.insertId;
          console.log(locationId);
          conn.query(
            `INSERT INTO location_user (user_id, location_id) VALUES (?,?)`,
            [userId, locationId],
            (error, result) => {
              if (error) {
                return res.status(500).json({ success: false, message: error });
              } else {
                console.log(result);
                return res.status(200).json({
                  success: true,
                  message: "city added succesefully",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.delete("/api/deleteCity/:id", (req, res) => {
  try {
    const { id } = req.params;
    conn.query(`DELETE FROM locations WHERE id=?`, [id], (error, result) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "failed to delete city",
        });
      } else {
        console.log(result);
        return res.status(200).json({
          success: true,
          message: "city deleted successefully",
        });
      }
    });
  } catch {}
});

app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  try {
    bcrypt.hash(password, saltRounds, (error, hash) => {
      if (error)
        return res.status(500).json({ Error: "Error while hashing password" });
      conn.query(
        `INSERT INTO users (name, email, password) VALUES(?,?,?)`,
        [name, email, hash],
        (error, result) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Registration failed.",
            });
          } else {
            conn.query(
              `SELECT email, name, id FROM users WHERE email=?`,
              [email],
              (err, results) => {
                if (err) return console.log(err);
                if (results.length > 0) {
                  const { name, email, id } = results[0];

                  const token = jwt.sign(
                    { name, email, id },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                      expiresIn: "10m",
                    }
                  );
                  const refreshToken = jwt.sign(
                    { name, email, id },
                    process.env.REFRESH_TOKEN_SECRET,
                    {
                      expiresIn: "1h",
                    }
                  );

                  res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                  });
                  res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                  });

                  return res.status(200).json({
                    success: true,
                    message: "Registered successfully.",
                    name,
                    email,
                    id,
                  });
                }
              }
            );
          }
        }
      );
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  console.log(res.message);

  conn.query(`SELECT * FROM users WHERE email =?`, [email], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.length > 0) {
      bcrypt.compare(
        password.toString(),
        result[0].password,
        (bcryptErr, response) => {
          if (bcryptErr) {
            console.log(bcryptErr);
            return res.status(500).json({ error: "bcrypt error" });
          }
          if (response) {
            console.log(result[0]);
            const { name, email, id } = result[0];

            const token = jwt.sign(
              { name, email, id },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "10m",
              }
            );
            const refreshToken = jwt.sign(
              { name, email, id },
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );

            res.cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
            });

            return res.status(200).json({
              success: true,
              message: "Logged in successful.",
              userData: { name, email, id },
            });
          } else {
            console.log("Invalid password provided.");
            return res
              .status(401)
              .json({ error: "Invalid username/password combination" });
          }
        }
      );
    } else {
      console.log("User not found.");
      return res.status(401).json({ error: "User not found" });
    }
  });
});

app.get("/api/isLogged", verifyUser, (req, res) => {
  console.log(req.name);
  console.log(req.email);
  console.log(req.id);
  res.status(200).json({
    success: true,
    name: req.name,
    email: req.email,
    id: req.id,
  });
});

app.post("/api/checkEmail", (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    conn.query(
      `SELECT * FROM users WHERE email =?`,
      [email],
      (error, result) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
        } else if (result.length > 0) {
          console.log("inUse");
          return res.status(409).json({
            inUse: true,
            message: "Email is already in use!",
          });
        } else {
          console.log("notInUse");

          return res.status(200).json({
            inUse: false,
            message: "Email is available",
          });
        }
      }
    );
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

app.get("/api/logOut", (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
  }
});

app.listen(
  process.env.PORT,
  console.log(`listening to port ${process.env.PORT}!`)
);
