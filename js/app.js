let timeLeft = 60
let round = 0
let countdown

const randomizeQuestionOrder = () => {
  return questions.sort(() => Math.random() - .5)
}

const randomQuestions = randomizeQuestionOrder()
console.log(randomQuestions)

document.querySelector('#start-game').addEventListener('click', () => {
  startTimer()
  displayQuestion(randomQuestions[round])
})

const startTimer = () => {
  countdown = setInterval(() => {
    document.querySelector('#timer').textContent = timeLeft
    if (timeLeft <= 0) {
      // game ends
      gameOver()
      document.querySelector('#timer').textContent = 0
    } else {
      timeLeft--
    }
  }, 1000)
}

const displayQuestion = question => {
  if (!question) {
    gameOver()
    return
  }
  const questionContainer = document.querySelector('.question')
  questionContainer.innerHTML = ''
  const questionHeader = document.createElement('h2')
  questionContainer.className = 'question'
  questionHeader.textContent = question.text
  questionContainer.appendChild(questionHeader)
  // Display the choices
  const choiceList = document.createElement('ul')
  question.choices.forEach(choice => {
    const li = document.createElement('li')
    li.className = 'question-choice'
    li.textContent = choice.text
    li.setAttribute('data-correct', choice.correct || false)
    choiceList.appendChild(li)
    li.addEventListener('click', e => {
      console.log('this is  the click event')
      if (e.target.matches('li') && e.target.dataset.correct === 'true') {
        console.log('thats the correct answer!') // Don't decrement score/timer 
        round++
      }
      else timeLeft -= 20 // Decrement score/timer
      // advance to next question
      displayQuestion(randomQuestions[round])
    })
  })
  questionContainer.appendChild(choiceList)
  document.querySelector('.game-space').appendChild(questionContainer)
}

const gameOver = () => {
  clearInterval(countdown)
  const initialsForm = document.createElement('form')
  const initialsInput = document.createElement('input')
  initialsInput.setAttribute('placeholder', 'What are your initials?')
  initialsForm.appendChild(initialsInput)
  document.querySelector('.game-space').innerHTML = ''
  document.querySelector('.game-space').appendChild(initialsForm)

  document.addEventListener('submit' , e => {
    e.preventDefault()
    let scores = JSON.parse(localStorage.getItem('scores')) || []
    scores.push({
      initials: initialsInput.value,
      score: timeLeft + 1
    })
    localStorage.setItem('scores', JSON.stringify(scores))
    displayHighScores()
  })

  if (timeLeft >= 0) {
    // user wins: their score is the remaining time
    // display top scores
  } else {
    // user lost :sadface
  }
}

const displayHighScores = () => {
  let scores = JSON.parse(localStorage.getItem('scores')).sort((a, b) => {
    return b.score - a.score
  })

  console.log(scores)
}