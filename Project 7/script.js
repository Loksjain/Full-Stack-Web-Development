// Game State
let gameArray = [];
let maxArraySize = 10;
let currentLevel = 1;
let targetPattern = [];
let gameTimer = 60;
let timerInterval = null;
let soundEnabled = true;
let gameActive = true;

// Game Levels Configuration
const levels = [
    { level: 1, patternLength: 2, time: 60, description: "Find any 2-digit pattern" },
    { level: 2, patternLength: 3, time: 45, description: "Find a 3-digit pattern" },
    { level: 3, patternLength: 3, time: 30, description: "Find a pattern in reverse order" }
];

// Initialize Game
function initGame() {
    gameArray = [3, 1, 7, null, 2, 1, 4, 9, null, null];
    generateTargetPattern();
    renderArray();
    updateGameInfo();
    startTimer();
    showFeedback("🚀 Ready to hack! Insert digits to build your code...", "info");
}

// Generate Target Pattern
function generateTargetPattern() {
    const currentLevelConfig = levels[currentLevel - 1];
    targetPattern = [];
    
    for (let i = 0; i < currentLevelConfig.patternLength; i++) {
        targetPattern.push(Math.floor(Math.random() * 10));
    }
    
    // For level 3, we'll check for reverse pattern
    if (currentLevel === 3) {
        document.getElementById('target-pattern').textContent = 
            `[${targetPattern.slice().reverse().join(', ')}] (reverse)`;
    } else {
        document.getElementById('target-pattern').textContent = 
            `[${targetPattern.join(', ')}]`;
    }
}

// Render Array Display
function renderArray() {
    const arrayDisplay = document.getElementById('array-display');
    arrayDisplay.innerHTML = '';
    
    for (let i = 0; i < maxArraySize; i++) {
        const cell = document.createElement('div');
        cell.className = 'array-cell';
        cell.id = `cell-${i}`;
        
        if (gameArray[i] !== null && gameArray[i] !== undefined) {
            cell.textContent = gameArray[i];
            cell.classList.remove('empty');
        } else {
            cell.classList.add('empty');
            cell.textContent = '';
        }
        
        arrayDisplay.appendChild(cell);
    }
}

// Insert Element
function insertElement() {
    if (!gameActive) return;
    
    const indexInput = document.getElementById('insert-index');
    const valueInput = document.getElementById('insert-value');
    
    const index = parseInt(indexInput.value);
    const value = parseInt(valueInput.value);
    
    // Validation
    if (isNaN(index) || index < 0 || index >= maxArraySize) {
        showFeedback("❌ Index out of bounds! Use index 0-9.", "error");
        playSound('error');
        return;
    }
    
    if (isNaN(value) || value < 0 || value > 9) {
        showFeedback("❌ Value must be a digit 0-9!", "error");
        playSound('error');
        return;
    }
    
    // Check if array is full
    if (gameArray.filter(item => item !== null).length >= maxArraySize) {
        showFeedback("❌ Array is full! Delete some elements first.", "error");
        playSound('error');
        return;
    }
    
    // Shift elements to the right from the insertion point
    for (let i = maxArraySize - 1; i > index; i--) {
        gameArray[i] = gameArray[i - 1];
    }
    
    // Insert the new value
    gameArray[index] = value;
    
    // Clear inputs
    indexInput.value = '';
    valueInput.value = '';
    
    // Update display with animation
    renderArrayWithAnimation('insert', index);
    showFeedback(`✅ Inserted ${value} at index ${index}!`, "success");
    playSound('insert');
    
    // Check for pattern match
    setTimeout(() => checkPatternMatch(), 500);
}

// Delete Element
function deleteElement() {
    if (!gameActive) return;
    
    const indexInput = document.getElementById('delete-index');
    const index = parseInt(indexInput.value);
    
    // Validation
    if (isNaN(index) || index < 0 || index >= maxArraySize) {
        showFeedback("❌ Index out of bounds! Use index 0-9.", "error");
        playSound('error');
        return;
    }
    
    if (gameArray[index] === null || gameArray[index] === undefined) {
        showFeedback("❌ No element at that index to delete!", "error");
        playSound('error');
        return;
    }
    
    const deletedValue = gameArray[index];
    
    // Shift elements to the left from the deletion point
    for (let i = index; i < maxArraySize - 1; i++) {
        gameArray[i] = gameArray[i + 1];
    }
    gameArray[maxArraySize - 1] = null;
    
    // Clear input
    indexInput.value = '';
    
    // Update display with animation
    renderArrayWithAnimation('delete', index);
    showFeedback(`🗑️ Deleted element ${deletedValue} at index ${index}.`, "success");
    playSound('delete');
}

// Search Pattern
function searchPattern() {
    if (!gameActive) return;
    
    const patternInput = document.getElementById('search-pattern');
    const patternStr = patternInput.value.trim();
    
    if (!patternStr) {
        showFeedback("❌ Enter a pattern to search (e.g., 2,1,4)", "error");
        playSound('error');
        return;
    }
    
    // Parse pattern
    let searchPattern;
    try {
        searchPattern = patternStr.split(',').map(num => {
            const parsed = parseInt(num.trim());
            if (isNaN(parsed) || parsed < 0 || parsed > 9) {
                throw new Error('Invalid digit');
            }
            return parsed;
        });
    } catch (error) {
        showFeedback("❌ Invalid pattern format! Use digits separated by commas (e.g., 2,1,4)", "error");
        playSound('error');
        return;
    }
    
    if (searchPattern.length === 0) {
        showFeedback("❌ Pattern cannot be empty!", "error");
        playSound('error');
        return;
    }
    
    // Clear input
    patternInput.value = '';
    
    // Perform animated search
    performAnimatedSearch(searchPattern);
}

// Perform Animated Search
function performAnimatedSearch(searchPattern) {
    const validArray = gameArray.filter(item => item !== null);
    let foundIndex = -1;
    let currentIndex = 0;
    
    showFeedback(`🔍 Searching for pattern [${searchPattern.join(', ')}]...`, "info");
    
    const searchInterval = setInterval(() => {
        // Clear previous highlights
        document.querySelectorAll('.array-cell').forEach(cell => {
            cell.classList.remove('highlight');
        });
        
        // Highlight current search position
        for (let i = 0; i < searchPattern.length && currentIndex + i < validArray.length; i++) {
            const cellIndex = findCellIndex(currentIndex + i);
            if (cellIndex !== -1) {
                document.getElementById(`cell-${cellIndex}`).classList.add('highlight');
            }
        }
        
        // Check if pattern matches at current position
        let matches = true;
        for (let i = 0; i < searchPattern.length; i++) {
            if (currentIndex + i >= validArray.length || validArray[currentIndex + i] !== searchPattern[i]) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            foundIndex = currentIndex;
            clearInterval(searchInterval);
            
            // Highlight found pattern
            setTimeout(() => {
                for (let i = 0; i < searchPattern.length; i++) {
                    const cellIndex = findCellIndex(foundIndex + i);
                    if (cellIndex !== -1) {
                        const cell = document.getElementById(`cell-${cellIndex}`);
                        cell.classList.remove('highlight');
                        cell.classList.add('found');
                    }
                }
                
                showFeedback(`🎉 Pattern found at position ${foundIndex}!`, "success");
                playSound('success');
                
                // Remove found highlighting after 2 seconds
                setTimeout(() => {
                    document.querySelectorAll('.array-cell').forEach(cell => {
                        cell.classList.remove('found');
                    });
                }, 2000);
            }, 300);
            
            return;
        }
        
        currentIndex++;
        
        // If we've searched the entire array
        if (currentIndex > validArray.length - searchPattern.length) {
            clearInterval(searchInterval);
            
            setTimeout(() => {
                document.querySelectorAll('.array-cell').forEach(cell => {
                    cell.classList.remove('highlight');
                });
                showFeedback(`❌ Pattern [${searchPattern.join(', ')}] not found in array.`, "error");
                playSound('error');
            }, 300);
        }
    }, 400);
}

// Find Cell Index (maps valid array index to actual cell index)
function findCellIndex(validIndex) {
    let count = 0;
    for (let i = 0; i < maxArraySize; i++) {
        if (gameArray[i] !== null) {
            if (count === validIndex) {
                return i;
            }
            count++;
        }
    }
    return -1;
}

// Reset Array
function resetArray() {
    if (!gameActive) return;
    
    gameArray = new Array(maxArraySize).fill(null);
    renderArray();
    showFeedback("🔄 Array reset! Start building your code...", "info");
    playSound('reset');
}

// Render Array with Animation
function renderArrayWithAnimation(operation, index) {
    const cells = document.querySelectorAll('.array-cell');
    
    if (operation === 'insert') {
        // Animate elements sliding right
        for (let i = index; i < maxArraySize; i++) {
            cells[i].classList.add('slide-right');
        }
    } else if (operation === 'delete') {
        // Animate elements sliding left
        for (let i = index; i < maxArraySize; i++) {
            cells[i].classList.add('slide-left');
        }
    }
    
    setTimeout(() => {
        renderArray();
        cells.forEach(cell => {
            cell.classList.remove('slide-right', 'slide-left');
        });
    }, 300);
}

// Check Pattern Match
function checkPatternMatch() {
    if (!gameActive) return;
    
    const validArray = gameArray.filter(item => item !== null);
    let patternToCheck = targetPattern;
    
    // For level 3, check for reverse pattern
    if (currentLevel === 3) {
        patternToCheck = targetPattern.slice().reverse();
    }
    
    // Check if target pattern exists in the array
    for (let i = 0; i <= validArray.length - patternToCheck.length; i++) {
        let matches = true;
        for (let j = 0; j < patternToCheck.length; j++) {
            if (validArray[i + j] !== patternToCheck[j]) {
                matches = false;
                break;
            }
        }
        
        if (matches) {
            gameActive = false;
            clearInterval(timerInterval);
            
            // Highlight the winning pattern
            setTimeout(() => {
                for (let j = 0; j < patternToCheck.length; j++) {
                    const cellIndex = findCellIndex(i + j);
                    if (cellIndex !== -1) {
                        document.getElementById(`cell-${cellIndex}`).classList.add('found');
                    }
                }
            }, 200);
            
            const timeUsed = levels[currentLevel - 1].time - gameTimer;
            showSuccessModal(timeUsed);
            playSound('victory');
            return;
        }
    }
}

// Show Success Modal
function showSuccessModal(timeUsed) {
    const modal = document.getElementById('success-modal');
    const message = document.getElementById('success-message');
    
    message.textContent = `You cracked the code in ${timeUsed} seconds! 
                          Pattern [${currentLevel === 3 ? targetPattern.slice().reverse().join(', ') : targetPattern.join(', ')}] found!`;
    
    modal.classList.add('show');
}

// Next Level
function nextLevel() {
    closeModal();
    
    if (currentLevel < levels.length) {
        currentLevel++;
        gameTimer = levels[currentLevel - 1].time;
        gameActive = true;
        
        // Reset array with some initial values
        gameArray = [Math.floor(Math.random() * 10), null, Math.floor(Math.random() * 10), 
                    null, null, Math.floor(Math.random() * 10), null, null, null, null];
        
        generateTargetPattern();
        renderArray();
        updateGameInfo();
        startTimer();
        
        showFeedback(`🎯 Level ${currentLevel} started! ${levels[currentLevel - 1].description}`, "info");
        playSound('levelup');
    } else {
        showFeedback("🏆 Congratulations! You've completed all levels!", "success");
        playSound('victory');
    }
}

// Close Modal
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');
    });
}

// Restart Game
function restartGame() {
    closeModal();
    currentLevel = 1;
    gameTimer = levels[0].time;
    gameActive = true;
    initGame();
}

// Start Timer
function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        gameTimer--;
        document.getElementById('timer').textContent = gameTimer;
        
        // Change timer color based on remaining time
        const timerElement = document.getElementById('timer');
        if (gameTimer <= 10) {
            timerElement.style.color = '#ff6b35';
            timerElement.style.animation = 'timerPulse 1s infinite';
        } else if (gameTimer <= 20) {
            timerElement.style.color = '#f7931e';
        } else {
            timerElement.style.color = '#00ff41';
            timerElement.style.animation = 'none';
        }
        
        if (gameTimer <= 0) {
            gameActive = false;
            clearInterval(timerInterval);
            showGameOverModal();
            playSound('gameover');
        }
    }, 1000);
}

// Show Game Over Modal
function showGameOverModal() {
    const modal = document.getElementById('gameover-modal');
    modal.classList.add('show');
}

// Update Game Info
function updateGameInfo() {
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('timer').textContent = gameTimer;
}

// Show Feedback
function showFeedback(message, type = "info") {
    const feedbackDisplay = document.getElementById('feedback-display');
    const feedbackMessage = feedbackDisplay.querySelector('.feedback-message');
    
    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback-message ${type}`;
    
    // Add fade-in animation
    feedbackMessage.style.animation = 'none';
    setTimeout(() => {
        feedbackMessage.style.animation = 'fadeIn 0.5s ease-in-out';
    }, 10);
}

// Sound Effects
function playSound(type) {
    if (!soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const sounds = {
        insert: { frequency: 800, duration: 0.1 },
        delete: { frequency: 400, duration: 0.15 },
        search: { frequency: 600, duration: 0.2 },
        success: { frequency: 1000, duration: 0.3 },
        error: { frequency: 200, duration: 0.4 },
        victory: { frequency: 1200, duration: 0.5 },
        gameover: { frequency: 150, duration: 0.8 },
        reset: { frequency: 500, duration: 0.2 },
        levelup: { frequency: 900, duration: 0.4 }
    };
    
    const sound = sounds[type];
    if (!sound) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(sound.frequency, audioContext.currentTime);
    oscillator.type = type === 'victory' ? 'sine' : 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + sound.duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + sound.duration);
}

// Toggle Sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('sound-btn');
    
    if (soundEnabled) {
        soundBtn.textContent = '🔊';
        soundBtn.classList.remove('muted');
    } else {
        soundBtn.textContent = '🔇';
        soundBtn.classList.add('muted');
    }
}

// Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
    if (!gameActive) return;
    
    // Enter key to insert (if both index and value are filled)
    if (event.key === 'Enter') {
        const insertIndex = document.getElementById('insert-index').value;
        const insertValue = document.getElementById('insert-value').value;
        
        if (insertIndex && insertValue) {
            insertElement();
        }
    }
    
    // Space key to search (if pattern is filled)
    if (event.key === ' ' && event.target.tagName !== 'INPUT') {
        event.preventDefault();
        const searchPattern = document.getElementById('search-pattern').value;
        if (searchPattern) {
            searchPattern();
        }
    }
    
    // R key to reset
    if (event.key.toLowerCase() === 'r' && event.target.tagName !== 'INPUT') {
        resetArray();
    }
});

// Add CSS for timer pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes timerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

