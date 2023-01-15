# Palette

A standalone, daily version of palette from [my other word games](https://skedwards88.github.io/word_games/).

**Players:** 1

**Time:** 5 minutes

[Play Now!](https://palettegame.com/)

<img src="src/images/icon_512.png" alt="game icon" width="70"/>

Do you have feedback or ideas for improvement? [Open an issue](https://github.com/skedwards88/palette/issues/new).

Want more games? Visit [CnS Games](https://skedwards88.github.io/portfolio/).

## Development

To build, run `npm run build`.

To run locally with live reloading and no service worker, run `npm run dev`. (If a service worker was previously registered, you can unregister it in chrome developer tools: `Application` > `Service workers` > `Unregister`.)

To run locally and register the service worker, run `npm start`.

To deploy, push to `main` or manually trigger the GitHub Actions `deploy.yml` workflow.

Despite the duplication and inefficiency, all required components were copied from my core word game repo, [skedwards88/word_games](https://github.com/skedwards88/word_games). Desired changes to game logic or to the word list should be made there and copied to here. Only the 6 letter words are required.

The game cache was made by executing a function like this in the palette gameInit logic in my core word game repo. To reduce file size, the color names were replaced with a representative letter.

```js
function getNWeeksOfGames(numWeeks) {
  const days = [
    [4,4],
    [4,5],
    [4,6],
    [5,6],
    [5,6],
    [6,6],
    [6,7]
  ]
  let games = []
  for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const game = getPlayableBoard({
        gridSize: 4,
        minWordLength: days[dayIndex][0],
        maxWordLength: days[dayIndex][1],
        easyMode: true,
        numClues: 5,
      })
      games = [...games, game]
    }
  }
  return games
}

const output = getNWeeksOfGames(52)

let solutions = ""
for (let gameIndex = 0; gameIndex < output.length; gameIndex++) {
  solutions += `\n\n${gameIndex}`
    let [letters, colors, clues] = output[gameIndex]
    for (let clueIndex = 0; clueIndex < clues.length; clueIndex++) {
        let word = clues[clueIndex].map((index) => letters[index]).join("")
        solutions += `\n${word}`
    }
}

console.log(output)
console.log(solutions)
```
