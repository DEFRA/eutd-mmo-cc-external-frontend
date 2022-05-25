# mmo-ecc-fe

Frontend for the Fish Export Service (FES).

## Installation

Clone the repo.

Copy the `.envSample` file and rename it as `.env` - this will ensure all the correct env vars are set up for local development.

Install NPM packages:

```
npm i
```

## Getting started

Start the project without requiring a login:

```
npm start
```

Start the project with a login:

```
npm run start-with-idm
```

The site will run at [http://localhost:3001](http://localhost:3001), and the code will recompile as you edit it.

## Testing

To run the tests as a one-off:

```
npm test
```

To run the tests continuously (i.e. when doing TDD):

```
jest --watch
```

(You will need to install jest globally for this: `npm i -g jest`)