import React, { useState, useEffect } from "react";

const Nav = () => {
  return (
    <nav className="navbar-expand-md navbar-dark bg-dark fixed-top shadow-sm">
      <div className="d-flex bd-highlight">
        <div className="p-2 bd-highlight">
          {" "}
          <img
            src="https://www.mechanized-aesthetics.net/MA-2015/img/MA_Logo.png"
            className="img-fluid logo"
          />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
