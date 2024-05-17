const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// const verufyUser = (req, res, next) => {
//   const token = req.cookies.token;
//   const refreshToken = req.cookies.refreshToken;
//   console.log(token);
//   console.log(refreshToken);
// };

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;
  console.log(token);
  console.log(refreshToken);

  try {
    if (!token && !refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (tokenErr, decoded) => {
      if (tokenErr) {
        if (!refreshToken) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid Token" });
        } else {
          jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (refreshErr, decodedRefresh) => {
              if (refreshErr) {
                res.clearCookie("token");
                res.clearCookie("refreshToken");
                return res.status(401).json({
                  success: false,
                  message: "Token expired. Please log in again.",
                });
              } else {
                const newAccessToken = jwt.sign(
                  {
                    name: decodedRefresh.name,
                    email: decodedRefresh.mail,
                    id: decodedRefresh.id,
                  },
                  process.env.ACCESS_TOKEN_SECRET,
                  {
                    expiresIn: "1m",
                  }
                );
                res.cookie("token", newAccessToken, {
                  httpOnly: true,
                  secure: true,
                  sameSite: "None",
                });
                // req.name = decodedRefresh.name;
                // req.email = decodedRefresh.mail;
                // req.id = decodedRefresh.id;
                next();
              }
            }
          );
        }
      } else {
        req.name = decoded.name;
        req.mail = decoded.mail;
        req.id = decoded.id;
        req.isAdmin = decoded.isAdmin;
        next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyUser;
