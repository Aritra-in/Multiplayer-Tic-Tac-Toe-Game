const socket = io.connect("http://192.168.0.53:3000/");
// let roomId = parseInt(prompt("enter room ID: "));
let box = document.querySelectorAll(".box");
let arr = Array.from(box).fill(null);
let winBox = Array.from(box);
let turn = 'X';
let restartBTN = document.getElementById("restart");
let sb = document.querySelector(".scoreBoard");
let clickable = document.querySelector(".container");
let roomButtons = document.querySelector(".connect");
let x = window.matchMedia("(min-width: 320px)" && "(max-width: 420px)");
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


clickable.style.display = "none";
restartBTN.style.display = "none";


newRoom.addEventListener('click', ()=>{
    roomId = Math.round(Math.random()*10000);
    gamecode.value = roomId;
    newRoom.disabled = true;
    newRoom.style.backgroundColor = "gray";
    gamecode.disabled = true;
    joinBtn.disabled = true;
    joinBtn.style.backgroundColor = "gray";
    socket.emit('join', roomId);
})

joinBtn.addEventListener('click', ()=>{
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
})

socket.on('roomFull',()=>{
    alert("The Desired Room is full\nPlease Create another room");
})

socket.on('createBoard',()=>{
    if(x.matches){
        roomButtons.style.top = "110%"
    }
    else{
        roomButtons.style.left = "-60%";
    }
    clickable.style.display = "";
    restartBTN.style.display = "";

})


box.forEach((element) => {
    element.addEventListener('click', put);
})

restartBTN.addEventListener('click', restartGame);


function put(element) {
    const id = element.target.id;
    if (arr[id] == null) {
        arr[id] = turn;
        // console.log(winBox[id].innerText);
        element.target.innerText = turn;
        socket.emit('play',turn, id, roomId);
        turnover();
        socket.emit('gameState', clientID, roomId);
        win();

    }
}

socket.on('updateGame', (turn, id)=>{
    winBox[id].innerText = turn;
    turnover();
})

function turnover() {
    turn = turn === 'X' ? 'O' : 'X';
}

function restart(){
    arr.fill(null);
    box.forEach((box) => {
        box.innerText = "";
    })
    clickable.style.pointerEvents = "auto";
    sb.innerText = "";
    winBox.forEach((e) => {
        e.style.backgroundColor = "";
    })
    turn = 'X';
}

function restartGame() {
    socket.emit('restart', roomId);
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
            sb.innerText = `'${arr[element[0]]}' Win`;
            console.log(element);
            clickable.style.pointerEvents = "none";
        }
    })
}

socket.on('winArray', (element, sign)=>{
    for (let i = 0; i < 3; i++) {
        winBox[element[i]].style.backgroundColor = "rgba(21, 255, 0, 0.486)";
    }
    sb.innerText = `'${sign}' Win`;
    console.log(element);
    clickable.style.pointerEvents = "none";
})

socket.on('off', ()=>{
    clickable.style.pointerEvents = "none";
})


socket.on('on', ()=>{
    clickable.style.pointerEvents = "auto";
})

