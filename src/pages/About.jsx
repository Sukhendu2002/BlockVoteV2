import React from "react";
import Markdown from "markdown-to-jsx";

const About = () => {
  // Custom styles for different heading levels
  const options = {
    overrides: {
      h1: { component: "h1", props: { className: "text-4xl font-bold mb-4" } },
      h2: { component: "h2", props: { className: "text-3xl font-bold mb-3" } },
      h3: { component: "h3", props: { className: "text-2xl font-bold mb-2" } },
      // override the separator
      hr: { component: "hr", props: { className: "my-6" } },
      // override the paragraph
      p: { component: "p", props: { className: "mb-3" } },
      // override the list
      ul: { component: "ul", props: { className: "list-disc ml-6 mb-3" } },
      // override the list item
      li: { component: "li", props: { className: "mb-1" } },

      pre: {
        component: "pre",
        props: {
          className:
            "bg-gray-200 rounded-md p-2 text-sm font-mono overflow-auto",
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen mt-[450px] ">
      <div className="w-1/2">
        <Markdown options={options}>
          {`
# BlockVote - Multi-Contract Decentralized Voting Platform 🗳️

![BlockVote](https://res.cloudinary.com/depyeobvt/image/upload/v1699343616/tppzbu7qyzwflsrw5ozc.png)

Welcome to BlockVote, a decentralized voting platform built on the Tezos blockchain. BlockVote empowers users to create and vote on polls while providing full transparency in viewing poll results. The technology stack includes React, Node.js, Taquito, and more.

---

## Table of Contents 📚

- [Getting Started](#getting-started-)
- [Client](#client-)
- [Server](#server-)

---

## Getting Started 🚀

To get started with BlockVote, you'll need to set up both the client-side and server-side components. Here are the steps:

---

### Environment Setup ⚙️

- Copy **.env.example** to **.env** and fill in the values.
- Also, copy **server/.env.example** to **server/.env** and fill in the values.

---

### Client 🌐

1. Navigate to the client directory:

\`\`\`
cd client
npm install
npm start
\`\`\`

2. The client-side application should now be running on **localhost:3000**.

1. Next, navigate to the server directory:

\`\`\`
cd server
npm install
npm start
\`\`\`

2. The server-side application should now be running on **localhost:7000**.

Add the server address to the client-side .env file as **REACT_APP_SERVER_URL**.

---

### Customization 🎨

BlockVote is highly customizable. You can modify the platform to suit your specific requirements. Refer to the documentation for details on how to customize various aspects of the platform.

`}
        </Markdown>
      </div>
    </div>
  );
};

export default About;
