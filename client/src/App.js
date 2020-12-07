import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./components/Login";
import DeleteUser from "./components/DeleteUser";
import Theme from "./components/Theme";
import ChangePassword from "./components/ChangePassword";
import uuid from "./components/uuid";
import SaveTheme from "./components/SaveTheme";
import Stage from "./components/Stage";
import Nav from "./components/Nav";
import sizeAdjust from "./components/sizeAdjust";
import Avatar from "./components/Avatar";

function App() {
  let [userEmail, setEmail] = useState(null);
  let [newUser, setUserType] = useState(false);
  let [isValidUser, setValidUser] = useState(false);
  let [token, setToken] = useState("");
  let [alert, setAlert] = useState("default");
  let [alertType, setAlertType] = useState("danger");
  let [checkedToken, setTokenCk] = useState(false);
  let [infoMessage, toggleInfo] = useState("");
  let [avatar, setAvatar] = useState("");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  const showAlert = (theMessage, theType) => {
    setAlertType((alertType) => theType);
    setAlert((alert) => theMessage);
    setTimeout(() => {
      setAlert((alert) => "default");
    }, 5000);
  };

  //START VALIDATE USER
  const validateUser = (success, token, email, msg) => {
    if (success === 1) {
      setValidUser((isValidUser) => true);
      setToken((token) => token);
      sessionStorage.setItem("token", token);
      setTokenCk((checkedToken) => true);
      setEmail((userEmail) => email);
      sessionStorage.setItem("email", email);
      axios.get("/theme/" + email).then(
        (res) => {
          if (res.data[0].theme) {
            SaveTheme(res.data[0].theme);
            sizeAdjust();
          } else {
            SaveTheme("css/bootstrap.min.css");
          }
        },
        (error) => {
          console.log(error);
        }
      );
      //  client side view avatar
      axios.get("/avatar/" + email).then(
        (res) => {
          if (res.data[0].avatar) {
            setAvatar((avatar) => res.data[0].avatar);
          } else {
            setAvatar("img/profileImg.jpg");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      setValidUser((isValidUser) => false);
      setToken((token) => token);
      setEmail((userEmail) => null);
      showAlert("That didn't work: " + msg, "danger");
    }
  };
  ///END VALIDATE USER

  //START CREATE USER
  const createUser = (event) => {
    event.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password1']").value;

    axios
      .post(
        "/newUser",
        { theme: "css/bootstrap.min.css", email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(
        (res) => {
          showAlert("User created succussfully!", "success");
          setUserType((newUser) => false);
          document.querySelector("button.ckValidate").classList.remove("hide");
        },
        (error) => {
          showAlert("That didn't work: " + error, "danger");
        }
      );
  };
  //END CREATE USER

  //START LOGIN
  const login = (event) => {
    event.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const password = document.querySelector("input[name='password']").value;

    if (!email || !password) {
      showAlert("Not one character?", "danger");
      return false;
    }

    axios
      .post(
        "/login",
        { email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(
        (res) => {
          if (userEmail !== email) {
            setEmail((userEmail) => email);
          }
          validateUser(res.data.success, res.data.token, email, res.data.data);
        },
        (error) => {
          showAlert("That didn't work: " + error, "danger");
        }
      );
  };
  //END LOGIN

  //START LOG OUT
  const logout = () => {
    setValidUser((isValidUser) => false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("email");

    axios
      .put("/logout-uuid/", {
        email: userEmail,
        uuid: "logged-out: " + uuid(),
      })
      .then(
        (res) => {
          console.log("res from logout: " + res);
        },
        (error) => {
          showAlert(
            "Something happened while logging out: : " + error,
            "danger"
          );
        }
      );
  };
  //END LOG OUT

  //START REFRESH
  useEffect(() => {
    console.log("checkedToken: " + checkedToken);
    if (sessionStorage.getItem("token") && checkedToken === false) {
      axios.get("/check-token/" + sessionStorage.getItem("email"), config).then(
        (res) => {
          try {
            if (sessionStorage.getItem("token") === res.data[0].token) {
              validateUser(
                1,
                res.data[0].token,
                sessionStorage.getItem("email"),
                "token success"
              );
            }
          } catch (error) {
            console.error(error);
            return false;
          }
        },
        (error) => {
          showAlert("That token-request didn't work: " + error, "danger");
          logout();
        }
      );
    }
  });
  //END REFRESH

  return (
    <React.Fragment>
      {isValidUser === true ? null : (
        <Login
          login={login}
          createUser={createUser}
          setUserType={setUserType}
          newUser={newUser}
        />
      )}
      <main>
        {" "}
        {alert !== "default" ? (
          <div
            className={"alert alert-" + alertType + " animated fadeInDown"}
            role="alert"
            id="showAlert"
          >
            {alert}
          </div>
        ) : null}
        <div className={isValidUser !== false ? "container" : "container"}>
          {isValidUser === true ? (
            <Stage
              showAlert={showAlert}
              userEmail={userEmail}
              avatar={avatar}
            />
          ) : null}
        </div>
      </main>
      {isValidUser === true ? (
        <footer className="footer mt-auto py-3 px-3 bg-dark text-muted">
          <div className="d-flex justify-content-between">
            <div>
              {infoMessage === "account-settings" ? (
                <a
                  href="#settingsPanel"
                  className="btn btn-secondary mobileToggle"
                  onClick={() => toggleInfo((infoMessage) => "")}
                >
                  {userEmail} <i className="fas fa-cog"></i>
                </a>
              ) : (
                <a
                  href="#settingsPanel"
                  className="btn btn-secondary mobileToggle"
                  onClick={() =>
                    toggleInfo((infoMessage) => "account-settings")
                  }
                >
                  {userEmail} <i className="fas fa-cog"></i>
                </a>
              )}
              {infoMessage === "account-settings" ? (
                <div id="settingsPanel" className="py-2">
                  <label>Settings:</label>
                  <ul className="noStyle">
                    <li>
                      {" "}
                      <Theme userEmail={userEmail} showAlert={showAlert} />
                    </li>
                    <li>
                      <Avatar userEmail={userEmail} showAlert={showAlert} />
                    </li>
                    <li>
                      <ChangePassword showAlert={showAlert} />
                    </li>
                    <li>
                      <DeleteUser
                        userEmail={userEmail}
                        logout={logout}
                        showAlert={showAlert}
                        infoMessage={infoMessage}
                      />
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>

            <div>
              <button
                className="btn mobileToggle btn-danger float-right"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </footer>
      ) : null}{" "}
    </React.Fragment>
  );
}

export default App;
