// wybór canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// dzwiek
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
userScore.src = "sounds/userScore.mp3";
comScore.src = "sounds/comScore.mp3";

// tworzenie paletek/rakiet gracza

const user = {
    x: 0,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// tworzenie paletek/rakiet komputera

const com = {
    x: cvs.width - 10,
    y: cvs.height / 2 - 100 / 2,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
};

// tworzenie piłeczki

const ball = {
    x: cvs.width / 2,
    y: cvs.height / 2,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "white"
};

// rysowanie funkcji - przestrzeń robocza
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// tworzenie siatki
const net = {
    x: cvs.width / 2 - 11,
    // x: (cvs.width -2)/2, ???
    y: 0,
    width: 2,
    height: 10,
    color: "WHITE"
};

// rysowanie siatki
function drawNet() {
    for (let i = 0; i <= cvs.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// tworzenie koła

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.fill();
}

// text

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text, x, y);
}

// render Gry

function render() {
    // czyszczenie parapetrów/canvas
    drawRect(0, 0, cvs.width, cvs.height, "black");

    // siatka na stole
    drawNet();

    // punktacja
    drawText(user.score, cvs.width / 4, cvs.height / 5, "WHITE");
    drawText(com.score, 3 * cvs.width / 4, cvs.height / 5, "WHITE");

    // paletki gracza i komputera
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // piłeczka
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// kontrola paletkami gracza
cvs.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height / 2;
}

// detekcja kolizji/zderzenia
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

 // reset piłeczki
function resetBall() {
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}


// aktualizacja: pozycja, ruch, punktacja itd.
function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // prosta sztuczna inteligencja - paletka komputera
    let computerLevel = 0.1;
    // com.y += (ball.y - (com.y + com.height / 2)) * computerLevel;
    com.y += ((ball.y - (com.y + com.height / 2))) * computerLevel;

    if (ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    let player = (ball.x + ball.radius < cvs.width/2) ? user : com;

    if (collision(ball, player)) {
        hit.play();
        // gdy piłeczka uderzy gracza
        let collidePoint = (ball.y - (player.y + player.height / 2));

        // normalizacja/jednorodnoć/nadanie symetrycznosci
        collidePoint = collidePoint / (player.height / 2);

        // obliczenie kątu w promieniu
        let angleRad = collidePoint * (Math.PI / 4);

        // kierunek X piłeczki po uderzeniu
        let direction = (ball.x + ball.radius < cvs.width / 2) ? 1 : -1;

        // zmiana prędkoci/kierunku osi X i Y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // ilekroć piłeczka uderzy  paletkę, odbijamy prędkoć
        ball.speed += 1.5;

    }
    // aktualizacja punktacji
    if (ball.x - ball.radius < 0) {
        // zwycięztwo komputera
        com.score++;
        comScore.play();
        resetBall();
    } else if (ball.x + ball.radius > cvs.width) {
        // zwycięztwo gracza
        user.score++;
        userScore.play();
        resetBall();
    }
}

// inicjacja gry
function game() {
    update();
    render();
}

// pętla/loop
const framePerSecound = 50;
setInterval(game, 1000 / framePerSecound);