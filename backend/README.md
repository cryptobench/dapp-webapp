# Dapps WebApp (backend)

todo

### Prerequisites
 - node >= v18.12.1
 - npm >= 6.13.4 or yarn >= v1.22.3

### yagna

 Follow the requestor's intro tutorial: https://handbook.golem.network/requestor-tutorials/flash-tutorial-of-requestor-development and ensure you can correctly run tasks on yagna.

### redis

Have any redis instance available on `localhost:6379`.
If you have docker installed, run for e.g.: `docker run --rm -p 6379:6379 redis`

 ### dapp-manager

Install dapp-manager:

#### [Optional] Create a Python virtual environment

```
python3 -m venv ~/.envs/dapp-manager
source ~/.envs/dapp-manager/bin/activate
```

#### Install the dapp-manager

```
pip install dapp-manager
```

### dapp-deployment

To add support for Proxy you should run the https://github.com/golemfactory/dapp-deployment


## Install the JS dependencies

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
