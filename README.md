# Sudoku Survey App

Web Application using vuejs, vuetify, and firebase.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

Package manager

```
nodejs https://nodejs.org/en/
```

### Installing

A step by step series of examples that tell you have to get a development environment running

Open terminal

cd into repository

Install project dependencies with npm

```
npm install
```

Create config json file for firebase environment variables

```
cd src/config/

touch config.json (for linux systems)
echo "" > config.json (for windows)
```

Grab below data from firebase

```json
{
  "apiKey": "",
  "authDomain": "",
  "databaseURL": "",
  "projectId": "",
  "storageBucket": "",
  "messagingSenderId": ""
}
```

Start development server

```
npm run serve
```

Build Files for distribution

```
npm run build
```

## Deployment

Notes about how to deploy this on a live system

Serve the /dist folder created after building with index.html handling fallbacks.

## Built With

- [VueJS](https://expressjs.com/)
- [Vuetify](https://vuetifyjs.com)
- [Firebase](https://firebase.google.com)

## Authors

- **Craig Edwards** - _Initial work_ - [Credwa](https://github.com/credwa)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
