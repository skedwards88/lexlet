import React from "react";

export default function WhatsNew({setDisplay, setSawWhatsNew}) {
  return (
    <div className="App whatsNew">
      <h1 id="whatsNewHeader">{"What's New"}</h1>
      <p id="whatsNewText">
        {`Same game, new name: The app is now called Lexlet!`}
        {`\n\n`}
        {`Find it at `}
        <a href="https://lexlet.com/">lexlet.com</a>
        {` or `}
        <a href="https://play.google.com/store/apps/details?id=com.palettegame.twa">
          on the Google Play Store
        </a>
        {"."}
      </p>
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
