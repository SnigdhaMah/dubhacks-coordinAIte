import React from "react";

type GetStartedProps = {
  goToNextPage: () => void;
};

export default function GetStarted({ goToNextPage }: GetStartedProps) {
  return (
    <div className="get-started-container">
      {/* Background image - replace with your actual image path */}
      <div
        className="get-started-bg"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/736x/39/3d/97/393d97e8792a0538413b7246c0e514b0.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: "100vh",
          position: "relative",
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="overlay"></div>

        {/* Content */}
        <div className="content-container">
          <h1 className="welcome-text">Welcome to Coordin-ai-te</h1>
          <button className="get-started-btn" onClick={goToNextPage}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
