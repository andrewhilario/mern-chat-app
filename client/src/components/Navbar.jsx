import { Avatar, Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import axios from 'axios';

export default function Navbar() {
  const { username, setId, setUsername } = useContext(UserContext);

  function logout() {
    axios.post('/logout').then((res) => {
      setId(null);
      setUsername(null);
    });
  }

  return (
    <Box bg='teal.400' w='100%' py='2rem'>
      <Flex
        align={'center'}
        justify={'space-between'}
        px={{
          base: '1rem',
          md: '5rem',
          lg: '10rem',
          xl: '15rem',
        }}
      >
        <Box></Box>
        <Flex align={'center'}>
          <Flex align={'center'} gap={'.4rem'} color={'white'}>
            <Text fontSize={'1.2rem'} fontWeight={'semibold'}>
              Welcome to Chat App,
            </Text>
            <Text
              fontSize={'1.2rem'}
              textTransform={'Capitalize'}
              fontWeight={'semibold'}
            >
              {username}
            </Text>
          </Flex>
          <Button colorScheme='teal' ml='1rem' onClick={logout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
