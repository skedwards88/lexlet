import React from "react";

export default function WhatsNew({ setDisplay, setSawWhatsNew20230101 }) {
  return (
    <div className="App whatsNew">
      <h1 id="whatsNewHeader">{"What's New"}</h1>
      <p id="whatsNewText">{`The puzzle will start you off with extra hints on Monday and then get progressively harder over the week.\n\n Can you beat every day?`}</p>
      <button
        id="whatsNewClose"
        className="close"
        onClick={() => {
          setSawWhatsNew20230101(true);
          setDisplay("game");
        }}
      >
        {"Close"}
      </button>
    </div>
  );
}
