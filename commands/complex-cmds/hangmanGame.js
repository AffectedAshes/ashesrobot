// hangmanGame.js

class HangmanGame {
  constructor(word) {
    this.word = word.toLowerCase().replace(/\s/g, ''); // Remove any spaces from the word
    this.originalWord = word; // Store the original word from the list
    this.guesses = [];
    this.attempts = 15;
    this.hiddenWord = this.hideWord();
  }

  hideWord() {
    return this.word.split('').map(letter => (this.guesses.includes(letter) ? letter : '_')).join(' ');
  }

  guess(letter) {
    letter = letter.toLowerCase();
    if (!this.guesses.includes(letter)) {
      this.guesses.push(letter);
      if (!this.word.includes(letter)) {
        this.attempts--;
      }
      this.hiddenWord = this.hideWord();
      return true;
    }
    return false;
  }

  isGameOver() {
    return this.attempts === 0; 
  }
  
  isGameWon() {
    return !this.hiddenWord.includes('_');
  }
}

module.exports = HangmanGame;