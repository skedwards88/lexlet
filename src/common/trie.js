import commonWords from "./wordLists/compiled/commonWords.json";
import uncommonWords from "./wordLists/compiled/uncommonWords.json";

export function getTrie() {
  let trie = {};
  for (let word of uncommonWords) {
    let current = trie;
    for (let letter of word) {
      if (!current[letter]) {
        current[letter] = {};
      }
      current = current[letter];
    }
    current["endOfWord"] = true;
  }

  for (let word of commonWords) {
    let current = trie;
    for (let letter of word) {
      if (!current[letter]) {
        current[letter] = {};
      }
      current = current[letter];
    }
    current["endOfWord"] = true;
    current["easyWord"] = true;
  }

  return trie;
}

export const trie = getTrie();
