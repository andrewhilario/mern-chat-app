import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Hide,
  Input,
  Link,
  Text,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext.jsx';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('register'); // [true, false

  const { setUsername: setContextUsername, setId } = useContext(UserContext);

  async function handleSubmit(ev) {
    const url = isLoginOrRegister === 'register' ? 'register' : 'login';

    ev.preventDefault();
    const { data } = await axios.post(url, {
      username,
      email,
      password,
    });

    setContextUsername(username);
    setId(data.id);
    console.log(data);
  }

  return (
    <Box w='100%' h='100vh' bg='teal.200'>
      <Center h='100%'>
        <Box
          w={{
            base: '90%',
            md: '50%',
            lg: '30%',
          }}
          p='2rem'
          shadow='lg'
          bg='white'
          borderRadius={'lg'}
          color={'teal.700'}
        >
          <Heading py='1rem' textAlign={'center'}>
            Chat App
          </Heading>
          <Divider />
          <Heading fontSize={'1.2rem'} py='1rem'>
            {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
          </Heading>
          <form onSubmit={handleSubmit}>
            <Flex w='' direction='column' gap={'1rem'}>
              {isLoginOrRegister === 'register' && (
                <FormControl id='email'>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type='email'
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                  />
                </FormControl>
              )}
              <FormControl id='username'>
                <FormLabel>Username</FormLabel>
                <Input
                  type='text'
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                />
              </FormControl>
              <FormControl id='password'>
                <FormLabel>Password</FormLabel>
                <Input
                  type='password'
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                />
              </FormControl>
              <FormControl>
                <Button colorScheme='teal' type='submit'>
                  {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
                </Button>
              </FormControl>
              {isLoginOrRegister === 'register' ? (
                <Flex align={'center'}>
                  Already have an account?{' '}
                  <Button
                    variant={'ghost'}
                    py='0'
                    px='1'
                    onClick={() => setIsLoginOrRegister('login')}
                    _hover={{
                      background: 'none',
                    }}
                  >
                    Login
                  </Button>
                </Flex>
              ) : (
                <Flex align={'center'}>
                  Don't have an account{' '}
                  <Button
                    variant={'ghost'}
                    py='0'
                    px='1'
                    onClick={() => setIsLoginOrRegister('register')}
                    _hover={{
                      background: 'none',
                    }}
                  >
                    Register
                  </Button>
                </Flex>
              )}
            </Flex>
          </form>
        </Box>
      </Center>
    </Box>
  );
}
