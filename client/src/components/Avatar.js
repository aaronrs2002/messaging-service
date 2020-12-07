import React, { useState, useEffect } from "react";
import axios from "axios";

const Theme = (props) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  //CLIENT SIDE CHANGE AVATAR
  function changeAvatar() {
    let avatar = "";
    if (document.querySelector("input.error[name='avatar']")) {
      document.querySelector("input[name='avatar']").classList.remove("error");
    }
    try {
      if (document.querySelector("input[name='avatar']").value) {
        avatar = document.querySelector("input[name='avatar']").value;
      }
    } catch (error) {
      console.error(error);
    }

    if (avatar === "") {
      document.querySelector("input[name='avatar']").classList.add("error");
      props.showAlert("Please submit an image URL", "danger");
      return false;
    } else {
    }

    axios
      .put(
        "/edit-avatar",
        {
          email: props.userEmail,
          avatar: avatar,
        },
        config
      )
      .then(
        (res) => {
          //SaveTheme(whichTheme);
          props.showAlert("Avatar changed!", "success");
          document.querySelector("input[name='avatar']").value = "";
        },
        (error) => {
          props.showAlert("That avatar change didn't work: " + error, "danger");
        }
      );
  }

  return (
    <div className="input-group mb-3 mt-3">
      <input
        type="text"
        className="form-control"
        name="avatar"
        placeholder="Profile Avatar URL"
      />
      <div className="input-group-append">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => changeAvatar()}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default Theme;
