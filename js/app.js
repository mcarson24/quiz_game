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
      gameLoss()
      document.querySelector('#timer').textContent = 0
    } else {
      timeLeft--
    }
  }, 1000)
}

const displayQuestion = question => {
  if (!question) {
    gameWin()
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
  question.choices.forEach((choice, i) => {
    const li = document.createElement('li')
    li.className = 'question-choice'
    li.textContent = choice.text
    choiceList.appendChild(li)
    li.addEventListener('click', e => {
      if (e.target.matches('li') && randomQuestions[round].choices[i].correct) {
        // Advance to next question
        round++
      }
      else timeLeft -= 20 // Decrement score/timer
      displayQuestion(randomQuestions[round])
    })
  })
  questionContainer.appendChild(choiceList)
  document.querySelector('.game-space').appendChild(questionContainer)
}

const gameLoss = () => {
  clearInterval(countdown)
  timeLeft = 0
  document.querySelector('.game-space').innerHTML = ''
  const losingMessage = document.createElement('h2')
  losingMessage.textContent = 'Sorry, better luck next time!'
  document.querySelector('.game-space').appendChild(losingMessage)
}

const gameWin = () => {
  clearInterval(countdown)
  const initialsForm = document.createElement('form')
  const initialsInput = document.createElement('input')
  initialsInput.setAttribute('placeholder', 'Enter your initials. 3 Characters, please')
  initialsForm.appendChild(initialsInput)
  document.querySelector('.game-space').innerHTML = ''
  document.querySelector('.game-space').appendChild(initialsForm)

  document.addEventListener('submit' , e => {
    e.preventDefault()
    if (initialsInput.value.trim().length !== 3) {
      const errorSpan = document.createElement('span')
      errorSpan.textContent = `Please enter three characters. ex: 'BCS'`
      errorSpan.className = 'error'
      document.querySelector('.game-space').appendChild(errorSpan)
      return
    }
    let scores = getHighScores()
    scores.push({
      initials: initialsInput.value.toUpperCase(),
      score: timeLeft > 0 ? timeLeft + 1 : 0
    })
    localStorage.setItem('scores', JSON.stringify(scores))

    const highScoresUl = document.createElement('ul')
    scores = scores.sort((a, b) => {
      return b.score - a.score
    }).splice(0, 10)
    
    scores.forEach(score => {
      const scoreLi = document.createElement('li')
      scoreLi.textContent = `${score.initials} ${score.score}`
      highScoresUl.appendChild(scoreLi)
    })
    document.querySelector('.game-space').innerHTML = ''
    document.querySelector('.game-space').appendChild(highScoresUl)
  })
}

const getHighScores = () => {
  return JSON.parse(localStorage.getItem('scores')) || []
}