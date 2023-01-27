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

const nameInput = document.querySelector("#input-name");
const startScreen = document.querySelector("#start-screen"); 
let levelIndex = 0;
let level = CONSTANT.LEVEL[levelIndex];

//

document.querySelector("#btn-level").addEventListener("click", (e)=>{
    levelIndex = levelIndex + 1 > CONSTANT.LEVEL.length -1 ? 0 : levelIndex + 1;
    level = CONSTANT[levelIndex];
    e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex];
});

document.querySelector("#btn-play").addEventListener("click", ()=> {
    if(nameInput.value.trim().length >0 ){
        alert("Start Game");
    }else{
        nameInput.classList.add("input-error");
        setTimeout(() => {
            nameInput.classList.remove("input-error");
            nameInput.focus();
        }, 500);
    }
})

const getGameInfo= ()=> JSON.parse(localStorage.getItem("game"));

const init = ()=>{
    const darkmode = JSON.parse(localStorage.getItem("darkmode"));
    document.body.classList.add(darkmode ? "dark" : "light");
    document.querySelector('meta[name="theme-color"').setAttribute("content", darkmode ? "#1a1a2e" 
    :
    "#fff");

    const game = getGameInfo();

    document.querySelector("#btn-continue").style.display = game ? "grid" : "none";
}

init();