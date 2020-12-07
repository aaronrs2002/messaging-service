const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const db = require("./config/db");
const { checkToken } = require("./auth/token_validation");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const jwtKey = require("./config/jwt-key");

const app = express();

app.use(bodyParser.json());

//START CREATE USER
const create = (data, callback) => {
  db.query(
    `insert into user(theme,email,password)
                    values(?,?,?)`,
    [data.theme, data.email, data.password],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
};

app.post("/newUser", (req, res) => {
  const body = req.body;
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  create(body, (err, results) => {
    if (err) {
      res.send(err);
      return res.status(500).json({
        success: 0,
        message: "Database connection error: " + err,
      });
    }
    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
});

//END CREATE USER

/////////////////////////////START LOGIN

const saveToken = (token, email) => {
  let sql = `UPDATE user SET token = '${token}' WHERE email = "${email}"`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log("There was an error on the server side: " + err);
    } else {
      console.log(
        "That worked. here is the token result: " + JSON.stringify(result)
      );
      // res.send(result);
    }
  });
};

const getUserByUserEmail = (email, callback) => {
  db.query(
    `select * from user where email = ?`,
    [email],
    (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results[0]);
    }
  );
};

app.post("/login", (req, res) => {
  const body = req.body;
  getUserByUserEmail(body.email, (err, results) => {
    if (err) {
      console.log(err);
    }
    if (!results) {
      return res.json({
        success: 0,
        data: "Invalid email or password NO RESULTS: " + body.email,
      });
    }
    const result = compareSync(body.password, results.password);
    if (result) {
      results.password = undefined;
      const jsontoken = sign(
        {
          result: results,
        },
        jwtKey,
        {
          expiresIn: "1h",
        }
      );

      if (jsontoken) {
        saveToken(jsontoken, body.email);
        console.log("trying to fire saved token.");
      }

      return res.json({
        success: 1,
        message: "Login successful",
        token: jsontoken,
        id: results.id,
      });
    } else {
      return res.json({
        success: 0,
        data: "Invalid email or password COMPARISON FAIL",
      });
    }
  });
});

//////////////////////////////END LOGIN

//START LOGOUT
// replace token with unique id so tokens cannot be used after logout
app.put("/logout-uuid", (req, res) => {
  let sql = `UPDATE user SET token = '${req.body.uuid}' WHERE email = "${req.body.email}"`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      res.send("Setting logout token failed: " + err);
    } else {
      console.log("JSON.stringify(result): " + JSON.stringify(result));
      saveToken(req.body.uuid, req.body.email);
      res.send("logout uuid saved.");
    }
  });
});

//END LOG OUT

//START DELETE USER
app.delete("/delete-user/:email", checkToken, (req, res) => {
  let sql = "DELETE FROM user WHERE email = '" + req.params.email + "'";
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(req.params);
    }
  });
});
//END DELETE USER

//SERVER SIDE UPDATE AVATAR

app.put("/edit-avatar", checkToken, (req, res) => {
  let sql = `UPDATE user SET avatar = '${req.body.avatar}' WHERE email = "${req.body.email}"`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//SERVER SIDE UPDATE AVATAR END

//SERVER SIDE GET AVATAR
app.get("/avatar/:email", (req, res) => {
  let sql = `SELECT avatar FROM user WHERE email = '${req.params.email}'`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
});

//END GET AVATAR

//USER EDIT THEME START

app.put("/edit-theme", checkToken, (req, res) => {
  let sql = `UPDATE user SET theme = '${req.body.theme}' WHERE email = "${req.body.email}"`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//USER EDIT THEME END

//START GET THEME
app.get("/theme/:email", (req, res) => {
  let sql = `SELECT theme FROM user WHERE email = '${req.params.email}'`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.json(results);
    }
  });
});

//END GET THEME

//START REFRESH

app.get("/check-token/:email", checkToken, (req, res) => {
  let sql = `SELECT token FROM user WHERE email = '${req.params.email}'`;
  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log("Checked for token, giot this error: " + err);
    } else {
      res.send(results);
    }
  });
});

//END REFRESH

//CHANGE PASSWORD START

app.put("/change-password", checkToken, (req, res) => {
  const body = req.body;
  const salt = genSaltSync(10);
  body.password = hashSync(body.password, salt);
  let sql = `UPDATE user SET password = '${body.password}' WHERE email = "${body.email}"`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//END CHANGE PASSWORD

//ROUTES
//app.use("/api/users/", require("./routes/api/users/user.router"));
app.use("/api/messages/", require("./routes/api/messages"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`You fired up the messenger on PORT ${PORT}`)
);
