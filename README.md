# Battleship Blue Team
Blue Team's Battleship game for CSC 520 final project.

## Required Software
- [NodeJS](https://nodejs.org/en/download) (refer to npm download first)
- [MongoDB](https://www.mongodb.com/docs/manual/administration/install-community/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

## Setup
1. I believe you should be able to simple npm install in the root directory of the project.
2. Make sure MongoDB has started. I have problems starting it occasionally on Ubuntu, dm me and I can send you a helpful link.
3. run: nodemon app.js

## Add Sample Posts to populate users and games and fetch them
- curl -X POST -H "Content-Type: application/json" -d '{"username": "seth"}' http://localhost:3000/users/create
- curl -X POST -H "Content-Type: application/json" -d '{"username": "seth"}' http://localhost:3000/games/create

- curl -X GET http://localhost:3000/users
- curl -X GET http://localhost:3000/games/active
