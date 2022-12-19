import { isKnown } from "../common/isKnown";
import { checkIfNeighbors } from "../common/checkIfNeighbors";
import { arraysMatchQ } from "../common/arraysMatchQ";
import { gameInit } from "./gameInit";

export function gameReducer(currentGameState, payload) {
  if (payload.action === "startWord") {
    return {
      ...currentGameState,
      wordInProgress: true,
      playedIndexes: [payload.letterIndex],
    };
  } else if (payload.action === "hint") {
    // If we already gave a hint for that location, return early
    if (currentGameState.hints[payload.clueIndex][payload.boxIndex]) {
      return { ...currentGameState };
    }
    let newHints = JSON.parse(JSON.stringify(currentGameState.hints));
    newHints[payload.clueIndex][payload.boxIndex] = true;

    // If all boxes in the clue have been hinted, that clue is fully solved
    if (newHints[payload.clueIndex].every((i) => i)) {
      let newClueMatches = JSON.parse(
        JSON.stringify(currentGameState.clueMatches)
      );
      newClueMatches[payload.clueIndex] = true;
      return {
        ...currentGameState,
        hints: newHints,
        clueMatches: newClueMatches,
      };
    } else {
      return { ...currentGameState, hints: newHints };
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
      gridSize: Math.sqrt(currentGameState.letters.length),
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
      newPlayedIndexes.length - 1
    );

    return {
      ...currentGameState,
      playedIndexes: newPlayedIndexes,
    };
  } else if (payload.action === "endWord") {
    // check if word is a real word
    const word = currentGameState.playedIndexes
      .map((index) => currentGameState.letters[index])
      .join("");
    const { isWord } = isKnown(word);
    if (!isWord) {
      return {
        ...currentGameState,
        playedIndexes: [],
        wordInProgress: false,
      };
    }

    // check if the word matches a pattern
    const currentColors = currentGameState.playedIndexes.map(
      (index) => currentGameState.colors[index]
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
        (index) => currentGameState.colors[index]
      );
      if (arraysMatchQ(currentColors, comparisonColors)) {
        // If we found a match, indicate that the match is found
        // And also replace the clue letters with the found word
        clueMatches[clueIndex] = true;
        clueIndexes[clueIndex] = currentGameState.playedIndexes;

        // there will only be one match, so exit early if we find one
        break;
      }
    }

    return {
      ...currentGameState,
      playedIndexes: [],
      clueMatches: clueMatches,
      clueIndexes: clueIndexes,
      wordInProgress: false,
    };
  } else if (payload.action === "newGame") {
    return gameInit()
  } else {
    console.log(`unknown action: ${payload.action}`);
    return { ...currentGameState };
  }
}
