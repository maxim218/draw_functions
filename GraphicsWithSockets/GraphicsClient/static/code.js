"use strict";

let can = null;
let holst = null;

let mass = [];

function drawFon() {
    holst.fillRect(-20, -20, 1050, 450);
}

let dx = 0;

let t_x = 1;
let t_y = 1;

function drawLine(x1, y1, x2, y2) {
    holst.beginPath();
    holst.moveTo(x1 * t_x + dx, -y1 * t_y + 200);
    holst.lineTo(x2 * t_x + dx, -y2 * t_y + 200);
    holst.closePath();
    holst.stroke();
}

function addPoint(xx, yy) {
    mass.push({
        xx: xx,
        yy: yy
    });
}

window.onload = function() {
    can = document.getElementById('can');
    holst = can.getContext('2d');

    holst.lineWidth = 1;
    holst.fillStyle = '#33dfba';
    holst.strokeStyle = '#0f4fff';


    let myInter = setInterval(() =>{
        t_x = parseFloat(elem("t_x").value);
        t_y = parseFloat(elem("t_y").value);

        let speed = parseFloat(elem("t_speed").value);
        if(elem("t_speed").value.toString().length === 0) {
            speed = 0;
        }

        if(type === "RIGHT") dx += speed;
        if(type === "LEFT") dx -= speed;

        drawFon();
        drawGarphics();
    }, 100);
};

function f(xx) {
    return Math.tan(xx);
}

function drawGarphics() {

    for(let i = 0; i < mass.length; i++) {
        if(i !== 0) {
            const x1 = mass[i - 1].xx;
            const y1 = mass[i - 1].yy;
            const x2 = mass[i].xx;
            const y2 = mass[i].yy;
            drawLine(x1, y1, x2, y2);
        }
    }
}


////////////////////////////////////

let xxx = 0;


let socket = new WebSocket(adressUrlServer);

socket.onopen = function() {
    console.log("Соединение установлено");
};

socket.onclose = function(event) {
    console.log("Соединение закрыто");
};

socket.onmessage = function(event) {
    console.log("Получено сообщение: " + event.data);

    let message = event.data.toString();

    if(message.indexOf("@@@") === -1) {
        let arr = message.split(" ");

        for(let i = 0; i < arr.length; i++) {
            if(arr[i] !== "" && arr[i] !== " ") {
                let n = parseInt(arr[i]);

                addPoint(xxx, n);
                xxx++;
            }
        }
    }
};

socket.onerror = function(error) {
    console.log("Ошибка: " + error.message);
};