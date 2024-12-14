let deckId = '';
let playerCard = null;
let computerCard = null;
let player1Score = 0;
let player2Score = 0;
let remainingCards = 52;

// Initialize the deck by calling the API
async function initializeDeck() {
    const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
    const data = await response.json();
    deckId = data.deck_id;
    remainingCards = data.remaining;
    updateRemainingCards();

    // Reset the scores to 0
    player1Score = 0;
    player2Score = 0;
    updateScores();

    document.getElementById('battle-result').innerText = ''; 

    // Show the "Get New Deck" button only if the deck is empty
    document.getElementById('new-deck-button').style.display = 'none'; 
    document.getElementById('draw-button').style.display = 'block'; 

    console.log('Deck initialized:', deckId);
}

// Draw cards for both players
async function drawCard() {
    if (remainingCards <= 0) {
        document.getElementById('new-deck-button').style.display = 'block';
        document.getElementById('draw-button').style.display = 'none';
        return;
    }

    // Add shuffle animation
    document.getElementById('player-card-container').classList.add('card-shuffle');
    document.getElementById('computer-card-container').classList.add('card-shuffle');
    document.getElementById('remaining-cards-img').classList.add('remaining-cards-shuffle');

    // Fetch two cards from the deck
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
    const data = await response.json();

    playerCard = data.cards[0];
    computerCard = data.cards[1];
    remainingCards = data.remaining;
    updateRemainingCards();

    setTimeout(() => {
        // Update card images
        document.getElementById('player-card').src = playerCard.image;
        document.getElementById('computer-card').src = computerCard.image;

        // Determine the winner
        determineWinner(playerCard, computerCard);

        // Remove shuffle animation
        document.getElementById('player-card-container').classList.remove('card-shuffle');
        document.getElementById('computer-card-container').classList.remove('card-shuffle');
        document.getElementById('remaining-cards-img').classList.remove('remaining-cards-shuffle');
    }, 200);
}

// Determine round winner based on card values
function determineWinner(playerCard, computerCard) {
    const playerValue = getCardValue(playerCard.value);
    const computerValue = getCardValue(computerCard.value);

    if (playerValue > computerValue) {
        player1Score++;
        document.getElementById('battle-result').innerText = 'You Win!';
        triggerConfetti(); // Player wins
    } else if (computerValue > playerValue) {
        player2Score++;
        document.getElementById('battle-result').innerText = 'Computer Wins!';
        triggerSadAnimation(); // Computer wins
    } else {
        document.getElementById('battle-result').innerText = 'It\'s a Tie!';
    }

    updateScores();

    if (remainingCards <= 0) {
        declareWinner();
    }
}

// Map card value to a numerical value for comparison
function getCardValue(cardValue) {
    const values = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        '10': 10, 'JACK': 11, 'QUEEN': 12, 'KING': 13, 'ACE': 14
    };
    return values[cardValue] || 0;
}

// Update scores on the page
function updateScores() {
    document.getElementById('player1-score').innerText = player1Score;
    document.getElementById('player2-score').innerText = player2Score;
}

// Update remaining cards display
function updateRemainingCards() {
    document.getElementById('remaining-cards').innerText = remainingCards;

    const remainingCardsImage = document.getElementById('remaining-cards-img');
    remainingCardsImage.style.display = remainingCards <= 0 ? 'none' : 'block';
}

// Declare the overall winner when all cards are drawn
function declareWinner() {
    let overallWinner = '';

    if (player1Score > player2Score) {
        overallWinner = 'You are the overall winner!';
        triggerConfetti(); // Player wins overall
    } else if (player2Score > player1Score) {
        overallWinner = 'Computer is the overall winner!';
        triggerSadAnimation(); // Computer wins overall
    } else {
        overallWinner = 'It\'s a tie overall!';
    }

    document.getElementById('battle-result').innerText = overallWinner;
}

// Trigger confetti (celebration)
function triggerConfetti() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ff9900'],
        scalar: 1.5
    });
}

// Trigger sad animation for computer's win
function triggerSadAnimation() {
    const resultMessage = document.getElementById('battle-result');
    resultMessage.classList.add('sad-animation');

    // Add sad emoji
    resultMessage.innerHTML += ' 😢';

    setTimeout(() => {
        resultMessage.classList.remove('sad-animation');
        resultMessage.innerHTML = resultMessage.innerHTML.replace(' 😢', '');
    }, 3000);
}

// Event listener for the "Draw Card" button
document.getElementById('draw-button').addEventListener('click', drawCard);

// Event listener for the "New Deck" button
document.getElementById('new-deck-button').addEventListener('click', initializeDeck);

// Initialize the deck when the page loads
initializeDeck();
