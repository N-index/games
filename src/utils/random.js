function getRandomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloatBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
export { getRandomIntBetween, getRandomFloatBetween, getRandomDate };
