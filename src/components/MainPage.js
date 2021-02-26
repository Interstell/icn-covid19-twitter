import React, { useState } from "react";
import classnames from "classnames";

function Tab({ name, isActive, onClick }) {
  return (
    <li className={classnames(isActive && "is-active")}>
      <a onClick={() => onClick(name)}>{name}</a>
    </li>
  );
}

export default function MainPage() {
  return (
    <React.Fragment>
      <div className="content is-size-4">
        <div className="main-page-img-block">
          <img src="https://cdn-images-1.medium.com/max/1600/0*VnowcjVS5IbUXeV8.jpeg" />
        </div>
        <p>
          This project is a part of the Introduction to
          Computational Neuroscience course at the University of Tartu.
        </p>
        <p>
          You can find the full Medium article describing our experiments and
          insights{" "}
          <a href="#">
            here
          </a>
          .
        </p>
        <p>The plots can be accessed from the menu on the left.</p>
      </div>
    </React.Fragment>
  );
}
