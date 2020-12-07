import React, { useState, useEffect } from "react";
import axios from "axios";

const DeleteUser = (props) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  let [infoMessage, toggleInfo] = useState("");

  const deleteUser = () => {
    axios.delete("/delete-user/" + props.userEmail, config).then(
      (res) => {
        if (res.data.email === sessionStorage.getItem("email")) {
          props.showAlert(JSON.stringify(res.data.email) + " was deleted succesfully!", "success");
          props.logout();
        }
      },
      (error) => {
        props.showAlert("That did not work: " + error, "danger");
      }
    );
  };

  return (

      <div>
        <button
          className="btn btn-danger btn-block"
          onClick={() => toggleInfo((infoMessage) => "Delete User")}
        >
          Delete User
        </button>
        {infoMessage === "Delete User" ? (
          <div className="alert alert-danger" role="alert">
            Are you sure you want to delete {props.userEmail}?
            <button className="btn btn-block btn-danger" onClick={deleteUser}>
              Yes
            </button>
            <button
              className="btn btn-block btn-secondary"
              onClick={() => toggleInfo((infoMessage) => "")}
            >
              No
            </button>
          </div>
        ) : null}
      </div>
 
  );
};

export default DeleteUser;
