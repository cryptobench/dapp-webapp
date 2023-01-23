#!/usr/bin/env zx

let increaseOpenFileLimit = "";
const openFileLimit = argv.oflimit;

// read yagna settings and set based on them proper env variables
const yagna_settings_path = argv.yagna_settings || "./yagna.json";
const yagnaSettings = JSON.parse(await $`cat ${yagna_settings_path}`);
const yagnaEnv = Object.keys(yagnaSettings).forEach((yagnaEnvKey) => {
  process.env[yagnaEnvKey.toUpperCase()] = yagnaSettings[yagnaEnvKey];
});

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
await $`tmux new-window -n "frontend"`;
await $`tmux send-keys -t frontend "cd frontend && npm run dev" C-m`;

//separated instance of yagna if ine is running it is always better to run
//separated instance just for the dapp purpose

await $`tmux new-window -n yagna`;
await $`tmux send-keys -t yagna "yagna service run" C-m`;

await $`tmux attach-session -d`;
