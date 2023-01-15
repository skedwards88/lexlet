import React from "react";

export default function WhatsNew({ setDisplay, setSawWhatsNew }) {
  return (
    <div className="App whatsNew">
      <h1 id="whatsNewHeader">{"What's New"}</h1>
      <p id="whatsNewText">{`The puzzle will get progressively harder over the week.\n\nMonday will start you off with shorter words, and Sunday will challenge you with longer words.\n\nCan you beat every day?`}</p>
      <button
        id="whatsNewClose"
        className="close"
        onClick={() => {
          setSawWhatsNew(true);
          setDisplay("game");
        }}
      >
        {"Close"}
      </button>
    </div>
  );
}
