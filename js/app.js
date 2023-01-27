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

const start_screen = document.querySelector("#start-screen");
const game_screen = document.querySelector("#game-screen");
const pause_screen = document.querySelector("#pause-screen");
//
const cells = document.querySelectorAll(".main-grid-cell");

const nameInput = document.querySelector("#input-name");

const player_name = document.querySelector("#player-name");
const game_level =  document.querySelector("#game-level");
const game_time = document.querySelector("#game-time");

let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];

let timer = null;
let pause = false; 
let seconds = 0;

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

const startGame = ()=>{
    start_screen.classList.remove("active");
    game_screen.classList.add("active");

    player_name.innerHTML = nameInput.value.trim(); 
    setPlayerName(nameInput.value.trim());

    game_level.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];

    seconds = 0;

    timer = setInterval(() => {
        if(!pause){
            seconds = seconds + 1;
            game_time.innerHTML = showTime(seconds);
        }
    }, 1000);

}

const returnStartSreen = ()=>{
    clearInterval(timer);
    pause = false; 
    seconds= 0;
    start_screen.classList.add("active"); 
    game_screen.classList.remove("active");
    pause_screen.classList.remove("active");
}

//add button event
document.querySelector("#btn-level").addEventListener("click", (e)=>{
    levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length -1 ? 0 : levelIndex + 1;
    level = CONSTANT.LEVEL[levelIndex];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];
});

document.querySelector("#btn-play").addEventListener("click", ()=> {
    if(nameInput.value.trim().length >0 ){
        startGame();
    }else{
        nameInput.classList.add("input-error");
        setTimeout(() => {
            nameInput.classList.remove("input-error");
            nameInput.focus();
        }, 500);
    }
});

document.querySelector("#btn-pause").addEventListener("click", ()=>{
    pause_screen.classList.add("active");
    pause = true;
});

document.querySelector("#btn-resume").addEventListener("click", ()=>{
    pause_screen.classList.remove("active");
    pause = false;
});

document.querySelector("#btn-new-game").addEventListener("click", ()=>{
    returnStartSreen();
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

    if(getPlayerName()){
        nameInput.value = getPlayerName();
    }else{
        nameInput.focus();
    }
}

init();