# outline-poc

Proof of concept for Outline's API backend.

Main points
1. Uses directives for permissions
2. Uses sequelize as an ORM to define postgres tables and relationships
3. Uses dataloader to batch and cache requests
4. Uses React Bootstrap

To try locally:
`git clone git@github.com:danielleknudson/outline-poc.git`

Setup server & client and run separately:
`cd outline-poc && yarn install && USER='your user id' node index.js`
`cd client && yarn install && yarn start`

You can access the API playground at localhost:4000
You can access the web client at localhost:3000

The server is logging queries and you can see them in your shell. You can see some queries are batched (Risk.creator, User.risks) but User.groups is not.
