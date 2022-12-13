# DApps WebApp (backend)

## Prerequisites

- node >= v14.17.0
- npm >= 6.13.4 or yarn >= v1.22.3
- Redis instance running on localhost (`docker-compose.yaml` available in case you want to run the app locally)

## Setup

Making the project run requires a number of applications and services to be installed prior to running
the `DApps WebApp Backend`.

### Install `yagna` daemon

Follow
the [requestor intro tutorial](https://handbook.golem.network/requestor-tutorials/flash-tutorial-of-requestor-development)
and ensure you can correctly run tasks on yagna.

### Install `dapp-manager`

Install dapp-manager:

#### [Optional] Create a Python virtual environment

```bash
python3 -m venv ~/.envs/dapp-manager
source ~/.envs/dapp-manager/bin/activate
```

#### Install the dapp-manager

```bash
pip install dapp-manager
```

### dapp-deployment

To add support for Proxy you should run the https://github.com/golemfactory/dapp-deployment


## Install the projects dependencies

```bash
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

## Start the app

```bash
npm start
```

### Start the app in development mode (hot-code reloading)

```bash
npm run dev
```