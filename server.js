const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static(__dirname));


// =========================
// 共有する文章
// =========================

let documentText = "";


// =========================
// 接続人数
// =========================

let userCount = 0;


// =========================
// 接続
// =========================

io.on("connection", (socket) => {

    userCount++;

    console.log("ユーザーが接続しました");


    // 現在の文章を送る

    socket.emit("document-init", {
        text: documentText
    });


    // 接続人数

    io.emit(
        "user-count",
        userCount
    );


    // =========================
    // 文章変更
    // =========================

    socket.on(
        "document-change",
        (data) => {

            documentText =
                data.text;


            io.emit(
                "document-change",
                {
                    text: documentText
                }
            );

        }
    );


    // =========================
    // お絵描き
    // =========================

    socket.on(
        "draw",
        (data) => {

            // 全員に描画データを送る

            io.emit(
                "draw",
                data
            );

        }
    );


    // =========================
    // 全消し
    // =========================

    socket.on(
        "clear-canvas",
        () => {

            io.emit(
                "clear-canvas"
            );

        }
    );


    // =========================
    // 切断
    // =========================

    socket.on(
        "disconnect",
        () => {

            userCount--;

            console.log(
                "ユーザーが切断しました"
            );


            io.emit(
                "user-count",
                userCount
            );

        }
    );

});


// =========================
// サーバー起動
// =========================

server.listen(
    3000,
    () => {

        console.log(
            "================================="
        );

        console.log(
            "サーバーが起動しました！"
        );

        console.log(
            "http://localhost:3000"
        );

        console.log(
            "================================="
        );

    }
);