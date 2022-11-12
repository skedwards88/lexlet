import React from "react";
import Palette from "./Palette";
import Heart from "./Heart";
import Rules from "./Rules";

export default function App() {
  const [display, setDisplay] = React.useState("game");
  
  const savedState = JSON.parse(localStorage.getItem("dailyPaletteIsFirstGame"));
  const [isFirstGame, setIsFirstGame] = React.useState(savedState ?? true)
  
  React.useEffect(() => {
    window.localStorage.setItem("dailyPaletteIsFirstGame", JSON.stringify(isFirstGame));
  }, [isFirstGame]);

  if (isFirstGame) {
    return <Rules setDisplay={setDisplay} isFirstGame={isFirstGame} setIsFirstGame={setIsFirstGame}></Rules>;
  }

  switch (display) {
    case "game":
      return <Palette setDisplay={setDisplay}></Palette>;

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>;

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>;

    default:
      return <Palette setDisplay={setDisplay}></Palette>;
  }
}
