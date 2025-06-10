export function computeStars(
  onGoal: boolean,
  collectedCoins: number,
  totalCoins: number,
  commandCount: number,
  maxStep: number,
): number {
  let stars = 0;

  // +1 if collected all coins
  if (collectedCoins >= totalCoins) {
    console.log("Check coins");

    stars++;
  }
  // +1 if used no more than maxStep commands
  if (commandCount <= maxStep) {
    console.log("Check step");
    stars++;
  }

  if (onGoal) {
    console.log("Check onGoal");
    stars++;
  } else {
    stars = 0;
  }
  return stars;
}
