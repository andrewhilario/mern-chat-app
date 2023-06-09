# Chat App

The Chat App is a real-time messaging application that allows users to send messages to each other, view their conversation history, and register or log in to their account. It is built with React, Node.js, MongoDB, WebSocket, Axios, and Chakra UI.

![Chat App Screenshot](/chat-app.png)

## Installation

Before running the app, make sure you have Node.js and MongoDB installed on your local machine or you can use MongoDB Atlas for the Mongo Url.

1. Clone the repository:<br/><br/>
`https://github.com/andrewhilario/mern-chat-app.git`

2. Install dependencies:<br/><br/>
`cd server` <br />
`npm install` <br />
`cd client` <br />
`npm install` <br />

3. Create a `.env` file in the root directory of the project and add the following variables:<br/><br/>
`MONGO_URI="mongodb+srv://admin:Drodols12!@chatapp.miwlyin.mongodb.net/?retryWrites=true&w=majority"` <br />
`JWT_SECRET=6oj1Z2c12IsPsxgDvzhNmtkrNTOu2M3P` <br />
`CLIENT_URL="http://localhost:5173"` <br />



4. Start the server:<br/><br/>
`npm start`<br/><br/>
  *The server should be running on `http://localhost:4000`.*

5. Start the client:<br/><br/>
<code>cd client <br/>
npm run dev</code><br/><br/>
  *The client should be running on `http://localhost:5173`.*

## Usage

### Register or Log in

To use the app, you need to register if you're a new user or log in if you have an existing account. Navigate to the Register or Login page using the links in the navigation bar.

### Send a Message

Once you're logged in, you can send a message to another user. Select the recipient's username from the dropdown list and type your message. Click the "Send" button or press the "Enter" key on your keyboard to send the message.

### View Conversation History

To view your conversation history with another user, select their username from the dropdown list without typing a message. This will display all your past messages with that user.

### Log out

To log out, click the "Logout" button in the navigation bar.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

