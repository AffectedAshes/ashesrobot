# ashesrobot

The Bot can only change the title or category of my stream for now.

## Documentation

This command returns the link to this Github page.

`!commands`

Those are all the main commands which are enabled in every channel.

### Moderator only Commands

Add, edit and delete (as long as they exist in the specific channel) commands with simple text responses.

`!addcmd <commandname> <response>`

`!editcmd <commandname> <newresponse>`

`!delcmd <commandname>`

### Database

This command lists all commands which are added to the database for the specific channel it gets used in.

`!cmds`

### Main Bot Commands

The list of commands for every user with their inputs and cooldowns.

### ChatGPT

Give ChatGPT a specific prompt (can be a sentence too) or ask a question for example (5 minute cooldown per user)

`!chatgpt <prompt>`

### Hangman

Hangman Minigame (5 minute cooldown between each hangman game)

* `!hangman`
  
  starts the mingame

* `!guess <guess>`
  
  for guessing a letter or the full name (5 second cooldown per user for a guess)

### Translate

Chinese Pokémon Names translated with Google Translate and you have to guess what the Pokémon name is in English (30 second cooldown between each translate game)

* `!translate`
  
  starts the mingame

* `!translate <guess>`
* `!t <guess>`

  for guessing the Pokémon name (5 second cooldown per user for a guess)

### Slots

Emote Slots Minigame (60 second cooldown per user) 

`!slots`

### Metronome

Guess a random Gen 1 Pokemon Move (30 second cooldown per user)

`!metronome <move>`

### Randmon

Guess a random Gen 1 Pokemon (30 second cooldown per user) 

`!randmon <mon>`

### Randrunner

Get a random runner name (30 second cooldown per user)

`!randrunner`

### Roll

Guess a random number between 1-4096 (30 second cooldown per user)

`!roll <1-4096>`

### Define

Get the definition from Urban Dictionary (30 second cooldown per user)

`!define <word>`

### Randomfact

Get a random fact (30 second cooldown per user)

`!randomfact`

### Weather

Get the current weather for x city (30 second cooldown per user) 

`!weather <city>`

### SRC

Get the World Record or Personal Best from speedrun.com for a specified game, category and runner

* `!wr <gameName>, <categoryName>, <variableName> - variableName does not have to be provided (e.g. ENG, JPN, Console, Emulator, etc)`
* `!pb <gameName>, <categoryName>, <runnerName>`

### Flail

Flail Calculator for Gen 1-4

`!flail <current max hp>`
