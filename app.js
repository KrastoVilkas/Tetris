document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  const previewSquares = document.querySelectorAll('.previewGrid div')
  const startBtn = document.querySelector('button')
  const scoreDisplay = document.querySelector('#result')
  const totalLines = document.querySelector('#totalLines')
  let squares = Array.from(grid.querySelectorAll('div'))
  const height = 20
  const width = 10
  const previewWidth = 4
  let score = 0
  let lines = 0
  let currentPosition = 4
  let currentIndex = 0
  let previewIndex = 0
  let nextRandom = 0
  let timerId



  //keycode:function assignments lurd
  function control(e){
    switch(e.keyCode){
      case 32:
        //while !frozen moveDown()
        break
      case 37:
        moveLeft()
        break
      case 38:
        rotateTetromino()
        break
      case 39:
        moveRight()
        break
      case 40:
        moveDown()
        break
    }
  }

  document.addEventListener('keyup', control)

  //Tetrominoes: 5 in total

  // 0: L tetromino
  //          ▢▢
  //          ▢
  //          ▢
  const tetrominoL = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [0, width, width+1, width+2]
  ]

  // 1: Z tetromino
  //       ▢▢
  //        ▢▢
  const tetrominoZ = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  // 2: T tetromino
  //          ▢
  //        ▢▢▢
  const tetrominoT = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  // 3: O tetromino
  //        ▢▢
  //       ▢▢
  const tetrominoO = [
    [0,1,width, width+1],
    [0,1,width, width+1],
    [0,1,width, width+1],
    [0,1,width, width+1]
  ]

  // 4: I tetromino
  //          ▢
  //          ▢
  //          ▢
  //          ▢
  const tetrominoI = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const theTetrominoes = [tetrominoL, tetrominoZ, tetrominoT, tetrominoO, tetrominoI]

  const previewTetrominoes = [
    [1, previewWidth+1, previewWidth*2+1, 2],
    [0, previewWidth, previewWidth+1, previewWidth*2+1],
    [1, previewWidth, previewWidth+1, previewWidth+2],
    [0,1,previewWidth, previewWidth+1],
    [1, previewWidth+1, previewWidth*2+1, previewWidth*3+1]
  ]

  //randomly select a tetromino
  let randomIndex = Math.floor(Math.random()*theTetrominoes.length)
  let currentRotation = 0
  let current = theTetrominoes[randomIndex][currentRotation]
  //console.log("randomIndex: " + randomIndex + " | currentRotation: " + currentRotation)

  //draw tetromino
  function drawTetromino(){
    current.forEach( index => {
      squares[currentPosition + index].classList.add('block')
    })
  }

  function eraseTetromino(){
    current.forEach( index => {
      squares[currentPosition + index].classList.remove('block')
    })
  }

  //move tetronimo down
  function moveDown(){
    eraseTetromino()
    currentPosition += width
    drawTetromino()
    freeze()
  }

//move left and prevent collisions with shapes moving left
function moveLeft(){
  eraseTetromino()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if(!isAtLeftEdge) currentPosition -= 1
  if(current.some(index => squares[currentPosition+index].classList.contains('block2'))){
    currentPosition +=1
  }
  drawTetromino()
}

//move right and prevent collisions with shapes moving right
function moveRight(){
  eraseTetromino()
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
  if(!isAtRightEdge) currentPosition += 1
  if(current.some(index => squares[currentPosition+index].classList.contains('block2'))){
    currentPosition -=1
  }
  drawTetromino()
}


  //rotate tetromino
  function rotateTetromino(){
    eraseTetromino()
    currentRotation ++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current =  theTetrominoes[randomIndex][currentRotation]
    drawTetromino()
  }



//display preview tetromino
function displayPreview(){
  previewSquares.forEach(square => {
    square.classList.remove('block')
  })
  previewTetrominoes[nextRandom].forEach(index => {
      previewSquares[previewIndex + index].classList.add('block')
  })
}

  //freeze()...if index >= squares.length
  function freeze(){
    //if block has settled
    if(current.some(index => squares[currentPosition + index + width].classList.contains('frozenBlock')
    || squares[currentPosition + index + width].classList.contains('block2'))){
      //make it block2
      current.forEach(index => squares[index + currentPosition].classList.add('block2'))
      //start new tetronimo
      randomIndex = nextRandom
      nextRandom = Math.floor(Math.random()* theTetrominoes.length)
      current = theTetrominoes[randomIndex][currentRotation]
      currentPosition = 4
      drawTetromino()
      displayPreview()
      gameOver()
      addScore()
    }
  }

  //start button
  startBtn.addEventListener('click', () => {
    if(timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      drawTetromino()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayPreview()
    }
  })

  //game over
  function gameOver(){
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))){
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

  //add score
  function addScore(){
    for(currentIndex = 0; currentIndex < 199; currentIndex += width) {
      const row = [
        currentIndex, currentIndex+1, currentIndex+2, currentIndex+3, currentIndex+4,
        currentIndex+5, currentIndex+6, currentIndex+7, currentIndex+8, currentIndex+9
      ]

      if(row.every(index => squares[index].classList.contains('block2'))){
        score += 10
        lines += 1
        scoreDisplay.innerHTML = score
        totalLines.innerHTML = lines
        row.forEach(index => {
          squares[index].classList.remove('block2') || squares[index].classList.remove('block')
        })
        //splice Array
        const squaresRemoved = squares.splice(currentIndex, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }











})
