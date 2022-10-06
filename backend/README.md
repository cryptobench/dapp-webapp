# Dapps WebApp (backend)

todo

### Prerequisites
 - node >= v14.17.0
 - npm >= 6.13.4 or yarn >= v1.22.3

 ### yagna

 Follow the requestor's intro tutorial: https://handbook.golem.network/requestor-tutorials/flash-tutorial-of-requestor-development and ensure you can correctly run tasks on yagna.

 ### dapp-manager

Install dapp-manager (currently only available as a python source package):

```
python3 -m venv ~/.envs/dapp-manager
source ~/.envs/dapp-manager/bin/activate
git clone --recurse-submodules  https://github.com/golemfactory/dapp-manager.git
cd dapp-manager
pip install -U pip poetry
poetry install
```

## Install the dependencies

```bash
yarn
# or
npm install
```

## Configuration

 - Copy `.env-template` file to `.env`
 - (If needed) In `.env` file, define vars:
   - `NODE_CONFIG_DIR` - directory containing configuration files for each environments (default `./config` directory)
   - `NODE_ENV` - current environment assignee to configuration file (default: `development`)
 - In `config/{environment}.json` define base configurations for app modules:
   - http
   - cli
   - logger

The default config assumes that the yagna app-key is available in your environment as `YAGNA_APPKEY`.

### Ensure you have `dapp-manager` available in your PATH

If you followed the prerequisites above and installed the `dapp-manager` from source using poetry, just make sure that you're running the back-end app with your `dapp-manager` python environment active:

```
source ~/.envs/dapp-manager/bin/activate
```

You can verify if `dapp-manager` is available with:

```
dapp-manager
```

It should display the help for the command.

## Start the app

```bash
yarn start
# or
npm start
```

### Start the app in development mode (hot-code reloading)

```bash
yarn dev
# or
npm run dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Test (#TODO)

```bash
yarn test
yarn test:unit
yarn test:integration
yarn test:coverage
# or
npm run test
npm run test:unit
npm run test:integration
npm run test:coverage
```
