
const bgAudio = new Audio("./bgSounds/MushroomsLife.mp3");
const buttonAudio = new Audio("./bgSounds/Button_Press.mp3");
const inputAudio = new Audio("./bgSounds/Drawing_Pencil.mp3");
const winAudio = new Audio("./bgSounds/Win1.mp3");

ip_address_for_localhost = "http://localhost:3000/";
ip_address_private = "http://192.168.0.55:3000/";

const socket = io.connect(ip_address_private);
// let roomId = parseInt(prompt("enter room ID: "));
let box = document.querySelectorAll(".box");
let arr = Array.from(box).fill(null);
let winBox = Array.from(box);
let turn = 'X';
let restartBTN = document.getElementById("restart");
let sb = document.querySelector(".scoreBoard");
let turnShow = document.querySelector(".showTurn");
let clickable = document.querySelector(".container");
let roomButtons = document.querySelector(".connect");
let mainDiv = document.querySelector(".main");
let waitBanner = document.querySelector(".waitingBanner");
let mobileDevices = window.matchMedia("(min-width: 320px)" && "(max-width: 420px)");
let tabletDevices = window.matchMedia("(min-width: 421px)" && "(max-width: 1300px)");
let newRoom = document.getElementById("newRoom");
let gamecode = document.getElementById("gamecode");
let joinBtn = document.getElementById("join");
const winSets = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
]

let roomId;
let clientID; 


waitBanner.style.display = "none";
clickable.style.display = "none";
restartBTN.style.display = "none";


newRoom.addEventListener('click', ()=>{
    buttonAudio.play();
    roomId = Math.round(Math.random()*10000);
    gamecode.value = roomId;
    newRoom.disabled = true;
    newRoom.style.backgroundColor = "gray";
    gamecode.disabled = true;
    joinBtn.disabled = true;
    joinBtn.style.backgroundColor = "gray";
    console.log(roomId);
    socket.emit('join', roomId);
})

joinBtn.addEventListener('click', ()=>{
    buttonAudio.play();
    roomId = parseInt(gamecode.value);
    joinBtn.disabled = true;
    joinBtn.style.backgroundColor = "gray";
    newRoom.disabled = true;
    newRoom.style.backgroundColor = "gray";
    gamecode.disabled = true;
    console.log(roomId);
    socket.emit('join', roomId);
})


socket.on('serverMsg', (socketID)=>{
    console.log(socketID);
    clientID = socketID;
})

socket.on('roomError', ()=>{
    alert("Please Enter a valid Room ID");
    location.reload();
})

socket.on('roomFull',()=>{
    alert("The Desired Room is full\nPlease Create another room");
    location.reload();
})

socket.on('waiting', ()=>{
    waitBanner.style.display = "";
})

socket.on('createBoard',()=>{
    bgAudio.play();
    bgAudio.loop = true;
    waitBanner.style.display = "none";
    if(mobileDevices.matches){
        roomButtons.style.top = "105%";
    }
    else if(tabletDevices.matches){
        mainDiv.style.left = "65%"
        roomButtons.style.left = "-50%";
        turnShow.style.left = "-25%";
    }
    else{
        roomButtons.style.left = "-60%";
    }
    clickable.style.display = "";
    // restartBTN.style.pointerEvents = "none";
})



box.forEach((element) => {
    element.addEventListener('click', put);
})

restartBTN.addEventListener('click', restartGame);


function put(element) {
    inputAudio.play();
    const id = element.target.id;
    if (arr[id] == null) {
        arr[id] = turn;
        // console.log(winBox[id].innerText);
        element.target.innerText = turn;
        socket.emit('play',turn, id, roomId);
        turnover();
        socket.emit('gameState', clientID, roomId);
        draw();
        win();

    }
}

socket.on('updateGame', (turn, id)=>{
    inputAudio.play();
    arr[id] = turn;
    winBox[id].innerText = turn;
    turnover();
})

function turnover() {
    turn = turn === 'X' ? 'O' : 'X';
}

function restart(){
    buttonAudio.play();
    arr.fill(null);
    box.forEach((box) => {
        box.innerText = "";
    })
    clickable.style.pointerEvents = "auto";
    restartBTN.style.display = "none";
    sb.innerText = "";
    turnShow.style.display = "";
    turnShow.innerText = "";
    winBox.forEach((e) => {
        e.style.backgroundColor = "";
    })
    turn = 'X';
}

function restartGame() {
    socket.emit('restart', roomId);
    socket.emit('boardOnOff', roomId);
    restart();
}

socket.on('reset', ()=>{
    restart();
})



function win() {

    winSets.forEach((element) => {
        // console.log(arr[element[0]], arr[element[1]]);

        if ((arr[element[0]] === arr[element[1]]) && (arr[element[1]] === arr[element[2]]) && (arr[element[0]] !== null)) {
            for (let i = 0; i < 3; i++) {
                winBox[element[i]].style.backgroundColor = "rgba(21, 255, 0, 0.486)";
                socket.emit('win', element, roomId, arr[element[0]]);
            }
            winAudio.play();
            turnShow.style.display="none";
            sb.innerText = `'${arr[element[0]]}' Win 🎉`;
            // console.log(element);
            restartBTN.style.display = "";
            clickable.style.pointerEvents = "none";
        }
    })
}

function draw(){
    if(arr.indexOf(null) === -1){
        socket.emit('onDraw', roomId);
        turnShow.style.display="none";
        sb.innerText = `Match Draw 🤗`;
        clickable.style.pointerEvents = "none";
        restartBTN.style.display = "";
        // console.log('Draw');
    }
}

socket.on('draw', ()=>{
    turnShow.style.display="none";
    sb.innerText = `Match Draw 🤗`;
    clickable.style.pointerEvents = "none";
    restartBTN.style.display = "";
})

socket.on('winArray', (element, sign)=>{
    for (let i = 0; i < 3; i++) {
        winBox[element[i]].style.backgroundColor = "rgba(21, 255, 0, 0.486)";
    }
    winAudio.play();
    turnShow.style.display="none";
    sb.innerText = `'${sign}' Win 🎉`;
    // console.log(element);
    clickable.style.pointerEvents = "none";
    restartBTN.style.display = "";
})

socket.on('off', ()=>{
    clickable.style.pointerEvents = "none";
    turnShow.innerText = "Opponent's Turn";
})


socket.on('on', ()=>{
    clickable.style.pointerEvents = "auto";
    turnShow.innerText = "Your Turn";
})