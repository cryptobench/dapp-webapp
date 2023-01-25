#!/usr/bin/env zx

require("dotenv").config({ path: __dirname + "/backend/.env" });

let increaseOpenFileLimit = "";
const openFileLimit = argv.oflimit;

const defaultOpenFileLimitOverwrite = 1024;

if (openFileLimit === true) {
  increaseOpenFileLimit = `ulimit -n ${defaultOpenFileLimitOverwrite} &&`;
}

if (openFileLimit === "number") {
  increaseOpenFileLimit = `ulimit -n ${argv.oflimit} &&`;
}

// //kill previous and recreate session
try {
  await $`tmux kill-session -t "dapp-webapp"`;
} catch (err) {
  console.log("dapp webapp in not running. Nothing to kill");
}

await $`tmux new-session -d -s "dapp-webapp"`;

//create panes for services

//backend
await $`tmux new-window -n "backend"`;
await $`tmux send-keys -t backend "cd backend && npm run dev" C-m`;

//frontend
await $`tmux new-window -n "frontend_legacy"`;
await $`tmux send-keys -t frontend_legacy "cd frontend_legacy && npm run dev" C-m`;

//separated instance of yagna if ine is running it is always better to run
//separated instance just for the dapp purpose

await $`tmux new-window -n yagna`;
await $`tmux send-keys -t yagna "yagna service run" C-m`;

await $`tmux attach-session -d`;
