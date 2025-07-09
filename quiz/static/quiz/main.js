document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const welcomeScreen = document.getElementById('welcome-screen');
  const quizApp = document.getElementById('quiz-app');

  startBtn.addEventListener('click', () => {
    welcomeScreen.classList.add('hidden');
    quizApp.classList.remove('hidden');

    document.getElementById('footer').classList.add('hidden');
  });

  const buttons = document.querySelectorAll('.category-btn');
  const quizArea = document.getElementById('quiz-area');
  let questions = [];
  let current = 0;
  let score = 0;

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const category = btn.dataset.category;
      quizArea.innerHTML = '<p>Loading questions...</p>';
      try {
        const res = await fetch(`/api/?category=${category}`);
        questions = await res.json();
        current = 0;
        score = 0;
        showQuestion();
      } catch (err) {
        quizArea.innerHTML = '<p class="text-red-500">Failed to load questions.</p>';
        console.error('API Error:', err);
      }
    });
  });

  function showQuestion() {
    if (current >= questions.length) {
      quizArea.innerHTML = `
        <h2 class="text-xl font-bold">Quiz Complete!</h2>
        <p class="text-lg">Score: ${score}/${questions.length}</p>
        <button onclick="location.reload()" class="mt-4 bg-green-600 px-4 py-2 rounded">Try Again</button>
      `;
      document.getElementById('footer').classList.remove('hidden');
      return;
    }
  
    const q = questions[current];
  
    // ✅ Extract string from q.question.text or .text if nested
    const questionText = typeof q.question === 'object' ? q.question.text : q.question;
  
    const choices = [...q.incorrectAnswers, q.correctAnswer].sort(() => 0.5 - Math.random());
  
    quizArea.innerHTML = `
      <h2 class="text-lg font-semibold mb-4">${questionText}</h2>
      ${choices.map(c => `
        <button class="block w-full bg-blue-700 hover:bg-blue-800 mt-2 px-4 py-2 rounded transition-colors"
                onclick="submitAnswer('${c.replace(/'/g, "\\'")}', this)">
          ${c}
        </button>
      `).join('')}
    `;
  }
  

  window.submitAnswer = function(selected, btn) {
    const correct = questions[current].correctAnswer;
    const allButtons = document.querySelectorAll('#quiz-area button');
  
    // Disable all buttons
    allButtons.forEach(b => b.disabled = true);
  
    // Apply styles
    if (selected === correct) {
      btn.classList.remove('bg-blue-700', 'hover:bg-blue-800');
      btn.classList.add('bg-green-600');
      score++;
    } else {
      btn.classList.remove('bg-blue-700', 'hover:bg-blue-800');
      btn.classList.add('bg-red-600');
  
      // Highlight the correct answer
      allButtons.forEach(b => {
        if (b.innerText === correct) {
          b.classList.remove('bg-blue-700', 'hover:bg-blue-800');
          b.classList.add('bg-green-600');
        }
      });
    }
  
    // Wait before showing the next question
    setTimeout(() => {
      current++;
      showQuestion();
    }, 1000); // 1 second delay
  }
  
  
});