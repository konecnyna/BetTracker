const picks = new (require("./pick"))();
const Verify = require("./verify");
const GA = require("./generic-algo");
const Chromosome = require("./generic-algo/chromosome");

getPicks = async () => {
  const week1 = await picks.getPicks(1, false);
  // const week1 = { games: [] };
  const week2 = await picks.getPicks(2, false);
  const allGames = week2.games.concat(week1.games);
  week2.games = allGames.filter(it => it.result.coveringTeam);
  return week2;
};

main = async () => {
  const completed = await getPicks();
  const generations = 1000;
  // This must be < 1 and > 0
  const mutationSize = 0.17;
  const ga = new GA(completed, generations, mutationSize);
  const algo = await ga.start();
};

predictWeek = async week => {
  const test = await picks.getPicks(2);
  test.games = test.games.filter(it => !it.result.coveringTeam);
  const model = [
    15.635000000000007,
    -76.48499999999987,
    49.47499999999993,
    -1.2850000000000006,
    -52.51499999999992,
    76.73499999999987,
    11.405000000000001,
    -21.964999999999996
  ];

  const verify = new Verify(test, true);
  verify.verifyModel(new Chromosome(model));
};

complete = async () => {
  // I think just a prime number.
  let mutationSize = 0.47;
  const completed = await getPicks();
  const generations = 1;
  const ga = new GA(completed, generations, mutationSize);
  const algo = await ga.start();
  const verify = new Verify(completed, true);
  verify.verifyModel(algo.best().chromosome);
};

const args = process.argv.slice(2);
switch (args[0]) {
  case "predict":
    predictWeek(args[1]);
    break;
  case "complete":
    complete();
    break;
  default:
    main();
    break;
}
