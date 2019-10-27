function getTrickOrTreat(tricks, treats) {
  const num = Math.random();

  if (num > 0.5) {
    return {
      value: getRandomTrick(tricks),
      type: "trick"
    };
  }
  if (num < 0.5) {
    return {
      value: getRandomTreat(treats),
      type: "treat"
    }
  }
}

function getRandomTrick(tricks) {
  return tricks[Math.floor(Math.random() * tricks.length)];
}

function getRandomTreat(treats) {
  return treats[Math.floor(Math.random() * treats.length)];
}

module.exports = {
  getTrickOrTreat
};
