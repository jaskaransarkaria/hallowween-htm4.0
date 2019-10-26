function getTrickOrTreat() {
  const num = Math.random();

  if (num > 0.5) {
    return "Trick!! " + getRandomTrick();
  }
  if (num < 0.5) {
    return "Treat!! " + getRandomTreat();
  }
}

function getRandomTrick() {
  const tricks = [
    "run down the street naked",
    "do a poo in the bin",
    "eat a banana from the floor with no hands"
  ];

  return tricks[Math.floor(Math.random() * tricks.length)];
}

function getRandomTreat() {
  const treats = [
    "heres £30 aws credits",
    "ive ordered you an ice cream sunday",
    "free amazon prime for a year!"
  ];

  return tricks[Math.floor(Math.random() * tricks.length)];
}

module.exports = {
  getTrickOrTreat
};
