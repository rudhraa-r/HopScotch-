const buttonContainer = document.getElementById('buttonContainer');
const destinationContainer = document.getElementById('destinationContainer');
const lvlNo = document.getElementById('headingText');
const checkButton = document.getElementById('checkButton');
const resetButton = document.getElementById('resetButton');
const runButton = document.getElementById('runButton');
const character = document.getElementById('character');
const jump =document.getElementById('jump');
const hop =document.getElementById('hop');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Store the button sequences for each level
const levelSequences = {
  1: ['Skip','Hop','Jump','Hop','Jump'],
  2: ['Hop','Skip','Jump','Hop','Jump'],
  3: ['Hop','Hop','Skip','Hop','Jump'],
  4: ['Hop', 'Hop', 'Hop', 'Skip-HopRight', 'Hop', 'Jump'],
  5: ['Hop', 'Hop', 'Hop','Skip-HopLeft','Hop', 'Jump'], // Example level with right skip
  6: ['Hop','Hop','Hop','Jump','Skip'],
  7: ['Hop', 'Hop', 'Hop','Jump','Hop','Skip-HopRight'],
  8: ['Hop', 'Hop', 'Hop','Jump','Hop','Skip-HopLeft' ], // Example level with left skip
  // Add more levels as needed
};

let availableButtons;
let currentLevel = lvlNo.innerHTML;
console.log(currentLevel); // Set the initial level or dynamically determine the level
let nextlvl = parseInt(currentLevel) +1 ;
console.log(nextlvl);

// Initialize the game
function initializeGame(level) {
  currentLevel = level;
  availableButtons = levelSequences[level];

  // Update button visibility
  updateButtonVisibility();

  // Add event listener for the reset button
  resetButton.addEventListener('click', resetGame);
}

// Update the visibility of buttons based on the current level
function updateButtonVisibility() {
  const buttons = Array.from(buttonContainer.children);

  // Make all buttons visible
  buttons.forEach(button => {
    button.style.display = 'block';
  });

  // Hide buttons that are not required for the current level
  buttons.forEach(button => {
    const buttonId = button.id;
    const isButtonAvailable = availableButtons.includes(buttonId);
    if (!isButtonAvailable) {
      button.style.display = 'none';
    }
  });
}

// Add event listeners for drag and drop functionality
buttonContainer.addEventListener('dragstart', function(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
});

destinationContainer.addEventListener('dragover', function(event) {
  event.preventDefault();
});

destinationContainer.addEventListener('drop', function(event) {
  event.preventDefault();
  const buttonId = event.dataTransfer.getData('text/plain');
  const draggedButton = document.getElementById(buttonId);

  // Check if the button is available for the current level
  const isButtonAvailable = availableButtons.includes(buttonId);
  
  // Only move the button if it is available for the current level
  if (isButtonAvailable) {
    destinationContainer.appendChild(draggedButton);
    draggedButton.setAttribute("draggable", "false");
    draggedButton.style.cursor = 'no-drop';
  }
});

// Check the order when the check button is clicked
runButton.addEventListener('click', function() {
  const currentOrder = Array.from(destinationContainer.children).map(button => button.id);
  character.style.transform = `translateY(${0}px) translateX(${0}px)`;

  if (isOrderCorrect(currentOrder, availableButtons)) {
    alert(`Congratulations! You arranged the buttons correctly for place ${currentLevel}.`);
    // Move the character based on the arranged buttons
    moveCharacter(currentOrder);
  } else {
    alert('Oops! The buttons are not in the correct order or some buttons are missing. Use the reset button and run again.');
  }
});

checkButton.addEventListener('click', function(){
  const currentOrder = Array.from(destinationContainer.children).map(button => button.id);

    if(isOrderCorrect(currentOrder,availableButtons)){

      moveCharacterRun(currentOrder);
    }else{

      moveCharacterRun(currentOrder);
      
    }
  
});
// Reset the game
function resetGame() {
  while (destinationContainer.firstChild) {
    buttonContainer.appendChild(destinationContainer.firstChild);
    const buttons = Array.from(buttonContainer.children);
    buttons.forEach(button => {
      button.setAttribute("draggable", "true");
      button.style.cursor ='move';

  });
  // Set available buttons back to the current level buttons
  availableButtons = levelSequences[currentLevel];
  character.style.transform = `translateY(${0}px) translateX(${0}px)`;
  updateButtonVisibility();
}
}

// Check if the order is correct and all required buttons are present
function isOrderCorrect(currentOrder, requiredButtons) {
  if (currentOrder.length !== requiredButtons.length) return false;

  for (let i = 0; i < requiredButtons.length; i++) {
    if (currentOrder[i] !== requiredButtons[i]) {
      return false;
    }
  }

  return true;
}

let yPosition = 0;
let xPosition = 0;

function moveCharacter(buttonSequence) {
  let index = 0;
  character.style.transform = `translateY(${0}px) translateX(${0}px)`;
  function moveNext() {
    if (index >= buttonSequence.length) {
      showOverlay();
      return;
    }

    const buttonId = buttonSequence[index];
    let moveDistance;
    
    switch (buttonId) {
      case 'Hop':
        moveDistance = { y: 80, x: 0 };
        hop.style.display = 'block';
        jump.style.display ='none';
        break;
      case 'Skip':
        moveDistance = { y: 150, x: 0 }; // Skip moves by two tiles
        break;
      case 'Jump':
        moveDistance = { y: 80, x: 0 };
        hop.style.display = 'none';
        jump.style.display ='block'; // Jump moves by three tiles
        break;
      case 'Skip-HopRight':
        moveDistance = { y: 80, x: 32 }; // Skip right by moving down and right
        hop.style.display = 'block';
        jump.style.display ='none';
        break;
      case 'Skip-HopLeft':
        moveDistance = { y: 80, x: -32 }; // Skip left by moving down and left
        hop.style.display = 'block';
        jump.style.display ='none';
        break;
      default:
        moveDistance = { y: 0, x: 0 };
        break;
    }

    yPosition += moveDistance.y;
    xPosition = moveDistance.x;
    character.style.transform = `translateY(${-yPosition}px) translateX(${xPosition}px)`;

    index++;
    setTimeout(moveNext, 1000); // Delay before the next move
  }

  moveNext();
}

function moveCharacterRun(buttonSequence) {
  let index = 0;

  function moveNext() {
    if (index >= buttonSequence.length) {
      const currentOrder = Array.from(destinationContainer.children).map(button => button.id);
      if(isOrderCorrect(currentOrder , availableButtons)){
        alert('The order is right , now use the run button to finish the level');
      }else{
        alert('The order is not right or its incomplete. Check the animation & use the reset button to try again !!');
      }
      character.style.transform = `translateY(${0}px) translateX(${0}px)`;
      xPosition = 0;
      yPosition = 0;
      return;
    }

    const buttonId = buttonSequence[index];
    let moveDistance;

    switch (buttonId) {
      case 'Hop':
        moveDistance = { y: 80, x: 0 };
        hop.style.display = 'block';
        jump.style.display ='none';
        break;
      case 'Skip':
        moveDistance = { y: 150, x: 0 };
        hop.style.display = 'block';
        jump.style.display ='none'; // Skip moves by two tiles
        break;
      case 'Jump':
        moveDistance = { y: 80, x: 0 };
        hop.style.display = 'none';
        jump.style.display ='block'; // Jump moves by three tiles
        break;
      case 'Skip-HopRight':
        moveDistance = { y: 80, x: 32 }; // Skip right by moving down and right
        hop.style.display = 'block';
        jump.style.display ='none';
        break;
      case 'Skip-HopLeft':
        moveDistance = { y: 80, x: -32 }; // Skip left by moving down and left
        hop.style.display = 'block';
        jump.style.display ='none';
        break;
      default:
        moveDistance = { y: 0, x: 0 };
        break;
    }

    yPosition += moveDistance.y;
    xPosition = moveDistance.x;
    character.style.transform = `translateY(${-yPosition}px) translateX(${xPosition}px)`;

    index++;
    setTimeout(moveNext, 1000); // Delay before the next move
  }

  moveNext();
}

function redirectToNextPage() {
  // Redirect to the next page
  window.location.href = `https://rudhraa-r.github.io/HopScotch-/Hop_lvl/idx_hop${nextlvl}.html`;
}

function Startover() {
  // Redirect to the next page
  window.location.href = `https://rudhraa-r.github.io/HopScotch-/Hop_lvl/idx_hop${currentLevel}.html`;
}

function Mainlvl() {
  // Redirect to the next page
  window.location.href = "https://rudhraa-r.github.io/HopScotch-/Hop_lvl/index_hop.html";
}

function showOverlay() {
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  const overlayContent = document.createElement('div');
  overlayContent.classList.add('overlay-content');
  overlay.appendChild(overlayContent);

  const overlayMessage = document.createElement('p');
  overlayMessage.textContent = 'Congratulations! You completed this level.';
  overlayContent.appendChild(overlayMessage);

  const startover = document.createElement('button');
  startover.textContent = 'Start Over';
  startover.addEventListener('click', Startover);
  overlayContent.appendChild(startover);


  const redirectButton = document.createElement('button');
  redirectButton.textContent = 'Next Level';
  redirectButton.addEventListener('click', redirectToNextPage);
  overlayContent.appendChild(redirectButton);

  const mainlvl = document.createElement('button');
  mainlvl.textContent = 'Main Levels';
  mainlvl.addEventListener('click', Mainlvl);
  overlayContent.appendChild(mainlvl);
}

// Function to remove overlay
function removeOverlay() {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.remove();
  }
}

// Initialize the game for the current level
initializeGame(currentLevel);
