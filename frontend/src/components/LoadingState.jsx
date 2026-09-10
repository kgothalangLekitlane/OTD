import { Center, Spinner, Stack, Text } from '@chakra-ui/react';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <Center py={{ base: 10, md: 16 }}>
      <Stack align="center" gap="3">
        <Spinner size="lg" />
        <Text color="gray.600">{message}</Text>
      </Stack>
    </Center>
  );
}
