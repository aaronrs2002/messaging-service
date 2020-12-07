import React, { useState, useEffect } from "react";
import Validate from "./Validate";

const Login = (props) => {
  //let [newUser, setUserType] = useState(false);

  const onHandleChange = (e) => {
    if (document.querySelector("button.ckValidate.hide")) {
      document.querySelector("button.ckValidate").classList.remove("hide");
    }

    if (props.newUser === false) {
      Validate(["email", "password"]);
    } else {
      Validate(["email", "password1", "password2"]);
    }
  };

  function ckNewPassword() {
    onHandleChange();
    const pass1 = document.querySelector("input[name='password1']").value;
    let pass2 = "";
    if (document.querySelector("input[name='password2']").value) {
      pass2 = document.querySelector("input[name='password2']").value;
    }
    if (pass1 === pass2) {
      document.querySelector("button[name='newUser']").disabled = false;
    } else {
      document.querySelector("button[name='newUser']").disabled = true;
    }
  }

  return (
    <div className="col-md-12">
      <div className="loginForm">
        {props.newUser === false ? (
          <React.Fragment>
            <h2>Sign in</h2>
            <form onSubmit={props.login}>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="Email"
                maxLength="255"
                onChange={onHandleChange}
              />
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="password"
                maxLength="50"
                onChange={onHandleChange}
              />
              <button
                type="submit"
                className="btn btn-block btn-success ckValidate hide"
              >
                Login
              </button>
            </form>
            <small>
              <a href="#" onClick={() => props.setUserType(true)}>
                Don't have an account? Click here.
              </a>
            </small>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h2>Create Account</h2>
            <form onSubmit={props.createUser}>
              <input
                type="text"
                className="form-control"
                name="email"
                placeholder="Email"
                maxLength="255"
                onChange={onHandleChange}
              />
              <input
                type="password"
                className="form-control"
                name="password1"
                placeholder="password"
                maxLength="50"
                onChange={ckNewPassword}
              />
              <input
                type="password"
                className="form-control"
                name="password2"
                placeholder="password"
                maxLength="50"
                onChange={ckNewPassword}
              />
              <button
                className="btn btn-block btn-success ckValidate hide"
                name="newUser"
              >
                Create User
              </button>
            </form>
            <i>
              <a href="#" onClick={() => props.setUserType(false)}>
                Already have an account
              </a>
            </i>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default Login;
