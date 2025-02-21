import cloneDeep from "lodash.clonedeep";
import {isKnown} from "@skedwards88/word_logic";
import {checkIfNeighbors} from "@skedwards88/word_logic";
import {arraysMatchQ} from "@skedwards88/word_logic";
import {gameInit} from "./gameInit";
import {trie} from "./trie";
import {palette} from "../components/palette";
import {colorsIdenticalQ} from "./colorsIdenticalQ";
import sendAnalytics from "../common/sendAnalytics";

export function gameReducer(currentGameState, payload) {
  if (payload.action === "startWord") {
    return {
      ...currentGameState,
      wordInProgress: true,
      playedIndexes: [payload.letterIndex],
      result: "",
    };
  } else if (payload.action === "hint") {
    // If we already gave a hint for that location, return early
    if (currentGameState.hints[payload.clueIndex][payload.boxIndex]) {
      return {...currentGameState};
    }

    sendAnalytics("hint");

    let newHints = cloneDeep(currentGameState.hints);
    newHints[payload.clueIndex][payload.boxIndex] = true;

    // If all boxes in the clue have been hinted, that clue is fully solved
    if (newHints[payload.clueIndex].every((i) => i)) {
      let newClueMatches = JSON.parse(
        JSON.stringify(currentGameState.clueMatches),
      );
      newClueMatches[payload.clueIndex] = true;

      const num_found = newClueMatches.filter((i) => i).length;
      console.log("found_word");
      sendAnalytics("found_word", {
        num_found: num_found,
      });

      let newStats;
      if (newClueMatches.every((i) => i)) {
        console.log("completed_game");
        sendAnalytics("completed_game");
      }

      return {
        ...currentGameState,
        hints: newHints,
        clueMatches: newClueMatches,
        ...(newStats && {stats: newStats}),
      };
    } else {
      return {...currentGameState, hints: newHints};
    }
  } else if (payload.action === "addLetter") {
    if (!currentGameState.wordInProgress) {
      return currentGameState;
    }
    // Don't add the letter if it isn't neighboring the current sequence
    const isNeighboring = checkIfNeighbors({
      indexA:
        currentGameState.playedIndexes[
          currentGameState.playedIndexes.length - 1
        ],
      indexB: payload.letterIndex,
      numColumns: Math.sqrt(currentGameState.letters.length),
      numRows: Math.sqrt(currentGameState.letters.length),
    });
    if (!isNeighboring) {
      return currentGameState;
    }

    const newPlayedIndexes = [
      ...currentGameState.playedIndexes,
      payload.letterIndex,
    ];

    return {
      ...currentGameState,
      playedIndexes: newPlayedIndexes,
    };
  } else if (payload.action === "removeLetter") {
    if (!currentGameState.wordInProgress) {
      return currentGameState;
    }
    // Don't remove a letter if the player didn't go back to the letter before the last letter
    let newPlayedIndexes = [...currentGameState.playedIndexes];
    const lastIndexPlayed = newPlayedIndexes[newPlayedIndexes.length - 2];
    if (lastIndexPlayed !== payload.letterIndex) {
      return currentGameState;
    }

    newPlayedIndexes = currentGameState.playedIndexes.slice(
      0,
      newPlayedIndexes.length - 1,
    );

    return {
      ...currentGameState,
      playedIndexes: newPlayedIndexes,
    };
  } else if (payload.action === "endWord") {
    // Since we end the word on board up or on app up (in case the user swipes off the board), we can end up calling this case twice.
    // Return early if we no longer have a word in progress.
    if (!currentGameState.playedIndexes.length) {
      return currentGameState;
    }

    // there is a small chance that an update to the word list
    // is pushed after a game is generated for a user
    // so if the word matches one of the clue indexes, consider it valid
    const matchesSolution = currentGameState.clueIndexes.some((indexes) =>
      arraysMatchQ(indexes, currentGameState.playedIndexes),
    );

    // check if word is a real word
    const word = currentGameState.playedIndexes
      .map((index) => currentGameState.letters[index])
      .join("")
      .toUpperCase();
    const {isWord} = isKnown(word, trie);
    if (!isWord && !matchesSolution) {
      return {
        ...currentGameState,
        playedIndexes: [],
        wordInProgress: false,
        result: word.length > 3 ? "Unknown word" : "",
      };
    }

    // check if the word matches a pattern
    let foundPatternMatch = false;
    const currentColors = currentGameState.playedIndexes.map(
      (index) => currentGameState.colors[index],
    );
    let clueMatches = [...currentGameState.clueMatches];
    let clueIndexes = currentGameState.clueIndexes.map((indexes) => [
      ...indexes,
    ]);
    for (
      let clueIndex = 0;
      clueIndex < currentGameState.clueIndexes.length;
      clueIndex++
    ) {
      // go to the next iteration if we already have a match for the clue
      if (clueMatches[clueIndex]) {
        continue;
      }
      const comparisonColors = currentGameState.clueIndexes[clueIndex].map(
        (index) => currentGameState.colors[index],
      );
      if (arraysMatchQ(currentColors, comparisonColors)) {
        // If we found a match, indicate that the match is found
        // And also replace the clue letters with the found word
        clueMatches[clueIndex] = true;
        clueIndexes[clueIndex] = currentGameState.playedIndexes;

        foundPatternMatch = true;

        // there will only be one match, so exit early if we find one
        break;
      }
    }

    // If didn't match a pattern, can return now
    if (!foundPatternMatch) {
      return {
        ...currentGameState,
        playedIndexes: [],
        wordInProgress: false,
        result: "",
      };
    }

    const num_found = clueMatches.filter((i) => i).length;
    console.log("found_match");
    sendAnalytics("found_match", {
      num_found: num_found,
    });

    if (clueMatches.every((i) => i)) {
      console.log("completed_game");
      sendAnalytics("completed_game");
    }

    // Figure out which color was made
    const paletteIndex = palette.findIndex((color) =>
      colorsIdenticalQ(color, currentColors),
    );

    // Figure out if the color has been found before
    const colorIsNew =
      !currentGameState.stats.collectedSwatchIndexes.includes(paletteIndex);

    return {
      ...currentGameState,
      playedIndexes: [],
      clueMatches: clueMatches,
      clueIndexes: clueIndexes,
      wordInProgress: false,
      result: "",
      ...(colorIsNew && {
        stats: {
          ...currentGameState.stats,
          collectedSwatchIndexes: [
            ...currentGameState.stats.collectedSwatchIndexes,
            paletteIndex,
          ],
        },
      }),
      ...(colorIsNew && {
        newSwatchIndexes: [...currentGameState.newSwatchIndexes, paletteIndex],
      }),
    };
  } else if (payload.action === "newGame") {
    return gameInit();
  } else {
    console.log(`unknown action: ${payload.action}`);
    return {...currentGameState};
  }
}
