
var ready = false;

var userId = null;
var users = null;
var games = null;
var chat = null;
var reports = null;
var leaderboards = null;
var backgrounds = null;
var showcase = null;

var showcase_id = -1;

function get_all_then(callback) {
    fetch("data/data.json")
        .then(res => {
            res.json()
                .then(val => {
                    userId = val["user"];
                    users = val["users"];
                    games = val["games"];
                    chat = val["chat"];
                    reports = val["admin"];
                    leaderboards = val["leaderboards"];
                    backgrounds = val["backgrounds"];
                    showcase = val["showcase"]
                    ready = true;
                    callback();
                });
        });
}

function load_leaderboard() {
    let daily_time_played = document.getElementById("daily-time-played");
    for (let user of leaderboards["daily"]["playtime"]) {
        add_to_ol(daily_time_played, user);
    }
    let daily_wins_bill = document.getElementById("daily-wins-as-bill");
    for (let user of leaderboards["daily"]["wins_bill"]) {
        add_to_ol(daily_wins_bill, user);
    }
    let daily_wins_player = document.getElementById("daily-wins-as-player");
    for (let user of leaderboards["daily"]["wins_player"]) {
        add_to_ol(daily_wins_player, user);
    }
    let time_played = document.getElementById("time-played");
    for (let user of leaderboards["all"]["playtime"]) {
        add_to_ol(time_played, user);
    }
    let wins_bill = document.getElementById("wins-as-bill");
    for (let user of leaderboards["all"]["wins_bill"]) {
        add_to_ol(wins_bill, user);
    }
    let wins_player = document.getElementById("wins-as-player");
    for (let user of leaderboards["all"]["wins_player"]) {
        add_to_ol(wins_player, user);
    }
}

function add_to_ol(element, data) {
    element.innerHTML += `<li><p class="nopad"><span class="red">${data['name']}</span>: ${data['val']}</p></li>`
}

function load_user() {
    document.getElementById("pfp").src = users[userId]["pfp"];
    document.getElementById("username-val").innerHTML = users[userId]["name"];
    document.getElementById("role-val").innerHTML = `[${users[userId]["role"]}]`
    document.getElementById("bio").innerHTML = users[userId]["bio"];
    document.getElementById("joined-val").innerHTML = users[userId]["joined"];
    document.getElementById("wins-as-bill-val").innerHTML = users[userId]["wins_bill"];
    document.getElementById("wins-as-player-val").innerHTML = users[userId]["wins_player"];
    document.getElementById("playtime-val").innerHTML = users[userId]["playtime"];

    for (let friendId of users[userId]["friends"]) {
        document.getElementById("friends-cols").innerHTML += `
        <div class="col-1-3">
            <div class="cols">
                <div class="col-1-5">
                    <img class="xs" id="friend-pfp" src="${users[friendId]["pfp"]}" alt="PFP">
                </div>
                <div class="col-left">
                    <p><a href="friend.html?id=${friendId}"><span class="u red">${users[friendId]["name"]}</span></a></p>
                </div>
            </div>
        </div>
        `
    }

    for (let game of games) {
        let userContent = "";

        for (let userId of game["players"]) {
            userContent += `
            <div class="col-1-4" style="padding-left: 1vw">
            <img class="xs" id="friend-pfp" src="${users[userId]["pfp"]}" alt="PFP" style="margin: 0; padding: 0;">
            </div>`
        }

        document.getElementById("games-rows").innerHTML += `
        <div class="cols">
            <div class="cols">
                ${userContent}
            </div>
            <div class="col-left" style="margin-left: 3vw">
                <p class="left">${game["name"]}<br>
                <span class="secondaryred">${game["time"]} | ${game["status"]}</span></p>
            </div>
        `
    }
}

function load_friend() {
    let friendId = new URLSearchParams(window.location.search).get("id");

    document.getElementById("pfp").src = users[friendId]["pfp"];
    document.getElementById("username-val").innerHTML = users[friendId]["name"];
    document.getElementById("role-val").innerHTML = `[${users[friendId]["role"]}]`
    document.getElementById("bio").innerHTML = users[friendId]["bio"];
    document.getElementById("joined-val").innerHTML = users[friendId]["joined"];
    document.getElementById("wins-as-bill-val").innerHTML = users[friendId]["wins_bill"];
    document.getElementById("wins-as-player-val").innerHTML = users[friendId]["wins_player"];
    document.getElementById("playtime-val").innerHTML = users[friendId]["playtime"];

    for (let msg of chat[friendId]) {
        document.getElementById("chat-rows").innerHTML += `
        <div class="cols" style="gap: 4vw;">
            <div class="col-1-10">
                <img class="xs" src="${users[msg["id"]]["pfp"]}" alt="PFP">
            </div>
            <div class="col-left">
                <p class="nopad left"><span id="sender-val" class="secondaryred">${users[msg["id"]]["name"]}</span> | <span id="time-val" class="secondaryred">${msg["time"]}</span><br>
                ${msg["msg"]}</p>
            </div>
        </div>
        `
    }
}

function load_admin() {
    for (let report of reports) {
        document.getElementById("reports-rows").innerHTML += `
        <div class="cols">
            <div class="col-1-10">
                <img class="xs" src="${users[report["id"]]["pfp"]}" alt="PFP">
            </div>
            <div class="col-left">
                <p class="nopad left"><span id="type-val" class="red">${report["type"]}</span> | <span id="sender-val" class="secondaryred">${users[report["id"]]["name"]}</span> | <span id="status-val" class="secondaryred">${report["status"]}</span><br>
                ${report["content"]}
                <br>
                <a onclick="alert('This functionality is reserved for the final project.')"><span class="secondaryred">ban</span></a> | <a onclick="alert('This functionality is reserved for the final project.')"><span class="secondaryred">ignore</span></a></span>
            </div>
        </div>
        `
    }
}

function load_bg() {
    var url = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    document.getElementsByTagName("body")[0].style.backgroundImage = `url("${url}")`;
    document.getElementsByTagName("body")[0].style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    document.getElementsByTagName("body")[0].style.backgroundBlendMode = "overlay";
}

function increment_showcase() {
    showcase_id++;
    showcase_id %= showcase.length;

    document.getElementById("gallery").src = showcase[showcase_id];

    window.setTimeout(
        increment_showcase,
        5000
    );
}