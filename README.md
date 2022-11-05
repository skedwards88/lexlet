# Palette

A standalone version of palette from [my other word games](https://skedwards88.github.io/word_games/).

**Players:** 1

**Time:** 5 minutes

[Play Now!](https://skedwards88.github.io/palette/)

<img src="src/images/icon_512.png" alt="game icon" width="70"/>

Do you have feedback or ideas for improvement? [Open an issue](https://github.com/skedwards88/palette/issues/new).

Want more games? Visit [CnS Games](https://skedwards88.github.io/portfolio/).

## Development

To build, run `npm run build`.

To run locally with live reloading and no service worker, run `npm run dev`. (If a service worker was previously registered, you can unregister it in chrome developer tools: `Application` > `Service workers` > `Unregister`.)

To run locally and register the service worker, run `npm start`.

To deploy, run `npm run deploy`.

Despite the duplication and inefficiency, all required components were copied from my core word game repo, [skedwards88/word_games](https://github.com/skedwards88/word_games). Desired changes to game logic or to the word list should be made there and copied to here. Only the 6 letter words are required.
