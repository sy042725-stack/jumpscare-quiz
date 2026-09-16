// Quiz questions
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correct: 1
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correct: 1
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correct: 2
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for Gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "Which country is home to the Great Wall?",
        options: ["India", "Japan", "China", "Mongolia"],
        correct: 2
    },
    {
        question: "What year did the Titanic sink?",
        options: ["1912", "1905", "1920", "1898"],
        correct: 0
    },
    {
        question: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        correct: 2
    }
];

// Jumpscare images (emojis and messages)
const scareMessages = [
    { text: "GOTCHA!", emoji: "👻" },
    { text: "BOO!", emoji: "😱" },
    { text: "SURPRISE!", emoji: "👹" },
    { text: "FOUND YOU!", emoji: "👿" },
    { text: "AHHHHH!", emoji: "😈" }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

// DOM Elements
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const scareOverlay = document.getElementById('scareOverlay');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const scareMessage = document.getElementById('scareMessage');
const questionNumber = document.getElementById('questionNumber');
const progress = document.getElementById('progress');

// Initialize quiz
window.addEventListener('load', () => {
    loadQuestion();
});

// Load current question
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestion];
    questionElement.textContent = question.question;
    questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

    // Update progress bar
    const progressPercent = ((currentQuestion) / questions.length) * 100;
    progress.style.width = progressPercent + '%';

    // Clear previous options
    optionsElement.innerHTML = '';
    selectedAnswer = null;
    nextBtn.disabled = true;

    // Create option buttons
    question.options.forEach((option, index) => {
        const label = document.createElement('label');
        label.className = 'option';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = index;
        input.addEventListener('change', () => selectAnswer(index, label));

        const text = document.createElement('span');
        text.textContent = option;

        label.appendChild(input);
        label.appendChild(text);
        optionsElement.appendChild(label);
    });
}

// Select an answer
function selectAnswer(index, labelElement) {
    // Remove previous selection
    document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));

    // Mark selected
    selectedAnswer = index;
    labelElement.classList.add('selected');
    nextBtn.disabled = false;
}

// Next question
function nextQuestion() {
    if (selectedAnswer === null) return;

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correct;

    // Update score
    if (isCorrect) {
        score++;
    }

    // Show jumpscare
    triggerJumpscare();
}

// Trigger jumpscare effect
function triggerJumpscare() {
    const scare = scareMessages[Math.floor(Math.random() * scareMessages.length)];
    scareMessage.textContent = scare.text;
    scareOverlay.classList.remove('hidden');
    scareOverlay.style.animation = 'jumpscareAppear 0.15s ease-in';

    // Play sound effect
    playScareSound();

    // Add flickering effect
    scareOverlay.style.animation = 'jumpscareAppear 0.15s ease-in, flicker 0.1s infinite';

    // Hide jumpscare and load next question
    setTimeout(() => {
        scareOverlay.classList.add('hidden');
        scareOverlay.style.animation = '';
        currentQuestion++;
        loadQuestion();
    }, 2000);
}

// Play scary sound
function playScareSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Create a scary sound sweep
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);

    // Add a second beep
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();

    osc2.connect(gain2);
    gain2.connect(audioContext.destination);

    osc2.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
    gain2.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    osc2.start(audioContext.currentTime + 0.1);
    osc2.stop(audioContext.currentTime + 0.3);
}

// Show final results
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    document.getElementById('scoreText').textContent = `You scored ${score} out of ${totalQuestions} (${percentage}%)`;

    let feedback = '';
    if (percentage === 100) {
        feedback = "Perfect! You're a genius! 🧠";
    } else if (percentage >= 80) {
        feedback = "Excellent! Very impressive! 🌟";
    } else if (percentage >= 60) {
        feedback = "Good job! Keep learning! 📚";
    } else if (percentage >= 40) {
        feedback = "Not bad! Practice makes perfect! 💪";
    } else {
        feedback = "Don't worry! Try again next time! 🚀";
    }

    document.getElementById('feedbackText').textContent = feedback;
}

// Restart quiz
function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    resultScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    progress.style.width = '0%';
    loadQuestion();
}