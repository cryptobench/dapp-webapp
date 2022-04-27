# Dapps WebApp (backend)

todo

## Install the dependencies

```bash
yarn
# or
npm install
```

## Configuration

 - Copy `.env-template` file to `.env`
 - In `.env` file, define vars:
   - `NODE_CONFIG_DIR` - directory containing configuration files for each environments (default `config` directory)
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
