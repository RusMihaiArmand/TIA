var api = require('./src/api.js').app;
var users = require('./src/users.json');
const gamesPath = './src/games.json';
const usersPath = './src/users.json';
const borrowPath = './src/borrowings.json';
var fs = require('fs');




api.get('/', function (request, response) {
  response.json('NodeJS REST API');
});





api.listen(3000, function () {
  console.log('Server running @ localhost:3000');
});







//-------- GAMES

api.get('/games', function (request, response) {
    response.json(getGames());
});

api.get('/games/:id', function (request, response) {
    let game = getGameById(request.params.id);
    if (game) response.json(game);
    else response.json('not found');
});

function getGames() {
    let gamesList = [];
    try {
        gamesList = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));
    } catch (err) {
        console.error(err);
        return false;
    }
    return gamesList;
}

function getGamesMaxId(gamesList) {
    let max = 0;
    for (var i = 0; i < gamesList.length; i++) {
        if (max < parseInt(gamesList[i].id)) {
            max = parseInt(gamesList[i].id);
        }
    }
    return max;
}

function getGameById(id) {
    let gamesList = getGames();
    let selectedGame = null;
    for (var i = 0; i < gamesList.length; i++) {
        if (id == gamesList[i].id) selectedGame = gamesList[i];
    }
    return selectedGame;
}

api.put('/games', function (request, response) {
    saveGame(request.body);
    response.json('finished');
});

function saveGame(game) {
    let gamesList = getGames();
    let maxIdTxt = getGamesMaxId(gamesList); 
    let maxId = parseInt(maxIdTxt);
    game.id = (maxId + 1).toString();
    gamesList.push(game);
    try {
        fs.writeFileSync(gamesPath, JSON.stringify(gamesList));
    } catch (err) {
        console.error(err);
    }
}

api.post('/games', function (request, response) {

    let game = request.body;
    let gamesList = getGames();
    for (let i = 0; i < gamesList.length; i++) {
        if (gamesList[i].id === game.id) {
            gamesList[i] = game;
        }
    }


    try {
        fs.writeFileSync(gamesPath, JSON.stringify(gamesList));
    } catch (err) {
        console.error(err)
    }
    finally {
        response.json('finished');
    }
});

api.delete('/games/:index', function (request, response) {

    let id = request.params.index;
    let indDel = -1;
    let gamesList = getGames();

    for (let i = 0; i < gamesList.length; i++) {
        if (gamesList[i].id === id) {
            indDel = i;
        }
    }

    if (indDel >= 0) {

        gamesList.splice(indDel, 1);
    }


    try {
        fs.writeFileSync(gamesPath, JSON.stringify(gamesList));
    } catch (err) {
        console.error(err)
    }
    finally {
        response.json('finished');
    }

});







//--------BORROW

api.get('/borrowings', function (request, response) {
    response.json(getBorr());
});

api.get('/borrowings/:id', function (request, response) {
    let borr = getBorrById(request.params.id);
    if (borr) response.json(borr);
    else response.json('not found');
});

function getBorrById(id) {
    let borrList = getBorr();
    let selectedBorr = null;
    for (var i = 0; i < borrList.length; i++) {
        if (id == borrList[i].gameid) selectedBorr = borrList[i];
    }
    return selectedBorr;
}


function getBorr() {
    let borrList = [];
    try {
        borrList = JSON.parse(fs.readFileSync(borrowPath, 'utf8'));
    } catch (err) {
        console.error(err);
        return false;
    }
    return borrList;
}

api.get('/borrowings/:id', function (request, response) {
    let userN = request.params.id;
    var ctr = 0;
    let borrList = getBorr();

        for (var i = 0; i < borrList.length; i++) {
            if (userN == borrList[i].user)
            {
                ctr = ctr + 1;
            }
        }
   
        return ctr;
    
});



api.put('/borrowings', function (request, response) {
    saveBorr(request.body);
    response.json('finished');
});

function saveBorr(borr) {
    let borrList = getBorr();
    let gamesList = getGames();
    let userList = getUsers();

    let ok = false;
    var gameIndex = -1;

    for (var i = 0; i < gamesList.length; i++) {
        if (borr.gameid == gamesList[i].id) {
            ok = true;
            gameIndex = i;
        }
    }

    let ok2 = false;
    for (var i = 0; i < userList.length; i++) {
        if (borr.user == userList[i].name) {
            ok2 = true;
        }
    }


    for (var i = 0; i < borrList.length; i++) {
        if ( borr.gameid == borrList[i].gameid)
        {
            ok = false;
        }
    }


    


    let count = 0;
    for (let i = 0; i < borrList.length; i++) {
        if (borr.user == borrList[i].user) {
            count = count + 1;

        }
    }

    if (count >= 3)
    {
        ok = false;
    }


    if (ok == true && ok2 == true) {

        borrList.push(borr);
        try {
            fs.writeFileSync(borrowPath, JSON.stringify(borrList));


            gamesList[gameIndex].status = "unavailable";
            fs.writeFileSync(gamesPath, JSON.stringify(gamesList));


        } catch (err) {
            console.error(err);
        }
    }
}


api.delete('/borrowings/:index', function (request, response) {

    let id = request.params.index;
    let indDel = -1;
    let borrList = getBorr();

    for (let i = 0; i < borrList.length; i++) {
        if (borrList[i].gameid === id) {
            indDel = i;
        }
    }

    if (indDel >= 0) {

        borrList.splice(indDel, 1);
    }


    let gamesList = getGames();

    var gameIndex = -1;

    for (var i = 0; i < gamesList.length; i++) {
        if (id == gamesList[i].id) {
            gameIndex = i;
        }
    }



    try {
        fs.writeFileSync(borrowPath, JSON.stringify(borrList));
        gamesList[gameIndex].status = "available";
        fs.writeFileSync(gamesPath, JSON.stringify(gamesList));
    } catch (err) {
        console.error(err)
    }
    finally {
        response.json('finished');
    }
    

});





//-------- USER

api.get('/users', function (request, response) {
    response.json(getUsers());
});

api.get('/users/:id', function (request, response) {
    let user = getUserByName(request.params.id);
    if (user) response.json(user);
    else response.json('not found');
});

function getUsers() {
    let userList = [];
    try {
        userList = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    } catch (err) {
        console.error(err);
        return false;
    }
    return userList;
}


function getUserByName(nam) {
    let userList = getUsers();
    let selectedUser = null;
    for (var i = 0; i < userList.length; i++) {
        if (nam == userList[i].name) selectedUser = userList[i];
    }
    return selectedUser;
}

api.put('/users', function (request, response) {
    saveUser(request.body);
    response.json('finished');
});

function saveUser(user) {
    let userList = getUsers();
    let ok = true;
    for (var i = 0; i < userList.length; i++) {
        if (user.name == userList[i].name) ok = false;
    }

    if (ok == true) {
        userList.push(user);
        try {
            fs.writeFileSync(usersPath, JSON.stringify(userList));
        } catch (err) {
            console.error(err);
        }
    }

}

api.post('/users', function (request, response) {

    let user = request.body;

    var obj = {
        name: user.name,
        password: user.newpassword
    }

    let userList = getUsers();
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].name === user.name && userList[i].password === user.password) {
            userList[i] = obj;
        }
    }


    try {
        fs.writeFileSync(usersPath, JSON.stringify(userList));
    } catch (err) {
        console.error(err)
    }
    finally {
        response.json('finished');
    }
});

api.delete('/users/:index', function (request, response) {

    let num = request.params.index;
    let indDel = -1;
    let userList = getUsers();

    for (let i = 0; i < userList.length; i++) {
        if (userList[i].name === num) {
            indDel = i;
        }
    }

    if (indDel >= 0) {
        userList.splice(indDel, 1);
    }


    try {
        fs.writeFileSync(usersPath, JSON.stringify(userList));
    } catch (err) {
        console.error(err)
    }
    finally {
        response.json('finished');
    }

});



