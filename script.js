const Player = (sign) => {
    this.sign = sign;

    const getSign = () => sign;

    return {
        getSign,
    }
}


const displayControllerModule = (() => {
    const fields = document.querySelectorAll(".not-active");
    const message= document.getElementById("message");
    const restartBtn = document.getElementById("restartBtn");


    fields.forEach(field =>
        field.addEventListener("click", (e) => {
            if(!checkIfActive(e.target)) {
                modifyFieldstatus(e.target)
                gameControllerModule.playRound(e.target.dataset.index)
                gameBoardModule.drawSign(e.target);
            }
        })
    )  
    
    const checkIfActive = (target) => {
        return target.classList.contains("active")
    }

    const modifyFieldstatus = (target) => {
        const numField = target.dataset.index;
        fields[numField].classList.add("active")
    }

    const setMessage = (text) => {
        message.textContent = text;
    }

    const makeFieldsUnclickable = () => {
        fields.forEach(field => {
            field.classList.add("active");
        })
    }

    const resetTurnMessage = () => {
        message.textContent = "Player X's turn";
    }

    const resetFieldsClasses = () => {
        fields.forEach(field => { 
            field.classList.remove("active");
            field.innerHTML = "";
        })
    }

    restartBtn.addEventListener("click", () => {
       restartAll();
    })

    const restartAll = () => {
        resetTurnMessage();
        resetFieldsClasses();
        gameBoardModule.resetGameBoard();
        gameControllerModule.resetRounds()
    }
  
    return {
        setMessage,
        makeFieldsUnclickable,
    }
})();


const gameBoardModule = (() => {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let _currentSign = "X";

    const updateGameboard = (fieldIndex, sign) => {
        gameBoard[fieldIndex] = sign;
        _currentSign = sign;
    }

    const getUpdatedGameBoard = () => {
        return gameBoard;
    }
    
    const drawSign = (field)  => {
        field.innerHTML = _currentSign;
    }

    const resetGameBoard = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        _currentSign = "X";
    }

    return {
        gameBoard,
        updateGameboard,
        getUpdatedGameBoard,
        drawSign,
        resetGameBoard,
    }
})()


const gameControllerModule = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let _round = 1;
    let _gameOver = false;

    let gameBoard;    //I created these variables inside this module because if I import them from gameBoardModule their 
    let currentSign;  //value doesn't update after the reset 
    

    const playRound = (fieldIndex) => {
        gameBoardModule.updateGameboard(fieldIndex, getCurrentSign());

        if(checkWinner()) {
            displayControllerModule.setMessage(`Player ${getCurrentSign()} is the winner!`)
            displayControllerModule.makeFieldsUnclickable();
        }
        else if(_round === 9) {
            displayControllerModule.setMessage("It's a draw!");
        }
        else {
            _round++;
            displayControllerModule.setMessage(`Player ${getCurrentSign()}'s turn`)     
        }     
    }

    const getCurrentSign = () => {
        return (_round % 2 !== 0) ? playerX.getSign() : playerO.getSign();
    }

    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const checkWinner = () => {
        gameBoard = gameBoardModule.getUpdatedGameBoard();  
        currentSign = getCurrentSign();
        
        winConditions.forEach((item) => {
            if(gameBoard[item[0]] === currentSign && gameBoard[item[1]] === currentSign && gameBoard[item[2]] === currentSign) {
                _gameOver = true;
            }
        })
        return _gameOver;
    }

    const resetRounds = () => {
        _round = 1;
        _gameOver = false;
    }

    return {
        playRound,
        getCurrentSign,
        resetRounds,
    }
})()



