const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];
const results = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" && //koi_disposition: Checks if is planet
    planet["koi_insol"] > 0.36 && //koi_insol: Check amount of light (0.36 min suggested)
    planet["koi_insol"] < 1.11 && //koi_insol: Check amount of light (1.11 max suggested)
    planet["koi_prad"] < 1.6 &&//koi_prad: Check planetary radius compared to earth (1.6 radius of Earth is suggested max)
    planet["koi_teq"] > 243 && //koi_teq: Check temperature > -30°C
    planet["koi_teq"] < 323 //koi_teq: Check temperature < 50°C
  );
}


fs.createReadStream("kepler_data.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    results.push(data);
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(`${habitablePlanets.length} habitable planets found!`);
    // console.log(habitablePlanets)
    // console.log(results);
  });
