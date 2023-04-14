import { Avatar, AvatarBadge, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export default function Users({ id, onClick, username, selected }) {
  return (
    <Flex
      w='100%'
      key={id}
      align={'center'}
      gap={'1rem'}
      cursor={'pointer'}
      p='.5rem'
      borderRadius={'lg'}
      onClick={() => onClick(id)}
      background={selected ? 'teal.400' : 'white'}
      color={selected ? 'white' : 'black'}
    >
      <Avatar name={username} color={'white'}>
        <AvatarBadge boxSize='1.25em' bg='green.500' />
      </Avatar>
      <Text fontWeight={'semibold'} textTransform={'capitalize'}>
        {username}
      </Text>
    </Flex>
  );
}
