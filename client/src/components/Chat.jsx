import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import { BsFillChatLeftDotsFill } from 'react-icons/bs';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import EmojiPicker, { Emoji } from 'emoji-picker-react';
import axios from 'axios';
import { BsEmojiSmile } from 'react-icons/bs';

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [online, setOnline] = useState([]);
  const [offline, setOffline] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showEmoji, setShowEmoji] = useState(null);

  const { username, id } = useContext(UserContext);
  const scrollToBottom = useRef();

  useEffect(() => {
    connectToWebSocket();
  }, []);

  const handleShowEmojis = () => {
    setShowEmoji(!showEmoji);
  };

  function onClick(emojiData, event) {
    setNewMessage((prev) => prev + emojiData.emoji);
  }

  function connectToWebSocket() {
    const ws = new WebSocket('ws://localhost:4000');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected from server. Reconnecting...');
        connectToWebSocket();
      }, 1000);
    });
  }

  function showOnlineUsers(onlineArray) {
    const onlineUsers = {};

    onlineArray.forEach(({ userId, username }) => {
      onlineUsers[userId] = username;
    });

    setOnline(onlineUsers);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    // console.log({ ev, messageData });
    if ('online' in messageData) {
      showOnlineUsers(messageData.online);
    } else if ('text' in messageData) {
      setMessages((prev) => [
        ...prev,
        {
          text: messageData.text,
          sender: messageData.sender,
          recipient: messageData.recipient,
          id: Date.now(),
        },
      ]);
      //   console.log(messages.text);
    }
  }

  function sendMessage(e) {
    e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessage,
      }),
    );
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: id,
        recipient: selectedUserId,
        _id: Date.now(),
      },
    ]);
    setNewMessage('');
  }

  useEffect(() => {
    const div = scrollToBottom.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get(`/messages/${selectedUserId}`).then((res) => {
        // const { data } = res;
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get('/people').then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(online).includes(p._id));

      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      // console.log({ offlinePeople, offlinePeopleArr });

      setOffline(offlinePeopleArr);
      console.log(offlinePeopleArr);
    });
  }, [online]);

  const onlineUserExcludeSelf = { ...online };

  delete onlineUserExcludeSelf[id];

  const messagesWithoutDuplicates = uniqBy(messages, '_id');
  // console.log(messagesWithoutDuplicates);

  return (
    <Box>
      <Navbar />
      <Center height={'80vh'} my='1rem'>
        <Flex
          w={{
            base: '90%',
            md: '80%',
          }}
          height={'100%'}
          my='2rem'
          shadow={'2xl'}
          p='1rem'
          borderRadius={'lg'}
        >
          <Box w='30%' height={'100%'} bg='white' p='1rem'>
            <Flex w='100%' align={'center'} gap={'1rem'} color='teal.400'>
              <BsFillChatLeftDotsFill size='2rem' />
              <Heading
                fontSize={{
                  base: '1.5rem',
                  md: '2rem',
                  lg: '2rem',
                }}
              >
                Chat App
              </Heading>
            </Flex>
            <Flex
              direction={'column'}
              w='100%'
              gap={'1rem'}
              mx='auto'
              my='1rem'
            >
              {Object.keys(onlineUserExcludeSelf).map((userId) => (
                <Flex
                  w='100%'
                  key={userId}
                  align={'center'}
                  gap={'1rem'}
                  cursor={'pointer'}
                  p='.5rem'
                  borderRadius={'lg'}
                  onClick={() => setSelectedUserId(userId)}
                  background={userId == selectedUserId ? 'teal.400' : 'white'}
                  color={userId == selectedUserId ? 'white' : 'black'}
                >
                  <Avatar name={online[userId].username} color={'white'}>
                    <AvatarBadge boxSize='1.25em' bg='green.500' />
                  </Avatar>
                  <Text fontWeight={'semibold'} textTransform={'capitalize'}>
                    {online[userId]}
                  </Text>
                </Flex>
              ))}
              {Object.keys(offline).map((userId) => (
                <Flex
                  w='100%'
                  key={userId}
                  align={'center'}
                  gap={'1rem'}
                  cursor={'pointer'}
                  p='.5rem'
                  borderRadius={'lg'}
                  onClick={() => setSelectedUserId(offline[userId]._id)}
                  background={userId == selectedUserId ? 'teal.400' : 'white'}
                  color={userId == selectedUserId ? 'white' : 'black'}
                >
                  <Avatar name={offline[userId].username} color={'white'}>
                    <AvatarBadge
                      boxSize='1.25em'
                      bg={offline[userId].isOnline ? 'green.500' : 'gray.300'}
                    />
                  </Avatar>
                  <Text fontWeight={'semibold'} textTransform={'capitalize'}>
                    {offline[userId].username}
                  </Text>
                  {/* <Text>{offline[userId].username} is offline</Text> */}
                </Flex>
              ))}
            </Flex>
          </Box>
          <Divider orientation='vertical' />
          <Flex w='100%'>
            <Box w='100%' height={'100%'} p='1rem'>
              <Heading>Chat</Heading>
              <Box w='100%' height={'80%'}>
                {!selectedUserId && (
                  <Center w='100%' height={'100%'} color='gray.300'>
                    <Text fontSize={'1.5rem'} fontWeight={'semibold'}>
                      Select a user to start chatting
                    </Text>
                  </Center>
                )}
                {selectedUserId && (
                  <Flex
                    h='100%'
                    direction={'column'}
                    w='100%'
                    gap={'1rem'}
                    p='1rem'
                    overflow={'auto'}
                    pb='1rem'
                  >
                    {messagesWithoutDuplicates.map((message) => (
                      <Flex
                        w='100%'
                        p='1rem'
                        direction={message.sender == id ? 'row-reverse' : 'row'}
                        align={'center'}
                        gap={'1rem'}
                        key={message._id}
                      >
                        <Avatar
                          color={'white'}
                          background={
                            message.sender == id ? 'teal.400' : 'cyan.400'
                          }
                        />
                        <Flex
                          align={'center'}
                          w='40%'
                          h='100%'
                          bg='gray.200'
                          borderRadius={'xl'}
                          p={'.4rem'}
                        >
                          <Text
                            fontWeight={'semibold'}
                            textTransform={'capitalize'}
                            w='100%'
                          >
                            {message.text}
                          </Text>
                        </Flex>
                      </Flex>
                    ))}
                    <div ref={scrollToBottom}></div>
                  </Flex>
                )}
              </Box>
              {!!selectedUserId && (
                <form onSubmit={sendMessage}>
                  <Flex align={'center'} px='1rem' gap={'1rem'}>
                    <Input
                      placeholder='Type a message'
                      bg='white'
                      type='text'
                      value={newMessage.length > 0 ? newMessage : newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />

                    <Button
                      onClick={handleShowEmojis}
                      // icon={emojis.icon}
                    >
                      <BsEmojiSmile size={24} />
                      <Box
                        position='absolute'
                        bottom='3rem'
                        right='0'
                        zIndex={99}
                        display={showEmoji ? 'block' : 'none'}
                      >
                        <EmojiPicker
                          onEmojiClick={onClick}
                          native
                          searchPlaceholder={'Choose Your Emoji'}
                        />
                      </Box>
                    </Button>
                    <Button type='submit' colorScheme='teal'>
                      Send
                    </Button>
                  </Flex>
                </form>
              )}
            </Box>
          </Flex>
        </Flex>
      </Center>
    </Box>
  );
}
