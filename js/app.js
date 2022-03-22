let timeLeft = 60
let round = 0
let countdown

const gameSpace = document.querySelector('.game-space')
const startButton = document.querySelector('#start-game')

const randomizeQuestionOrder = () => {
  return questions.sort(() => Math.random() - .5)
}

const randomQuestions = randomizeQuestionOrder()
console.log(randomQuestions)

startButton.addEventListener('click', e => {
  e.target.style = 'display: none;'
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
      // We'll be nice and not let the user select the same wrong answer after already selecting it once.
      if (e.target.className.includes('wrong')) return

      if (e.target.matches('li') && randomQuestions[round].choices[i].correct) {
        // Advance to next question
        round++
        displayQuestion(randomQuestions[round])
      }
      else {
        timeLeft -= 20 // Decrement score/timer
        const thing = document.querySelector(`[data-index="${i}"]`)
        thing.classList.add('wrong')
        choiceList.children[i] = thing
      }
    })
  })
  questionContainer.appendChild(choiceList)
  gameSpace.appendChild(questionContainer)
}

const gameLoss = () => {
  clearInterval(countdown)
  timeLeft = 0
  gameSpace.innerHTML = ''
  const losingMessage = document.createElement('h2')
  losingMessage.textContent = 'Sorry, better luck next time!'
  gameSpace.appendChild(losingMessage)
}

const gameWin = () => {
  clearInterval(countdown)
  const initialsForm = document.createElement('form')
  initialsForm.setAttribute('id', 'initials-form')
  const initialsInput = document.createElement('input')
  initialsInput.setAttribute('placeholder', 'Enter your initials. 3 Characters, please')
  initialsForm.appendChild(initialsInput)
  gameSpace.innerHTML = ''
  gameSpace.appendChild(initialsForm)

  document.addEventListener('submit' , e => {
    e.preventDefault()
    if (initialsInput.value.trim().length !== 3) {
      const errorSpan = document.createElement('span')
      errorSpan.textContent = `Please enter three characters. ex: 'BCS'`
      errorSpan.className = 'error'
      gameSpace.appendChild(errorSpan)
      return
    }
    let scores = getHighScores()
    scores.push({
      initials: initialsInput.value.toUpperCase(),
      score: timeLeft > 0 ? timeLeft : 0
    })
    localStorage.setItem('scores', JSON.stringify(scores))
    document.querySelector('#highScores').classList.remove('hide')
    const highScoresTable = document.querySelector('#highScores > tbody')

    scores = scores.sort((a, b) => {
      return b.score - a.score
    }).splice(0, 10)
    
    scores.forEach(score => {
      const scoreRow = document.createElement('tr')
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