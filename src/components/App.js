import React from "react";
import Palette from "./Palette";
import Heart from "./Heart";
import Rules from "./Rules";

export default function App() {
  const [display, setDisplay] = React.useState("game");

  switch (display) {
    case "game":
      return <Palette setDisplay={setDisplay}></Palette>;

    case "rules":
      return <Rules setDisplay={setDisplay}></Rules>

    case "heart":
      return <Heart setDisplay={setDisplay}></Heart>

    default:
      return <Palette setDisplay={setDisplay}></Palette>;
  }
}
