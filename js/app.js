document.querySelector("#dark-mode-toogle").addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
    const isDarkMode = document.body.classList.contains("dark");
    localStorage.setItem("darkmode", isDarkMode );
    //change mobile status bar color
    document.querySelector('meta[name="theme-color"').setAttribute("content", isDarkMode ? "#1a1a2e" 
    :
    "#fff");
})

//Initial value

//Screens

const start_screen = document.querySelector('#start-screen');
const game_screen = document.querySelector('#game-screen');
const pause_screen = document.querySelector('#pause-screen');
const result_screen = document.querySelector('#result-screen');
//
const cells = document.querySelectorAll(".main-grid-cell");

const nameInput = document.querySelector("#input-name");

const number_inputs = document.querySelectorAll(".number");

const player_name = document.querySelector("#player-name");
const game_level =  document.querySelector("#game-level");
const game_time = document.querySelector("#game-time");

const result_time = document.querySelector("#result-time");

let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];

let timer = null;
let pause = false; 
let seconds = 0;

let su = undefined;
let su_answer = undefined;

let selected_cell = -1;
//


const getGameInfo= ()=> JSON.parse(localStorage.getItem("game"));

//add space for each 9 cells
const initGameGrid = ()=>{
    let index = 0;

    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        let row = Math.floor(i/CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;
        if(row === 2 || row === 5) cells[index].style.marginBottom = "10px"; 
        if(col === 2 || col === 5) cells[index].style.marginRight = "10px";

        index++;
    }
}
//

const setPlayerName =(name)=> localStorage.setItem("player_name", name);
const getPlayerName = () => localStorage.getItem("player_name");

const showTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11,8 );

const clearSudoku = ()=>{
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++){
        cells[i].innerHTML = "";
        cells[i].classList.remove("filled");
        cells[i].classList.remove("selected");
    }
}

const initSudoku = ()=>{
    //clear old sudoku 
    clearSudoku(); 
    resetBg();

    //generate Sudoku 
    su = sudokuGen(level);
    su_answer = [...su.question];

    seconds = 0;

    saveGameInfo();

    //show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute("data-value", su.question[row][col]);

        if(su.question[row][col] !== 0 ){
            cells[i].classList.add("filled");
            cells[i].innerHTML = su.question[row][col];
        }
    }
}

const loadSudoku = ()=>{
    let game = getGameInfo();
    game_level.innerHTML = CONSTANT.LEVEL_NAME[game.level];

    su = game.su;

    su_answer = su.answer;

    seconds = game.seconds;
    game_time.innerHTML =  showTime(seconds);

    levelIndex = game.level;

    //show sudoku to div
    for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
        let row = Math.floor(i / CONSTANT.GRID_SIZE);
        let col = i % CONSTANT.GRID_SIZE;

        cells[i].setAttribute("data-value", su_answer[row][col]);
        cells[i].innerHTML = su_answer[row][col] !== 0 ? su_answer[row][col] : "" ; 

        if(su.question[row][col] !== 0 ){
            cells[i].classList.add("filled");
        }
    }

}

const hoverBg = (index)=>{
    let row = Math.floor(index/ CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE; 

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i <CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j <CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)]
            cell.classList.add("hover");
        }
        
    }
    let step = 9
    while (index - step >= 0){
        cells[index - step].classList.add("hover");
        step += 9; 
    }

    step = 9;
    while (index + step <81){
        cells[index + step].classList.add("hover");
        step += 9; 
    }

    step = 1;
    while (index - step >= 9*row){
        cells[index - step].classList.add("hover");
        step += 1; 
    }

    step = 1;
    while (index + step < 9*row + 9){
        cells[index + step].classList.add("hover");
        step += 1; 
    }
}

const resetBg = ()=>{
    cells.forEach(e =>  e.classList.remove("hover"));
}

const checkError = (value)=>{
    const addError = (cell) =>{
        if(parseInt(cell.getAttribute("data-value")) === value  ){
            cell.classList.add("error");
            cell.classList.add("cell-error");
            setTimeout(() => {
                cell.classList.remove("cell-error");
            }, 500);
        }
    }

    let index = selected_cell;

    let row = Math.floor(index/ CONSTANT.GRID_SIZE);
    let col = index % CONSTANT.GRID_SIZE; 

    let box_start_row = row - row % 3;
    let box_start_col = col - col % 3;

    for (let i = 0; i <CONSTANT.BOX_SIZE; i++) {
        for (let j = 0; j <CONSTANT.BOX_SIZE; j++) {
            let cell = cells[9 * (box_start_row + i) + (box_start_col + j)]
            if(! cell.classList.contains("selected")) addError(cell);
        }
        
    }
    let step = 9
    while (index - step >= 0){
        addError(cells[index - step]);
        step += 9; 
    }

    step = 9;
    while (index + step <81){
        addError(cells[index + step]);
        step += 9; 
    }

    step = 1;
    while (index - step >= 9*row){
        addError(cells[index - step]);
        step += 1; 
    }

    step = 1;
    while (index + step < 9*row + 9){
        addError(cells[index + step]);
        step += 1; 
    }
}

const removeError =()=> cells.forEach(e => e.classList.remove("error"));

const saveGameInfo =()=>{
    let game = {
        level: levelIndex,
        seconds: seconds, 
        su: {
            original: su.original,
            question: su.question,
            answer: su_answer
        }
    }
    localStorage.setItem("game", JSON.stringify(game));
}

const removeGameInfo =  ()=>{
    localStorage.removeItem("game");
    document.querySelector("#btn-continue").style.display = "none";
}

const isGameWin = ()=> sudokuCheck(su_answer);

const showResult = () => {
    clearInterval(timer);
    result_screen.classList.add('active');
    result_time.innerHTML = showTime(seconds);
}


const initNumberInputEvent = () => {
    number_inputs.forEach((e, index) =>{
        e.addEventListener("click", ()=>{
            if (!cells[selected_cell].classList.contains("filled")){
                cells[selected_cell].innerHTML = index + 1;
                cells[selected_cell].setAttribute("data-value", index + 1);

                let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
                let col = selected_cell % CONSTANT.GRID_SIZE; 
                su_answer[row][col] = index +1;
                //save game
                saveGameInfo();
                removeError();
                checkError(index + 1);
                cells[selected_cell].classList.add("zoom-in");
                setTimeout(() => {
                    cells[selected_cell].classList.remove("zoom-in");
                }, 500);

                //check game win
                if(isGameWin()){
                    removeGameInfo();
                    showResult();
                }
            }
        })
    })
}


const initCellsEvent = ()=>{
    cells.forEach((e, index)=>{
        e.addEventListener("click",()=>{
            if(!e.classList.contains("filled")){
                cells.forEach(e => e.classList.remove("selected"));

                selected_cell = index;
                e.classList.remove("error");
                e.classList.add("selected");
                resetBg();
                hoverBg(index);
            }
        } )
    })
}

const startGame = ()=>{
    start_screen.classList.remove("active");
    game_screen.classList.add("active");

    player_name.innerHTML = nameInput.value.trim(); 
    setPlayerName(nameInput.value.trim());

    game_level.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];

    // seconds = 0;
    showTime(seconds);

    timer = setInterval(() => {
        if(!pause){
            seconds = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000);

}

const returnStartScreen = ()=>{
    clearInterval(timer);
    pause = false; 
    seconds= 0;
    start_screen.classList.add("active"); 
    game_screen.classList.remove("active");
    pause_screen.classList.remove("active");
    result_screen.classList.remove("active");
}

//add button event
document.querySelector("#btn-level").addEventListener("click", (e)=>{
    levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length -1 ? 0 : levelIndex + 1;
    level = CONSTANT.LEVEL[levelIndex];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];
});

document.querySelector("#btn-play").addEventListener("click", ()=> {
    if(nameInput.value.trim().length >0 ){
        initSudoku();
        startGame();
    }else{
        nameInput.classList.add("input-error");
        setTimeout(() => {
            nameInput.classList.remove("input-error");
            nameInput.focus();
        }, 500);
    }
});

document.querySelector("#btn-continue").addEventListener("click", ()=> {
    if(nameInput.value.trim().length >0 ){
        loadSudoku();
        startGame();
    }else{
        nameInput.classList.add("input-error");
        setTimeout(() => {
            nameInput.classList.remove("input-error");
            nameInput.focus();
        }, 500);
    }
});

document.querySelector('#btn-pause').addEventListener('click', () => {
    pause_screen.classList.add('active');
    pause = true;
});

document.querySelector('#btn-resume').addEventListener('click', () => {
    pause_screen.classList.remove('active');
    pause = false;
});

document.querySelector('#btn-new-game').addEventListener('click', () => {
    returnStartScreen();
});

document.querySelector('#btn-new-game-2').addEventListener('click', () => {
    console.log('object')
    returnStartScreen();
});

document.querySelector("#btn-delete").addEventListener("click", ()=>{
    cells[selected_cell].innerHTML = "";
    cells[selected_cell].setAttribute("data-value", 0);

    let row = Math.floor(selected_cell / CONSTANT.GRID_SIZE);
    let col = selected_cell % CONSTANT.GRID_SIZE;

    su_answer[row][col] = 0;

    removeError();

});

//

const init = ()=>{
    const darkmode = JSON.parse(localStorage.getItem("darkmode"));
    document.body.classList.add(darkmode ? "dark" : "light");
    document.querySelector('meta[name="theme-color"').setAttribute("content", darkmode ? "#1a1a2e" 
    :
    "#fff");

    const game = getGameInfo();

    document.querySelector("#btn-continue").style.display = game ? "grid" : "none";

    initGameGrid();
    initCellsEvent();
    initNumberInputEvent();

    if(getPlayerName()){
        nameInput.value = getPlayerName();
    }else{
        nameInput.focus();
    }
}

init();