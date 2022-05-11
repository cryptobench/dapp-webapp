# Dapps WebApp (backend)

todo

### Prerequisites
 - node >= v14.17.0
 - npm >= 6.13.4 or yarn >= v1.22.3

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
