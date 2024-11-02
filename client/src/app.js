var currentRow = null;

var fs = require('fs');
var data = {};

function run() {
  new Vue({
    //el: '#app',
    data: {
      users: [],
    },
    created: function () {
      this.getUsers().then((response) => (this.users = response.data));
    },
    methods: {
      getUsers: function () {
        return axios.get("http://localhost:3000/users");
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  run();
});

function GetUser() {
  let userN = $("#userName").val();

  var user;

  document.querySelector("#userPass").value = "";

  $("#comd").html("wait");

  axios.get("http://localhost:3000/users/" + userN).then((response) => {
    if (response.data === "not found") {
      document.querySelector("#userPass").value = "NA";
    } else {
      document.querySelector("#userPass").value = response.data.password;
    }

    $("#comd").html("ready");
  });
}

function AddUser() {
  $("#comd").html("Wait");
  var obj = {
    name: document.querySelector("#userName").value,
    password: document.querySelector("#userPass").value,
  };

  if (obj.name.length < 3 || obj.name.length > 20) {
    if (obj.name.length < 3) $("#comd").html("Username too short");
    else $("#comd").html("Username too long");
  } else {
    if (obj.password.length < 3 || obj.password.length > 20) {
      if (obj.password.length < 3) $("#comd").html("Password too short");
      else $("#comd").html("Password too long");
    } else {
      axios.get("http://localhost:3000/users/" + obj.name).then((response) => {
        if (response.data === "not found") {
          AddUser2(obj);
        } else {
          $("#comd").html("Username in use");
        }
      });
    }
  }
}

function AddUser2(obj) {
  axios.put("http://localhost:3000/users", obj).then((response) => {
    $("#comd").html("Account created");
  });
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

                    window.location.href = 'MainPage.html';

                }
                else {
                    $("#comd").html("Wrong password");
                }

            }


        }
    );
}

function Back() {
  localStorage.setItem("currentUser", "");
  window.location.href = "index.html";
}


function GoToSignUp() {
  window.location.href = "SignUpPage.html";
}
