console.log(chalk.blue("Installing husky"));

await $`husky install`;

console.log(chalk.blue("initing git submodule "));

await $`git submodule init`;
await $`git submodule update`;

console.log(chalk.blue("installing node modules"));

await $`npm i`;

console.log(chalk.blue("running db migration"));

await $`cd backend && npm run migrate`;
