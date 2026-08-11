import {type LetterQu} from "@skedwards88/word_logic/dist/Types";
import type {Color} from "../logic/gameInit";

export default function CurrentWord({
  letters,
  colors,
}: {
  letters: LetterQu[];
  colors: Color[];
}): React.JSX.Element {
  const blocks = letters.map((letter, index) => (
    <div key={index} className={`guessBox ${colors[index]}`}>
      {letter.toUpperCase()}
    </div>
  ));

  return <div id="currentWord">{blocks}</div>;
}
