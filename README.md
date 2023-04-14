# Chat App

The Chat App is a real-time messaging application that allows users to send messages to each other, view their conversation history, and register or log in to their account. It is built with React, Node.js, MongoDB, WebSocket, Axios, and Chakra UI.

![Chat App Screenshot](/chat-app.png)

## Installation

Before running the app, make sure you have Node.js and MongoDB installed on your local machine or you can use MongoDB Atlas for the Mongo Url.

1. Clone the repository:
`git clone https://github.com/username/chat-app.git`

2. Install dependencies:
`cd server`
`npm install`
`cd client`
`npm install`

3. Create a `.env` file in the root directory of the project and add the following variables:
`MONGO_URI="mongodb+srv://admin:Drodols12!@chatapp.miwlyin.mongodb.net/?retryWrites=true&w=majority"`
`JWT_SECRET=6oj1Z2c12IsPsxgDvzhNmtkrNTOu2M3P`
`CLIENT_URL="http://localhost:5173"`



4. Start the server:
`npm start`

The server should be running on `http://localhost:4000`.

5. Start the client:
`cd client`
`npm run dev`

The client should be running on `http://localhost:5173`.

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

