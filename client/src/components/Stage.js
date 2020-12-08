import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";
import timestamp from "./timestamp";
import uuid from "./uuid";

const Stage = (props) => {
  let [loaded, setLoaded] = useState(false);
  let [originalConvos, setOriginalConvos] = useState(null);
  let [conversation, setConversation] = useState(null);
  let [contactList, setContactList] = useState([]);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };

  //VALIDATE MESSAGE FOR SCHEMA
  const Validate = (fields) => {
    if (document.querySelectorAll(".error"))
      [].forEach.call(document.querySelectorAll(".error"), function (e) {
        e.classList.remove("error");
      });

    for (let i = 0; i < fields.length; i++) {
      var value = "";
      var element = document.querySelector("[name='" + fields[i] + "']");
      try {
        value = element.value;
      } catch (error) {
        value = "";
      }

      if (value === "") {
        document
          .querySelector("[name='" + fields[i] + "']")
          .classList.add("error");
        props.showAlert(
          "danger",
          "Please, fill out the " + fields[i] + " field correctly."
        );
      } else {
        document
          .querySelector("[name='" + fields[i] + "']")
          .classList.remove("error");
      }

      if (fields[i].indexOf("email") !== -1) {
        const email = document.querySelector("[name='" + fields[i] + "']")
          .value;
        var atpos = email.indexOf("@");
        var dotpos = email.lastIndexOf(".");
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= email.length) {
          document
            .querySelector("[name='" + fields[i] + "']")
            .classList.add("error");

          props.showAlert("danger", "Email format please ( xx@xx.xx ).");
        } else {
          document
            .querySelector("input[name='" + fields[i] + "']")
            .classList.remove("error");
        }
      }
    }

    if (document.querySelector(".error")) {
      return false;
    }
  };

  // SELECT POST
  function selectPost(whichPost, initiator, recipient) {
    if (props.userEmail !== recipient) {
      document.querySelector("input[name='email']").value = recipient;
    }
    if (props.userEmail !== initiator) {
      document.querySelector("input[name='email']").value = initiator;
    }
    whichPost = whichPost.toString();
    const post = document.querySelector(
      ".list-group-item[data-post='" + whichPost + "']"
    );
    const ckMark = document.querySelector(
      "div[data-post='" + whichPost + "'] .fa-check-circle"
    );
    if (
      document.querySelector(
        ".active.list-group-item[data-post='" + whichPost + "']"
      )
    ) {
      post.classList.remove("active");
      ckMark.classList.remove("fas");
      ckMark.classList.add("far");
      document.querySelector(
        "input[value='" + whichPost + "']"
      ).checked = false;
    } else {
      post.classList.add("active");
      ckMark.classList.remove("far");
      ckMark.classList.add("fas");
      document.querySelector(
        "div[data-post='" + whichPost + "'] .fa-check-circle"
      );
      document.querySelector("input[value='" + whichPost + "']").checked = true;
    }
  }

  //CLIENT SIDE GET DATA
  function runConvo() {
    fetch("api/messages/" + props.userEmail)
      .then((res) => res.json())
      .then((response) => {
        setConversation((conversation) => response);
        setOriginalConvos((originalConvos) => response);

        let tempContacts = [];
        for (let i = 0; i < response.length; i++) {
          const initiator = response[i].initiator.replace("-viewed", "");
          const recipient = response[i].recipient.replace("-viewed", "");
          if (
            initiator !== props.userEmail &&
            tempContacts.indexOf(initiator) === -1
          ) {
            tempContacts.push(initiator);
          }
          if (
            recipient !== props.userEmail &&
            tempContacts.indexOf(recipient) === -1
          ) {
            tempContacts.push(recipient);
          }
        }

        setContactList((contactList) => tempContacts);
      });
  }

  //POST MESSAGE
  function postData(data) {
    axios.post("/api/messages/post-message", data, config).then(
      (res) => {
        runConvo();
      },
      (error) => {
        console.log(error);
        props.showAlert("That didn't work: " + error, "danger");
      }
    );
  }

  //BUILD MESSAGE OBJECT
  function sendMessage() {
    Validate(["email", "message"]);
    let message = "";
    if (document.querySelector(".error")) {
      props.showAlert(
        "Both email and message fields must be filled out.",
        "danger"
      );
      return false;
    } else {
      message = document.getElementById("message").value;
      message = message.replace(/'/g, "&#39;").replace(/’/g, "&#39;");

      postData({
        avatar: props.avatar,
        initiator: props.userEmail,
        message,
        recipient: document.querySelector("input[name='email']").value,
        timestamp: timestamp(),
        uuid: uuid(),
      });
      document.getElementById("message").value = "";
    }
  }

  //CLEAR SELECTED MESSAGES
  function clearConvo() {
    let selectedIds = [];
    let tempConversation = [];
    [].forEach.call(
      document.querySelectorAll("input[name='message']"),
      function (e) {
        if (e.checked === true) {
          console.log("e.value: " + e.value);
          selectedIds.push(e.value);
        }
      }
    );

    for (let i = 0; i < conversation.length; i++) {
      if (selectedIds.indexOf(conversation[i].uuid) !== -1) {
        let initiator = conversation[i].initiator;
        if (props.userEmail === initiator) {
          initiator = props.userEmail + "-viewed";
        }

        let recipient = conversation[i].recipient;
        if (props.userEmail === recipient) {
          recipient = props.userEmail + "-viewed";
        }

        const editedData = {
          initiator,
          recipient,
          uuid: conversation[i].uuid,
        };

        if (
          initiator.indexOf("-viewed") !== -1 &&
          recipient.indexOf("-viewed") !== -1
        ) {
          axios
            .delete(
              "/api/messages/remove-message/" + conversation[i].uuid,
              config
            )
            .then(
              (res) => {
                runConvo();
              },
              (error) => {
                console.log(error);
                props.showAlert("That didn't work: " + error, "danger");
              }
            );
        } else {
          console.log(
            "JSON.stringify(editedData): " + JSON.stringify(editedData)
          );

          axios.put("/api/messages/viewed", editedData, config).then(
            (res) => {
              runConvo();
            },
            (error) => {
              console.log(error);
              props.showAlert("That didn't work: " + error, "danger");
            }
          );
        }
      }
    }
    setConversation((conversation) => []);
  }

  const filterContacts = () => {
    const viewContact = document.getElementById("activeContacts").value;

    let tempList = [];

    if (viewContact === "default") {
      for (let i = 0; i < originalConvos.length; i++) {
        tempList.push(originalConvos[i]);
      }
      setConversation((conversation) => tempList);
    } else {
      document.querySelector("input[name='email']").value = viewContact.replace(
        "-viewed",
        ""
      );
      for (let i = 0; i < originalConvos.length; i++) {
        const initiator = originalConvos[i].initiator.replace("-viewed", "");
        const recipient = originalConvos[i].recipient.replace("-viewed", "");
        if (viewContact === initiator || viewContact === recipient) {
          tempList.push(originalConvos[i]);
        }
      }
    }
    setConversation((conversation) => tempList);
  };

  useEffect(() => {
    if (loaded === false && props.userEmail !== null) {
      runConvo();
      setLoaded((loaded) => true);
    }

    const interval = setInterval(() => runConvo(), 10000);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-6 p-0">
          <input
            type="text"
            className="form-control"
            name="email"
            placeholder="contact email"
          />
        </div>
        <div className="col-6  p-0">
          <select
            className="form-control"
            id="activeContacts"
            onChange={() => filterContacts()}
          >
            <option value="default">All Contacts</option>
            {contactList
              ? contactList.map((contact, i) => {
                  return (
                    <option value={contact} key={i}>
                      {contact}
                    </option>
                  );
                })
              : null}
          </select>
        </div>
        <div className="col-md-12 list-group p-0" id="stage">
          {conversation
            ? conversation.map((convo, i) => {
                return (
                  <div
                    key={i}
                    className="list-group-item-action  pointer list-group-item"
                    onClick={() =>
                      selectPost(
                        convo.uuid,
                        convo.initiator.replace("-viewed", ""),
                        convo.recipient.replace("-viewed", "")
                      )
                    }
                    data-post={convo.uuid}
                  >
                    <div className="d-flex flex-nowrap justify-content-between">
                      <div className="order-md-1 pr-2">
                        <img className="avatarIcon" src={convo.avatar} />
                      </div>
                      <div className="order-md-2">
                        <ul className="list-unstyled">
                          <li>
                            {"From: " +
                              convo.initiator +
                              ": " +
                              ReactHtmlParser(convo.message)}
                          </li>
                          <li>
                            {" "}
                            <small>
                              <i>
                                {"To: " +
                                  convo.recipient.replace("-viewed", "") +
                                  ":" +
                                  convo.timestamp}
                              </i>
                            </small>
                          </li>
                        </ul>
                      </div>
                      <div className="order-md-3">
                        <h4>
                          <input
                            type="checkbox"
                            name="message"
                            className="hide"
                            value={convo.uuid}
                          />{" "}
                          <i className="far fa-check-circle"></i>
                        </h4>
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
        </div>

        <div
          className="btn-group form-control"
          role="group"
          aria-label="Control Panel"
        >
          <button
            type="button"
            className="btn btn-success"
            onClick={() => sendMessage()}
          >
            Send Message
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => clearConvo()}
          >
            Clear Selected
          </button>
        </div>
        <hr />
        <textarea
          id="message"
          name="message"
          className="form-control"
        ></textarea>
      </div>
    </div>
  );
};

export default Stage;
