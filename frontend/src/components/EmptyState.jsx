import { Box, Heading, Text } from '@chakra-ui/react';

export default function EmptyState({ title = 'Nothing here yet', message = 'There is no data to display.' }) {
  return (
    <Box borderWidth="1px" borderRadius="xl" p={{ base: 6, md: 10 }} textAlign="center" bg="white">
      <Heading size="md" mb="2">{title}</Heading>
      <Text color="gray.600">{message}</Text>
    </Box>
  );
}
