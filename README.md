# BlockVote - Multi-Contract Decentralized Voting Platform 🗳️

![BlockVote](/site.png)

Welcome to BlockVote, a decentralized voting platform built on the Tezos blockchain. BlockVote empowers users to create and vote on polls while providing full transparency in viewing poll results. The technology stack includes React, Node.js, Taquito, and more.

## Table of Contents 📚

- [Getting Started](#getting-started)
- [Client](#client)
- [Server](#server)

## Getting Started 🚀

To get started with BlockVote, you'll need to set up both the client-side and server-side components. Here are the steps:

### Environment Setup ⚙️

- Copy `.env.example` to `.env` and fill in the values.
- Also, copy `server/.env.example` to `server/.env` and fill in the values.

### Client 🌐

1. Navigate to the client directory:
   ```bash
   cd client
   npm install
   npm start
   ```
2. The client-side application should now be running on `localhost:3000`.

### Server 🖥️

1. Next, navigate to the server directory:
   ```bash
   cd server
   npm install
   npm start
   ```
2. The server-side application should now be running on `localhost:7000`.

Add the server address to the client-side .env file as `REACT_APP_SERVER_URL`.

### Customization 🎨

BlockVote is highly customizable. You can modify the platform to suit your specific requirements. Refer to the documentation for details on how to customize various aspects of the platform.
