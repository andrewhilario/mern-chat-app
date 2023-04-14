const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const ws = require('ws');
const User = require('./models/User');
const Message = require('./models/Message');

require('dotenv').config();
// Mongo URL
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json('Hello World!');
});

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, jwtSecret, {}, (err, userData) => {
        if (err) {
          console.log(err);
          return res.status(401).json('Unauthorized');
        }
        resolve(userData);
      });
    } else {
      reject('Unauthorized');
    }
  });
}

//messages
app.get('/messages/:userId', async (req, res) => {
  const { userId } = req.params;

  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;

  const messages = await Message.find({
    sender: { $in: [userId, ourUserId] },
    recipient: { $in: [userId, ourUserId] },
  }).sort({ createdAt: 1 });
  res.json(messages);
});

app.get('/people', async (req, res) => {
  const users = await User.find({}, { _id: 1, username: 1 });
  res.json(users);
});

// Homepage
app.get('/', (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) {
        console.log(err);
        return res.status(401).json('Unauthorized');
      }

      res.json(userData);
    });
  } else {
    res.status(401).json('Unauthorized');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user) {
    const passwordChecked = bcrypt.compareSync(password, user.password);

    if (passwordChecked) {
      jwt.sign(
        {
          userId: user._id,
          username,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            console.log(err);
            return res.status(500).json('Internal server error');
          }

          res
            .cookie('token', token, { sameSite: 'none', secure: true })
            .status(200)
            .json({
              id: user._id,
              username: user.username,
              message: 'User logged in',
            });
        },
      );
    }
  }
});

// Logout
app.post('/logout', (req, res) => {
  res
    .cookie('token', '', { sameSite: 'none', secure: true })
    .json('Logged out');
});

// Register
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const userCreated = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: userCreated._id, username },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          console.log(err);
          return res.status(500).json('Internal server error');
        }

        res
          .cookie('token', token, { sameSite: 'none', secure: true })
          .status(201)
          .json({
            id: userCreated._id,

            message: 'User created',
          });
      },
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal server error');
  }
});

// WebSocketServer

const server = app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (conn, req) => {
  function notifyOnlinePeople() {
    [...wss.clients].forEach((client) => {
      client.send(
        JSON.stringify({
          online: [...wss.clients].map((c) => ({
            userId: c.userId,
            username: c.username,
          })),
        }),
      );
    });
  }

  conn.isAlive = true;
  conn.timer = setInterval(() => {
    conn.ping();
    conn.deathTimer = setTimeout(() => {
      conn.isAlive = false;
      clearInterval(conn.timer);
      conn.terminate();
      notifyOnlinePeople();
      // console.log('Connection is dead');
    }, 1000);
  }, 5000);

  conn.on('pong', () => {
    clearTimeout(conn.deathTimer);
  });

  const cookies = req.headers.cookie;
  //Read username and userId from cooki
  if (cookies) {
    const tokenCookieString = cookies
      .split('; ')
      .find((str) => str.startsWith('token='));

    // console.log(tokenCookieString);

    if (tokenCookieString) {
      const token = tokenCookieString.split('=')[1];
      //   console.log(token);
      if (token) {
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
          if (err) {
            console.log(err);
          }
          const { userId, username } = userData;

          conn.userId = userId;
          conn.username = username;
        });
      }
    }
  }
  conn.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;

    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: conn.userId,
        recipient: recipient,
        text: text,
      });
      [...wss.clients]
        .filter((client) => client.userId === recipient)
        .forEach((client) =>
          client.send(
            JSON.stringify({
              text,
              sender: conn.userId,
              recipient,
              _id: messageDoc._id,
            }),
          ),
        );
    }
  });
  //   notify all clients about new user
  notifyOnlinePeople();
});

wss.on('close', (data) => {
  console.log('Connection closed', data);
});
