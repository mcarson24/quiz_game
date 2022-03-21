document.querySelector('#start-game').addEventListener('click', () => {
  console.log('game starts')
  const questions = randomizeQuestionOrder()

  let round = 0

  displayQuestion(questions[round])
})

const randomizeQuestionOrder = () => {
  return questions.sort(() => Math.random() - .5)
}

const displayQuestion = question => {
  const questionContainer = document.createElement('div')
  const questionHeader = document.createElement('h2')
  questionContainer.className = 'question'
  questionHeader.textContent = question.text
  questionContainer.appendChild(questionHeader)

  // Display the choices
  const choiceList = document.createElement('ul')
  question.choices.forEach(choice => {
    const li = document.createElement('li')
    li.textContent = choice.text
    li.setAttribute('data-correct', choice.correct || false)
    choiceList.appendChild(li)
  })
  questionContainer.appendChild(choiceList)
  questionContainer.addEventListener('click', e => {
    if (e.target.matches('li') && e.target.dataset.correct === 'true') {
      console.log('thats the correct answer!')
    }
  })
  document.querySelector('.game-space').appendChild(questionContainer)
}

