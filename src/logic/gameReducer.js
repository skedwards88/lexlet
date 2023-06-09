import { isKnown } from "../common/isKnown";
import { checkIfNeighbors } from "../common/checkIfNeighbors";
import { arraysMatchQ } from "../common/arraysMatchQ";
import { gameInit } from "./gameInit";

function isYesterday(timestamp) {
  const milliSecPerDay = 24 * 60 * 60 * 1000;
  const yesterday = new Date(Date.now() - milliSecPerDay);
  const dateFromTimestamp = new Date(timestamp);

  return (
    dateFromTimestamp.getDate() === yesterday.getDate() &&
    dateFromTimestamp.getMonth() === yesterday.getMonth() &&
    dateFromTimestamp.getFullYear() === yesterday.getFullYear()
  );
}

function getNewStats(currentGameState) {
  // update stats
  const today = new Date();
  const lastDateWon = currentGameState.stats.lastDateWon;
  const wonYesterday = isYesterday(lastDateWon);

  // If won yesterday, add 1 to the streak
  // Otherwise, reset the streak to 1
  const newStreak = wonYesterday ? currentGameState.stats.streak + 1 : 1;

  const newMaxStreak = Math.max(newStreak, currentGameState.stats.maxStreak);

  // If didn't use any hints today, increment number of wins in the streak without hints
  const hintsUsedToday = currentGameState.hints
    .flatMap((i) => i)
    .some((i) => i);
  const prevNumHintlessInStreak = wonYesterday
    ? currentGameState.stats.numHintlessInStreak
    : 0;
  const newNumHintlessInStreak = hintsUsedToday
    ? prevNumHintlessInStreak
    : prevNumHintlessInStreak + 1;

  // Tally the number of hints used in the streak
  const prevNumHintsInStreak = wonYesterday
    ? currentGameState.stats.numHintsInStreak
    : 0;
  const newNumHintsInStreak = prevNumHintsInStreak + hintsUsedToday;

  // Update the number of games won for this weekday
  const dayNumber = today.getDay();

  const numWeekdayWon = currentGameState.stats.days[dayNumber].won + 1;

  const numWeekdayWonWithoutHints = hintsUsedToday
    ? currentGameState.stats.days[dayNumber].noHints
    : currentGameState.stats.days[dayNumber].noHints + 1;

  const newDays = {
    ...currentGameState.stats.days,
    [dayNumber]: { won: numWeekdayWon, noHints: numWeekdayWonWithoutHints },
  };

  return {
    ...currentGameState.stats,
    lastDateWon: today,
    streak: newStreak,
    maxStreak: newMaxStreak,
    numHintlessInStreak: newNumHintlessInStreak,
    numHintsInStreak: newNumHintsInStreak,
    days: newDays,
  };
}

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

    try {
      console.log("hint");
      window.gtag("event", "hint", {});
    } catch (error) {
      console.log("tracking error", error);
    }

    let newHints = JSON.parse(JSON.stringify(currentGameState.hints));
    newHints[payload.clueIndex][payload.boxIndex] = true;

    // If all boxes in the clue have been hinted, that clue is fully solved
    if (newHints[payload.clueIndex].every((i) => i)) {
      let newClueMatches = JSON.parse(
        JSON.stringify(currentGameState.clueMatches)
      );
      newClueMatches[payload.clueIndex] = true;

      try {
        const num_found = newClueMatches.filter((i) => i).length;
        console.log("found_word");
        window.gtag("event", "found_word", {
          num_found: num_found,
        });
      } catch (error) {
        console.log("tracking error", error);
      }

      let newStats;
      if (newClueMatches.every((i) => i)) {
        console.log("completed_game");
        newStats = getNewStats(currentGameState);
        try {
          window.gtag("event", "completed_game", {});
        } catch (error) {
          console.log("tracking error", error);
        }
      }

      return {
        ...currentGameState,
        hints: newHints,
        clueMatches: newClueMatches,
        ...(newStats && { stats: newStats }),
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

    try {
      const num_found = clueMatches.filter((i) => i).length;
      console.log("found_word");
      window.gtag("event", "found_word", {
        num_found: num_found,
      });
    } catch (error) {
      console.log("tracking error", error);
    }

    let newStats;
    if (clueMatches.every((i) => i)) {
      console.log("completed_game");
      newStats = getNewStats(currentGameState);
      try {
        window.gtag("event", "completed_game", {});
      } catch (error) {
        console.log("tracking error", error);
      }
    }

    return {
      ...currentGameState,
      playedIndexes: [],
      clueMatches: clueMatches,
      clueIndexes: clueIndexes,
      wordInProgress: false,
      ...(newStats && { stats: newStats }),
    };
  } else if (payload.action === "newGame") {
    return gameInit();
  } else {
    console.log(`unknown action: ${payload.action}`);
    return { ...currentGameState };
  }
}
