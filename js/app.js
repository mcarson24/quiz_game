let timeLeft = 60
let round = 0
let countdown

const gameSpace = document.querySelector('.game-space')
const startButton = document.querySelector('#start-game')
const timer = document.querySelector('#timer')

const randomizeQuestionOrder = () => {
  return questions.sort(() => Math.random() - .5)
}

const randomQuestions = randomizeQuestionOrder()

startButton.addEventListener('click', e => {
  e.target.style = 'display: none;'
  startTimer()
  displayQuestion(randomQuestions[round])
})

const startTimer = () => {
  countdown = setInterval(() => {
    timer.textContent = timeLeft
    if (timeLeft <= 0) {
      gameLoss()
      timer.textContent = 0
    } else {
      timeLeft--
    }
  }, 1000)
}

const displayQuestion = question => {
  // If we reach the end of the questions array, then the user has
  // correctly answered all of the questions and they win!
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
  choiceList.className = 'choices'
  question.choices.forEach((choice, i) => {
    const li = document.createElement('li')
    li.classList.add('question-choice')
    li.textContent = choice.text
    li.setAttribute('data-index', i)
    choiceList.appendChild(li)
    li.addEventListener('click', e => {
      // We'll be nice and not let the user select the same incorrect answer after already selecting it once.
      if (e.target.className.includes('incorrect')) return
      if (e.target.matches('li') && randomQuestions[round].choices[i].correct) {
        // Advance to next question
        round++
        displayQuestion(randomQuestions[round])
      }
      else {
        timeLeft -= 15 // Decrement score/timer
        e.target.classList.add('incorrect')
      }
    })
  })
  questionContainer.appendChild(choiceList)
  gameSpace.appendChild(questionContainer)
}

// Logic to handle if the user lost.
const gameLoss = () => {
  clearInterval(countdown)
  timeLeft = 0
  gameSpace.innerHTML = ''
  const losingMessage = document.createElement('h2')
  losingMessage.textContent = 'Sorry, better luck next time!'
  losingMessage.classList.add('text-center')
  gameSpace.appendChild(losingMessage)
}

// Logic to handle if the user won.
const gameWin = () => {
  console.log('win')
  clearInterval(countdown)
  timer.textContent = timeLeft
 
  toggle('.winning-message')
  toggle('.question')
  toggle('#initials-form')
  document.addEventListener('submit' , e => {
    e.preventDefault()
    const input = document.querySelector('#initials-input').value.trim()
    if (input.length !== 3) {
      const errorSpan = document.createElement('span')
      errorSpan.textContent = `Please enter three characters. ex: 'BCS'`
      errorSpan.className = 'error'
      gameSpace.appendChild(errorSpan)
      return
    }

    let scores = getHighScores()
    scores.push({
      initials: input.toUpperCase(),
      score: timeLeft > 0 ? timeLeft : 0
    })
    localStorage.setItem('scores', JSON.stringify(scores))
    toggle('#highScores')
    const highScoresTable = document.querySelector('#highScores > tbody')

    scores = scores.sort((a, b) => {
      return b.score - a.score
    }).splice(0, 10)
    
    scores.forEach(score => {
      const scoreRow = document.createElement('tr')
      if (score.initials === input.toUpperCase()) scoreRow.classList.add('currentPlayer')
      const playerData = document.createElement('td')
      playerData.textContent = score.initials
      const scoreData = document.createElement('td')
      scoreData.textContent = score.score
      scoreRow.appendChild(playerData)
      scoreRow.appendChild(scoreData)
      highScoresTable.appendChild(scoreRow)
    })
    gameSpace.innerHTML = ''
  })
}

const getHighScores = () => {
  return JSON.parse(localStorage.getItem('scores')) || []
}

const toggle = selector => {
  const el = document.querySelector(selector)
  Array.from(el.classList).includes('hidden') ? el.classList.remove('hidden') : el.classList.add('hidden')
}