import React from "react";

export default function WhatsNew({ setDisplay, setSawWhatsNew }) {
  return (
    <div className="App whatsNew">
      <h1 id="whatsNewHeader">{"What's New"}</h1>
      <p id="whatsNewText">{`You can now view your stats!\n\nStats are saved locally on your browser/device.\n\nStats do not include data before today.`}</p>
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
