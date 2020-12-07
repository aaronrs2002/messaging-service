const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const { checkToken } = require("../../auth/token_validation");

//SERVER SIDE POST MESSAGE
router.post("/post-message", checkToken, (req, res) => {
  let message = {
    avatar: req.body.avatar,
    initiator: req.body.initiator,
    message: req.body.message,
    recipient: req.body.recipient,
    timestamp: req.body.timestamp,
    uuid: req.body.uuid,
  };
  let sql = "INSERT INTO messages SET ?";
  let query = db.query(sql, message, (err, result) => {
    if (err) {
      console.log("What tha error?" + err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//VIEW MESSAGES WHERE userEmail is involved
router.get("/:userEmail", (req, res) => {
  userEmail = req.params.userEmail;

  let sql = `SELECT * FROM messages WHERE initiator = '${userEmail}' OR recipient='${userEmail}' ORDER BY timestamp;`;

  let query = db.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results.length !== 0) {
        console.log(results);

        res.send(results);
      } else {
        console.log("no messages for " + userEmail + ".");
        return false;
      }
    }
  });
});

//MESSAGE VIEWED BY userEmail SERVER SIDE
router.put("/viewed", checkToken, (req, res) => {
  let sql = `UPDATE messages SET recipient = '${req.body.recipient}', initiator = '${req.body.initiator}'  WHERE uuid = '${req.body.uuid}'`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

//DELETE MESSAGE SERVER SIDE
router.delete("/remove-message/:uuid", checkToken, (req, res) => {
  let sql = `DELETE FROM messages WHERE uuid = '${req.params.uuid}'`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});

module.exports = router;
