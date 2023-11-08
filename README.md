# Multiplayer Tic-Tac-Toe Game

It is a Multiplayer tic-tac-toe game where two players can play inside a room with a room id.

![version](https://img.shields.io/badge/version-1.0.0-yellow.svg)
![version](https://img.shields.io/badge/npm-8.19.3-blue.svg)

## Tech Stack

**Frontend** :
<table> 
    <th><a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a></th>
      <th><a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> </th>
      <th><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/></a></th>
</table>

**Backend** :
<table>
<th><a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a></th>
      <th><a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> </th>
<th><a href="" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Socket-io.svg/1024px-Socket-io.svg.png" alt="socket-io" width="40" height="40"/></a></th>
</table>


## Installation

Install Multiplayer tic-tac-toe game with npm

**Go to the server folder -> run the index.js file**

To run the index.js file: 
```bash
npm install
npm run start
```

**Output terminal** :
```bash
PS C:\username\Tic Tac Toe Single Player BETA\server> npm run start

> server@1.0.0 start
> nodemon index.js  

[nodemon] 2.0.22
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json  
[nodemon] starting `node index.js`
listening on PORT :3000
```

## Code Snaps  :
**Code to check if a room already has two players or not**  :

When a player joins a room with corresponding room id it will check if that room already has two players or not. If yes it will return room full message. 

```node
socket.on('join', (roomId) => {
        let set = new Set(io.sockets.adapter.rooms.get(roomId));
        console.log(set);
        console.log(roomId);

        socket.emit('serverMsg', socket.id);
        if (set.size < 2 && roomId !== null) {
            socket.join(roomId);
            console.log(`A user joined the room ${roomId}`);
            let arr = Array.from(io.sockets.adapter.rooms.get(roomId));
            if (set.size === 1) {
                io.to(roomId).emit('createBoard');
                io.to(arr[0]).emit('on');
                io.to(arr[1]).emit('off');

            }
            else {
                io.to(roomId).emit('waiting');
            }
            console.log(set.size);
        }
        else if (roomId === null) {
            socket.emit('roomError');
        }
        else {
            socket.emit('roomFull');
        }

    })
```

## Screenshots

![screenshot 1](https://github.com/Aritra-in/Multiplayer-Tic-Tac-Toe-Game/assets/111588470/13423064-2b83-458e-90bb-725595b9a2a9)
![screenshot 2](https://github.com/Aritra-in/Multiplayer-Tic-Tac-Toe-Game/assets/111588470/dd1f15be-d7c2-4cfe-b205-fed1249d9eed)
![screenshot 3](https://github.com/Aritra-in/Multiplayer-Tic-Tac-Toe-Game/assets/111588470/57318cc8-43fa-480e-862b-177b60d11917)
![screenshot 4](https://github.com/Aritra-in/Multiplayer-Tic-Tac-Toe-Game/assets/111588470/1ce63847-5b6f-4c65-b8e7-c506033f3a0b)
![screenshot 5](https://github.com/Aritra-in/Multiplayer-Tic-Tac-Toe-Game/assets/111588470/1a66c178-7341-42b9-be34-72c3730ecbb8)


## License

[MIT](https://choosealicense.com/licenses/mit/)








