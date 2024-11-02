var api = require('./src/api.js').app;
//var users = require('./src/users.json');
const usersPath = './src/users.json';
var fs = require('fs');




api.get('/', function (request, response) {
  response.json('NodeJS REST API');
});




api.listen(3000, function () {
  console.log('Server running @ localhost:3000');
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



