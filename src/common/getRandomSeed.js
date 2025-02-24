export default function getRandomSeed() {
  // Gets a seed based on the current time, which
  // should effectively give the impression of a
  // "random" game each time a new game is generated based on the seed
  const currentDate = new Date();
  return currentDate.getTime().toString();
}
