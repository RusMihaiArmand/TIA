var currentRow = null;

//var fs = require('fs');
var data = {}

function run() {
    new Vue({
        //el: '#app',
        data: {
            users: [],
            games: [],
            borrows: []
        },
        created: function () {
            this.getUsers().then(response => (this.users = response.data));
            this.getGames().then(response => (this.games = response.data));
            this.getBorrows().then(response => (this.borrows = response.data));
        },
        methods: {
            getUsers: function () {
                return axios.get('http://localhost:3000/users');
            },
            getGames: function () {
                return axios.get('http://localhost:3000/games');
            },
            getBorrows: function () {
                return axios.get('http://localhost:3000/borrowings');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    run();
});




function GetBorrow() {

    let idText = $('#gameId').val();
    let id = parseInt(idText);



    $("#comd").html("wait");

    axios.get('http://localhost:3000/borrowings/' + id).then(
        (response) => {

            if (response.data === 'not found') {
                $("#comd").html("Done");
            }
            else {
                $("#comd").html("Done");

                document.querySelector("#gameTakenBy").value = response.data.user;



            }

        }
    );
}



function GetGame() {

    let idText = $('#gameId').val();
    let id = parseInt(idText);

    var game;
    document.querySelector("#gameTakenBy").value = "";

    document.querySelector("#gameName").value = "";
    document.querySelector("#gamePublisher").value = "";
    document.querySelector("#gameGenre").value = "";

    document.querySelector("#gameDate").value = "";
    document.querySelector("#gamePrice").value = "";
    document.querySelector("#gameDesc").value = "";

    document.querySelector("#gameConsole").value = "";
    document.querySelector("#gameStatus").value = "";
    document.querySelector("#gameNotes").value = "";


    $("#comd").html("wait");

    axios.get('http://localhost:3000/games/' + id).then(
        (response) => {

            if (response.data === 'not found') {
                $("#comd").html("No game found");
            }
            else {
                $("#comd").html("Game found");

                document.querySelector("#gameName").value = response.data.name;
                document.querySelector("#gamePublisher").value = response.data.publisher;
                document.querySelector("#gameGenre").value = response.data.genre;

                document.querySelector("#gameDate").value = response.data.date;
                document.querySelector("#gamePrice").value = response.data.price;
                document.querySelector("#gameDesc").value = response.data.desc;

                document.querySelector("#gameConsole").value = response.data.console;
                document.querySelector("#gameStatus").value = response.data.status;
                document.querySelector("#gameNotes").value = response.data.notes;

                GetBorrow();
            }

        }
    );
}



function AddGame() {

    $("#comd").html("Wait");
    var obj = {
        id: 69,
        name: document.querySelector("#gameName").value,
        publisher: document.querySelector("#gamePublisher").value,
        genre: document.querySelector("#gameGenre").value,

        date: document.querySelector("#gameDate").value,
        price: document.querySelector("#gamePrice").value,
        desc: document.querySelector("#gameDesc").value,

        console: document.querySelector("#gameConsole").value,
        status: document.querySelector("#gameStatus").value,
        notes: document.querySelector("#gameNotes").value
    }

    axios.put('http://localhost:3000/games', obj).then(
        (response) => {
            $("#comd").html("Game added");
            RefreshTable();
        }
    );


}

function UpdateGame() {

    $("#comd").html("wait");
    var obj = {
        id: document.querySelector("#gameId").value,
        name: document.querySelector("#gameName").value,
        publisher: document.querySelector("#gamePublisher").value,
        genre: document.querySelector("#gameGenre").value,

        date: document.querySelector("#gameDate").value,
        price: document.querySelector("#gamePrice").value,
        desc: document.querySelector("#gameDesc").value,

        console: document.querySelector("#gameConsole").value,
        status: document.querySelector("#gameStatus").value,
        notes: document.querySelector("#gameNotes").value
    }

    axios.get('http://localhost:3000/games/' + obj.id, obj).then(
        (response) => {
            if (response.data === 'not found') {

                $("#comd").html("Game not found");

            }
            else {

                UpdateGame2(obj);

            }
        }
    );


}

function UpdateGame2(obj) {

    axios.post('http://localhost:3000/games', obj).then(
        (response) => {
            $("#comd").html("Game Updated");
            RefreshTable();
        }
    );

}



function DeleteGame() {

    $("#comd").html("Wait");
    let idText = $('#gameId').val();
    let id = parseInt(idText);
   

    axios.get('http://localhost:3000/games/' + id).then(
        (response) => {
            if (response.data === 'not found') {

                $("#comd").html("Game not found");
    
            }
            else {

                var obj = {
                    gameid: id,
                    user: localStorage.getItem("currentUser")
                }
        
                axios.delete('http://localhost:3000/borrowings/' + obj.gameid, obj).then(
                    (response) => {
                        DeleteGame2(id);
                    }
                );

            }
        }
    );


 


}

function DeleteGame2(id) {



    axios.delete('http://localhost:3000/games/' + id).then(
        (response) => {
            $("#comd").html("Game deleted");
            RefreshTable();
        }
    );



}





function GetUser() {

    let userN = $('#userName').val();


    var user;

    document.querySelector("#userPass").value = "";

    $("#comd").html("wait");

    axios.get('http://localhost:3000/users/' + userN).then(
        (response) => {

            if (response.data === 'not found') {

                document.querySelector("#userPass").value = "NA";

            }
            else {
                document.querySelector("#userPass").value = response.data.password;
            }

            $("#comd").html("ready");
        }
    );
}

function AddUser() {


    $("#comd").html("Wait");
    var obj = {
        name: document.querySelector("#userName").value,
        password: document.querySelector("#userPass").value,
    }

    if (obj.name.length < 3 || obj.name.length > 20) {
        if (obj.name.length < 3)
            $("#comd").html("Username too short");
        else
            $("#comd").html("Username too long");
    }
    else {
        if (obj.password.length < 3 || obj.password.length > 20) {
            if (obj.password.length < 3)
                $("#comd").html("Password too short");
            else
                $("#comd").html("Password too long");
        }
        else {

            axios.get('http://localhost:3000/users/' + obj.name).then(
                (response) => {

                    if (response.data === 'not found') {

                        AddUser2(obj);

                    }
                    else {
                        $("#comd").html("Username in use");

                    }

                }
            );


        }

    }



}

function AddUser2(obj) {


    axios.put('http://localhost:3000/users', obj).then(
        (response) => {
            $("#comd").html("Account created");
        }
    );


}

function UpdateUser() {


    $("#comd").html("Wait");
    var obj = {
        name: localStorage.getItem("currentUser"),
        password: document.querySelector("#userPass").value,
        newpassword: document.querySelector("#newuserPass").value
    }

    if (obj.newpassword.length < 3 || obj.newpassword.length > 20) {
        if (obj.newpassword.length < 3)
            $("#comd").html("Password too short");
        else
            $("#comd").html("Password too long");
    }
    else {

        axios.get('http://localhost:3000/users/' + obj.name).then(
            (response) => {


                if (response.data === 'not found') {

                    $("#comd").html("User not found");

                }
                else {

                    if (obj.password == response.data.password) {
                        UpdateUser2(obj);

                    }
                    else {
                        $("#comd").html("Wrong password");
                    }

                }



            }
        );

    }

}

function UpdateUser2(obj) {


    axios.post('http://localhost:3000/users', obj).then(
        (response) => {
            $("#comd").html("Password updated");

            document.querySelector("#userPass").value = "";
            document.querySelector("#newuserPass").value = "";

        }
    );


}

function DeleteUserFinal(userN) {

    axios.delete('http://localhost:3000/users/' + userN).then(
        (response) => {
            $("#comd").html("User deleted");

            document.querySelector("#userPass").value = "";
            document.querySelector("#newuserPass").value = "";

            Back();
        }
    );


}

function DeleteUser(userN) {


    var cont = 0;


    axios.get('http://localhost:3000/borrowings').then(
        (response) => {

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user == userN) {
                    cont = cont + 1;
                }

            }

            if (cont == 0) {
                DeleteUserFinal(userN);
            }
            else {
                $("#comd").html("User still has " + cont + " games");
            }


        }

    );


}


function getBorrows2() {
    return axios.get('http://localhost:3000/borrowings');
}



function HowMany(userN) {
    var cont = 0;

    axios.get('http://localhost:3000/borrowings').then(
        (response) => {

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user == userN) {
                    cont = cont + 1;
                }

            }

            return cont;
        }

    );


}



function BorrowGame() {


    $("#comd").html("wait");

    var userN = localStorage.getItem("currentUser");
    var gameid = document.querySelector("#borrowgameId").value;

    axios.get('http://localhost:3000/borrowings').then(
        (response) => {

            var cont = 0;
            var ok = true;

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user == userN) {
                    cont = cont + 1;
                }

                if (response.data[i].gameid == gameid) {
                    ok = false
                }

            }

            if (cont >= 3) {
                $("#comd").html("Can't borrow more games");
            }
            else {
                if (ok == true)
                    BorrowGame2();
                else
                    $("#comd").html("Can't borrow that game");
            }

        }

    );


}

function BorrowGame2() {

    var obj = {
        gameid: document.querySelector("#borrowgameId").value,
        user: localStorage.getItem("currentUser")
    }

    axios.put('http://localhost:3000/borrowings', obj).then(
        (response) => {
            $("#comd").html("Game obtained");
            GameStatusUpdate(obj.gameid);
        }
    );

}

function GameStatusUpdate(id) {



    axios.get('http://localhost:3000/games/' + id).then(
        (response) => {

            var obj = response.data;
            obj.status = "unavailable";
            GameStatusUpdate2(obj);
        }
    );


}

function GameStatusUpdate2(obj) {


    axios.post('http://localhost:3000/games', obj).then(
        (response) => {
            RefreshTable();
        }
    );


}



function ReturnGame() {


    $("#comd").html("wait");

    var userN = localStorage.getItem("currentUser");
    var gameid = document.querySelector("#borrowgameId").value;

    axios.get('http://localhost:3000/borrowings').then(
        (response) => {


            var ok = false;

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user == userN && response.data[i].gameid == gameid) {
                    ok = true
                }
            }

            if (ok == true)
                ReturnGame2();
            else
                $("#comd").html("You don't have that game");


        }
    );

}



function ReturnGame2() {

    var obj = {
        gameid: document.querySelector("#borrowgameId").value,
        user: localStorage.getItem("currentUser")
    }

    axios.delete('http://localhost:3000/borrowings/' + obj.gameid, obj).then(
        (response) => {
            $("#comd").html("Game returned");
            GameStatusUpdateRet(obj.gameid);
        }
    );

}

function GameStatusUpdateRet(id) {



    axios.get('http://localhost:3000/games/' + id).then(
        (response) => {

            var obj = response.data;
            obj.status = "available";
            GameStatusUpdateRet2(obj);
        }
    );


}

function GameStatusUpdateRet2(obj) {


    axios.post('http://localhost:3000/games', obj).then(
        (response) => {
            RefreshTable();
        }
    );


}








function WhoHasIt() {

    let id = $('#borrowgameId').val();


    document.querySelector("#userName").value = "";

    $("#comd").html("wait");

    axios.get('http://localhost:3000/borrowings/' + id).then(
        (response) => {

            if (response.data === 'not found') {

                document.querySelector("#userName").value = "NOBODY";

            }
            else {

                document.querySelector("#userName").value = response.data.user;

            }

            $("#comd").html("ready");
        }
    );
}



function Retrieve2() {

    const us = localStorage.getItem("currentUser");
    $("#thing2").html(us);

}

function LogIn() {

    let userN = $('#userName').val();

    var user;

    $("#comd").html("Wait");

    axios.get('http://localhost:3000/users/' + userN).then(
        (response) => {

            if (response.data === 'not found') {


                $("#comd").html("User not found");

            }
            else {

                if (document.querySelector("#userPass").value == response.data.password) {
                    localStorage.setItem("currentUser", userN);

                    if (userN === "admin")
                        window.location.href = 'AdminPage.html';
                    else
                        window.location.href = 'ListPage.html';

                }
                else {
                    $("#comd").html("Wrong password");
                }

            }


        }
    );
}

function DeleteUser2() {

    var userN = localStorage.getItem("currentUser");

    var user;
    $("#comd").html("wait");


    axios.get('http://localhost:3000/users/' + userN).then(
        (response) => {

            if (response.data === 'not found') {

                $("#comd").html("No such user");

            }
            else {

                if (document.querySelector("#userPass").value == response.data.password) {

                    DeleteUser(userN);

                }
                else {
                    $("#comd").html("Wrong password");
                }

            }


        }
    );
}



function RefreshTable() {


    var table = document.getElementById("game-table");


    var numb = table.rows.length;

    for (var i = numb - 1; i >= 1; i--) {

        table.deleteRow(i);
    }


    //var header = table.createTHead();
    //var row = header.insertRow(0);

    //var cell00 = row.insertCell(0);
    //cell00.innerHTML = "ID"; 
    //var cell01 = row.insertCell(1);
    //cell01.innerHTML = "NAME"; 
    //var cell02 = row.insertCell(2);
    //cell02.innerHTML = "GENRE"; 
    //var cell03 = row.insertCell(3);
    //cell03.innerHTML = "STATUS"; 


    let searchTitle = $('#gameSearchTitle').val();
    searchTitle = searchTitle.toLowerCase();
    let searchGenre = $('#gameSearchGenre').val();
    searchGenre = searchGenre.toLowerCase();
    let searchConsole = $('#gameSearchConsole').val();
    searchConsole = searchConsole.toLowerCase();

    axios.get('http://localhost:3000/games').then(
        (response) => {

            if (response.data === 'not found') {

            }
            else {

                var allgames = response.data;

                for (var i = 0; i < allgames.length; i++) {

                    // console.log(allgames[i].name);

                    let foundTitle = allgames[i].name;
                    foundTitle = foundTitle.toLowerCase();
                    let foundGenre = allgames[i].genre;
                    foundGenre = foundGenre.toLowerCase();
                    let foundConsole = allgames[i].console;
                    foundConsole = foundConsole.toLowerCase();

                    if (foundTitle.includes(searchTitle) && foundGenre.includes(searchGenre) && foundConsole.includes(searchConsole)) {

                        var row = table.insertRow(table.length);

                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);
                        var cell6 = row.insertCell(5);
                        var cell7 = row.insertCell(6);
                        var cell8 = row.insertCell(7);
                        var cell9 = row.insertCell(8);
                        var cell10 = row.insertCell(9);


                        cell1.innerHTML = allgames[i].id;
                        cell2.innerHTML = allgames[i].name;
                        cell3.innerHTML = allgames[i].publisher;
                        cell4.innerHTML = allgames[i].genre;
                        cell5.innerHTML = allgames[i].date;
                        cell6.innerHTML = allgames[i].price;
                        cell7.innerHTML = allgames[i].desc;
                        cell8.innerHTML = allgames[i].console;
                        cell9.innerHTML = allgames[i].status;
                        cell10.innerHTML = allgames[i].notes;
                    }

                }

            }


        }
    );


}




function Back() {

    localStorage.setItem("currentUser", "");
    window.location.href = 'LogInPage.html';
}

function Back2() {

    window.location.href = 'ListPage.html';
}

function ShowBorrowed() {

    $("#blist").html("");
    var userN = localStorage.getItem("currentUser");
    var list = "";

    axios.get('http://localhost:3000/borrowings').then(
        (response) => {

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].user == userN) {
                    list = list + " " + response.data[i].gameid + " ;";
                }

            }

            $("#blist").html(list);

        }

    );

}

function GoToSignUp() {

    window.location.href = 'SignUpPage.html';
}

function Managing() {

    window.location.href = 'ManagePage.html';
}