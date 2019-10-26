const TRICKS = [
  "run down the street naked",
  "do a poo in the bin",
  "eat a banana from the floor with no hands"
];
const TREATS = [
  "heres £30 aws credits",
  "ive ordered you an ice cream sundae",
  "free amazon prime for a year!"
];

function initTrickOrTreat() {
  return { tricks: TRICKS, treats: TREATS }
}

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
  getTrickOrTreat, initTrickOrTreat
};
