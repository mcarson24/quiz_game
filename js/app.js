let timeLeft = 60
let round = 0

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
  let countdown = setInterval(() => {
    document.querySelector('#timer').textContent = timeLeft
    if (timeLeft === 0) {
      // game ends
      clearInterval(countdown)
    } else {
      timeLeft--
    }
  }, 1000)
}

const displayQuestion = question => {
  if (!question) {
    console.log('all over')
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
        console.log('thats the correct answer!')
        // Don't decrement score/timer
      } else {
        // Decrement score/timer
        timeLeft -= 10
      }
      // advance to next question
      round++
      displayQuestion(randomQuestions[round])
    })
  })
  questionContainer.appendChild(choiceList)
  document.querySelector('.game-space').appendChild(questionContainer)
}

