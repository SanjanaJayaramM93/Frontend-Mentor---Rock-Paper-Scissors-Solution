// DOM Elements
const rulesBtn = document.getElementById('rules-btn');
const rulesModal = document.querySelector('.rules-modal');
const closeModalBtn = document.getElementById('close-modal');
const overlay = document.querySelector('.overlay');
const outerContainers = document.querySelectorAll('.outer-container');
const userChoiceDisplay = document.getElementById('user-choice-icon'); 
const computerChoiceDisplay = document.getElementById('computer-choice-icon'); 
const outcomeDisplay = document.getElementById('outcome');
const resultSection = document.querySelector('.result-section');
const playAgainButton = document.getElementById('play-again');
const scoreDisplay = document.getElementById('score-value'); 

// Game logic
const winConditions = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};

// Load score from local storage or set to 0 if not found
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

// Update the score display on page load
scoreDisplay.innerText = score;

// Show rules modal
rulesBtn.addEventListener('click', () => {
  rulesModal.classList.remove('hidden');
  overlay.classList.remove('hidden'); // Show overlay when modal is open
});

// Close rules modal
closeModalBtn.addEventListener('click', () => {
  rulesModal.classList.add('hidden');
  overlay.classList.add('hidden'); // Hide overlay when modal is closed
});

// Close modal when overlay is clicked
overlay.addEventListener('click', () => {
  rulesModal.classList.add('hidden');
  overlay.classList.add('hidden'); // Hide overlay when modal is closed
});

// Game item selection
outerContainers.forEach(container => {
  container.addEventListener('click', () => {
    const userChoice = container.dataset.choice;

    // Hide the Pentagon background and game items
    document.querySelector('.pentagon-bg').style.display = 'none';
    outerContainers.forEach(item => {
      item.style.display = 'none'; // Hide all game items
    });

    // Set user's choice image
    userChoiceDisplay.src = `./images/icon-${userChoice}.svg`;

    // Set the result icon container class based on user choice
    const userResultContainer = document.querySelector('.result-icon-container:nth-of-type(1)');
    userResultContainer.className = 'result-icon-container ' + userChoice; // Add user's choice class

    computerChoiceDisplay.src = ''; // Clear computer choice initially
    resultSection.classList.remove('hidden'); // Show result section

    // Apply black circle before the choice appears
    const computerResultContainer = document.querySelector('.computerPicked .result-icon-container');
    computerResultContainer.classList.add('waiting'); 

    setTimeout(() => {
      const computerChoice = getComputerChoice();
      
      // Set computer's choice image
      computerChoiceDisplay.src = `./images/icon-${computerChoice}.svg`;

      // Remove black circle and apply computer choice
      computerResultContainer.className = 'result-icon-container ' + computerChoice; 
      computerResultContainer.classList.remove('waiting'); 

      const result = determineWinner(userChoice, computerChoice);
      outcomeDisplay.innerText = result; // Display game result
      scoreDisplay.innerText = score; // Update score display

      // Show outcome and Play Again button
      outcomeDisplay.classList.remove('hidden');
      playAgainButton.classList.remove('hidden');
    }, 1000); // Delay of 1 second
  });
});

// Get a random computer choice
function getComputerChoice() {
  const choices = Object.keys(winConditions);
  return choices[Math.floor(Math.random() * choices.length)];
}

// Determine the winner
function determineWinner(userChoice, computerChoice) {
  const userResultContainer = document.querySelector('.userPicked .result-icon-container');
  const computerResultContainer = document.querySelector('.computerPicked .result-icon-container');

  // Reset fade and halo effect classes
  userResultContainer.classList.remove('fade', 'halo');
  computerResultContainer.classList.remove('fade', 'halo');

  if (userChoice === computerChoice) {
      console.log("It's a tie!");
      // No effect for tie
      return "It's a tie!";
  } else if (winConditions[userChoice].includes(computerChoice)) {
      score++; // Increase score on win
      localStorage.setItem('score', score); // Save to local storage
      userResultContainer.classList.add('fade', 'halo'); // Add fade and halo effect for user win
      console.log('Fade effect applied for user win');
      return "You win!";
  } else {
      if (score > 0) {
          score--; // Decrease score on loss but not below zero
          localStorage.setItem('score', score); // Save to local storage
      }
      computerResultContainer.classList.add('fade', 'halo'); // Add fade and halo effect for computer win
      console.log('Fade effect applied for computer win');
      return "You lose!";
  }
}

// Play again functionality
playAgainButton.addEventListener('click', () => {
  resultSection.classList.add('hidden'); // Hide result section
  userChoiceDisplay.src = ''; // Clear user's choice
  computerChoiceDisplay.src = ''; // Clear computer's choice
  outcomeDisplay.innerText = ''; // Clear the result message

  // Reset ripple effect classes
  const userResultContainer = document.querySelector('.userPicked .result-icon-container');
  const computerResultContainer = document.querySelector('.computerPicked .result-icon-container');
  userResultContainer.classList.remove('ripple'); // Reset class
  console.log('Ripple effect removed for user');
  computerResultContainer.classList.remove('ripple'); // Reset class
  console.log('Ripple effect removed for computer');

  // Hide outcome and Play Again button
  outcomeDisplay.classList.add('hidden');
  playAgainButton.classList.add('hidden');
  
  // Show the Pentagon background and game items again
  document.querySelector('.pentagon-bg').style.display = 'block'; // Show Pentagon background
  outerContainers.forEach(item => {
    item.style.display = 'flex'; // Show all game items
  });

  // Reset computer result icon container class
  computerResultContainer.className = 'result-icon-container'; // Reset class
});
