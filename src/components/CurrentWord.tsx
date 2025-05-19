import type {Letter, PrimaryColor} from "../Types";

export default function CurrentWord({
  letters,
  colors,
}: {
  letters: Letter[];
  colors: PrimaryColor[];
}): React.JSX.Element {
  const blocks = letters.map((letter, index) => (
    <div key={index} className={`guessBox ${colors[index]}`}>
      {letter.toUpperCase()}
    </div>
  ));

  return <div id="currentWord">{blocks}</div>;
}
