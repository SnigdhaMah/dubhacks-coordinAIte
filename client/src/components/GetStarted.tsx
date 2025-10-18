import React from "react";
import "./GetStarted.css";

type GetStartedProps = {
  goToNextPage: () => void;
};

export default function GetStarted({ goToNextPage }: GetStartedProps) {
  return (
    <div className="get-started-container">
      <img
        src={require("../img/get-started-bg.png")}
        alt="Background"
        className="get-started-bg"
      />
      <button
        className="get-started-btn"
        onClick={goToNextPage}
        style={{
          backgroundImage: `url(${require("../img/get-started-button.png")})`,
        }}
      >
        Start
      </button>
    </div>
  );
}
