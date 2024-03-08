import {getLetterPool} from "@skedwards88/word_logic";
import {
  commonWordsLen4,
  commonWordsLen5,
  commonWordsLen6,
  commonWordsLen7,
} from "@skedwards88/word_lists";

export const letterPool = getLetterPool([
  ...commonWordsLen4,
  ...commonWordsLen5,
  ...commonWordsLen6,
  ...commonWordsLen7,
]);
