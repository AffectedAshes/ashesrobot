// randmon.js

const { sanitizeInput } = require('../handlers/sanitizer');
const { Random } = require('random-js');

//Pokemon Gen 1
const listOfMons = [

    {Mon: "Bulbasaur"},
    {Mon: "Ivysaur"},
    {Mon: "Venusaur"},
    {Mon: "Charmander"},
    {Mon: "Charmeleon"},
    {Mon: "Charizard"},
    {Mon: "Squirtle"},
    {Mon: "Wartortle"},
    {Mon: "Blastoise"},
    {Mon: "Caterpie"},
    {Mon: "Metapod"},
    {Mon: "Butterfree"},
    {Mon: "Weedle"},
    {Mon: "Kakuna"},
    {Mon: "Beedrill"},
    {Mon: "Pidgey"},
    {Mon: "Pidgeotto"},
    {Mon: "Pidgeot"},
    {Mon: "Rattata"},
    {Mon: "Raticate"},
    {Mon: "Spearow"},
    {Mon: "Fearow"},
    {Mon: "Ekans"},
    {Mon: "Arbok"},
    {Mon: "Pikachu"},
    {Mon: "Raichu"},
    {Mon: "Sandshrew"},
    {Mon: "Sandslash"},
    {Mon: "Nidoran♀"},
    {Mon: "Nidorina"},
    {Mon: "Nidoqueen"},
    {Mon: "Nidoran♂"},
    {Mon: "Nidorino"},
    {Mon: "Nidoking"},
    {Mon: "Clefairy"},
    {Mon: "Clefable"},
    {Mon: "Vulpix"},
    {Mon: "Ninetales"},
    {Mon: "Jigglypuff"},
    {Mon: "Wigglytuff"},
    {Mon: "Zubat"},
    {Mon: "Golbat"},
    {Mon: "Oddish"},
    {Mon: "Gloom"},
    {Mon: "Vileplume"},
    {Mon: "Paras"},
    {Mon: "Parasect"},
    {Mon: "Venonat"},
    {Mon: "Venomoth"},
    {Mon: "Diglett"},
    {Mon: "Dugtrio"},
    {Mon: "Meowth"},
    {Mon: "Persian"},
    {Mon: "Psyduck"},
    {Mon: "Golduck"},
    {Mon: "Mankey"},
    {Mon: "Primeape"},
    {Mon: "Growlithe"},
    {Mon: "Arcanine"},
    {Mon: "Poliwag"},
    {Mon: "Poliwhirl"},
    {Mon: "Poliwrath"},
    {Mon: "Abra"},
    {Mon: "Kadabra"},
    {Mon: "Alakazam"},
    {Mon: "Machop"},
    {Mon: "Machoke"},
    {Mon: "Machamp"},
    {Mon: "Bellsprout"},
    {Mon: "Weepinbell"},
    {Mon: "Victreebel"},
    {Mon: "Tentacool"},
    {Mon: "Tentacruel"},
    {Mon: "Geodude"},
    {Mon: "Graveler"},
    {Mon: "Golem"},
    {Mon: "Ponyta"},
    {Mon: "Rapidash"},
    {Mon: "Slowpoke"},
    {Mon: "Slowbro"},
    {Mon: "Magnemite"},
    {Mon: "Magneton"},
    {Mon: "Farfetch'd"},
    {Mon: "Doduo"},
    {Mon: "Dodrio"},
    {Mon: "Seel"},
    {Mon: "Dewgong"},
    {Mon: "Grimer"},
    {Mon: "Muk"},
    {Mon: "Shellder"},
    {Mon: "Cloyster"},
    {Mon: "Gastly"},
    {Mon: "Haunter"},
    {Mon: "Gengar"},
    {Mon: "Onix"},
    {Mon: "Drowzee"},
    {Mon: "Hypno"},
    {Mon: "Krabby"},
    {Mon: "Kingler"},
    {Mon: "Voltorb"},
    {Mon: "Electrode"},
    {Mon: "Exeggcute"},
    {Mon: "Exeggutor"},
    {Mon: "Cubone"},
    {Mon: "Marowak"},
    {Mon: "Hitmonlee"},
    {Mon: "Hitmonchan"},
    {Mon: "Lickitung"},
    {Mon: "Koffing"},
    {Mon: "Weezing"},
    {Mon: "Rhyhorn"},
    {Mon: "Rhydon"},
    {Mon: "Chansey"},
    {Mon: "Tangela"},
    {Mon: "Kangaskhan"},
    {Mon: "Horsea"},
    {Mon: "Seadra"},
    {Mon: "Goldeen"},
    {Mon: "Seaking"},
    {Mon: "Staryu"},
    {Mon: "Starmie"},
    {Mon: "Mr. Mime"},
    {Mon: "Scyther"},
    {Mon: "Jynx"},
    {Mon: "Electabuzz"},
    {Mon: "Magmar"},
    {Mon: "Pinsir"},
    {Mon: "Tauros"},
    {Mon: "Magikarp"},
    {Mon: "Gyarados"},
    {Mon: "Lapras"},
    {Mon: "Ditto"},
    {Mon: "Eevee"},
    {Mon: "Vaporeon"},
    {Mon: "Jolteon"},
    {Mon: "Flareon"},
    {Mon: "Porygon"},
    {Mon: "Omanyte"},
    {Mon: "Omastar"},
    {Mon: "Kabuto"},
    {Mon: "Kabutops"},
    {Mon: "Aerodactyl"},
    {Mon: "Snorlax"},
    {Mon: "Articuno"},
    {Mon: "Zapdos"},
    {Mon: "Moltres"},
    {Mon: "Dratini"},
    {Mon: "Dragonair"},
    {Mon: "Dragonite"},
    {Mon: "Mewtwo"},
    {Mon: "Mew"}
    
  ];

// Create a new Random instance
const random = new Random();

// Function called when the "!randmon" command is issued
function randmonCommand(target, client, context, msg) {
  const sanitizedMsg = sanitizeInput(msg); // Sanitize user input

  const mon = rndmon();
  client.say(target, `${mon}`);

  const userMon = sanitizedMsg.toLowerCase().replace(/^!randmon\s+/, "");
  if (userMon === mon.toLowerCase()) {
    client.say(target, `@${context.username} Congrats, you won Randmon!`);
  }
}

// Function to generate a random Pokemon
function rndmon() {
  const rndNum = random.integer(0, listOfMons.length - 1);
  const mon = listOfMons[rndNum].Mon;
  return mon;
}

module.exports = {
  randmonCommand,
};