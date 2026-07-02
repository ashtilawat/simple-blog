import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Spinner,
  Text,
  useMediaQuery,
  VStack
} from '@chakra-ui/react';
import { ChatIcon, CloseIcon } from '@chakra-ui/icons';
import { getMaxMessageLength, sendChatMessage } from '../../services/chatApi';

const INITIAL_ASSISTANT_MESSAGE = {
  role: 'assistant',
  content:
    'Hi! Ask me anything about the author — background, skills, experience, or interests.',
  localOnly: true
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_ASSISTANT_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLargerThan1300, isLargerThan900] = useMediaQuery([
    '(min-width: 1300px)',
    '(min-width: 900px)'
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const maxMessageLength = getMaxMessageLength();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((open) => !open);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isLoading) {
      return;
    }

    if (trimmedInput.length > maxMessageLength) {
      setError(`Messages must be ${maxMessageLength} characters or fewer.`);
      return;
    }

    const userMessage = { role: 'user', content: trimmedInput };
    const conversationMessages = [...messages, userMessage].filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    );

    setMessages(conversationMessages);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      const apiMessages = conversationMessages
        .filter((message) => !message.localOnly)
        .map(({ role, content }) => ({ role, content }));

      const reply = await sendChatMessage(apiMessages);

      setMessages((current) => [...current, { role: 'assistant', content: reply }]);
    } catch (submitError) {
      setError(submitError.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const panelWidth = isLargerThan1300 ? '380px' : isLargerThan900 ? '340px' : 'calc(100vw - 32px)';
  const panelHeight = isLargerThan1300 ? '520px' : isLargerThan900 ? '480px' : 'min(70vh, 520px)';

  return (
    <Box position="fixed" bottom={4} right={4} zIndex={1000}>
      {isOpen && (
        <Box
          width={panelWidth}
          height={panelHeight}
          maxWidth="calc(100vw - 32px)"
          bg="gray.800"
          border="1px solid"
          borderColor="gray.600"
          borderRadius="md"
          boxShadow="2xl"
          display="flex"
          flexDirection="column"
          overflow="hidden"
          mb={3}
          fontFamily="Space Mono"
        >
          <Flex
            align="center"
            justify="space-between"
            px={4}
            py={3}
            borderBottom="1px solid"
            borderColor="gray.600"
            bg="gray.900"
          >
            <Text fontWeight="bold" fontSize="sm">
              Ask About the Author
            </Text>
            <IconButton
              aria-label="Close chatbot"
              icon={<CloseIcon boxSize={3} />}
              size="sm"
              variant="ghost"
              onClick={handleToggle}
            />
          </Flex>

          <VStack
            align="stretch"
            spacing={3}
            px={4}
            py={3}
            flex="1"
            overflowY="auto"
            bg="gray.800"
          >
            {messages.map((message, index) => (
              <Box
                key={`${message.role}-${index}`}
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                maxWidth="85%"
                px={3}
                py={2}
                borderRadius="md"
                bg={message.role === 'user' ? 'blue.600' : 'gray.700'}
              >
                <Text fontSize="sm" whiteSpace="pre-wrap">
                  {message.content}
                </Text>
              </Box>
            ))}

            {isLoading && (
              <Flex align="center" gap={2} color="gray.300">
                <Spinner size="sm" />
                <Text fontSize="sm">Thinking...</Text>
              </Flex>
            )}

            {error && (
              <Box
                px={3}
                py={2}
                borderRadius="md"
                bg="red.900"
                border="1px solid"
                borderColor="red.500"
              >
                <Text fontSize="sm" color="red.200">
                  {error}
                </Text>
              </Box>
            )}

            <Box ref={messagesEndRef} />
          </VStack>

          <Box as="form" onSubmit={handleSubmit} px={4} py={3} borderTop="1px solid" borderColor="gray.600">
            <Flex gap={2}>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Ask about the author..."
                size="sm"
                bg="gray.900"
                borderColor="gray.600"
                fontFamily="Space Mono"
                isDisabled={isLoading}
                maxLength={maxMessageLength + 100}
                aria-label="Chat message input"
              />
              <Button
                type="submit"
                size="sm"
                colorScheme="blue"
                fontFamily="Space Mono"
                isLoading={isLoading}
                isDisabled={isLoading || inputValue.trim().length === 0}
              >
                Send
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      <IconButton
        aria-label="Open chatbot"
        icon={<ChatIcon />}
        colorScheme="blue"
        size="lg"
        borderRadius="full"
        boxShadow="lg"
        fontFamily="Space Mono"
        onClick={handleToggle}
      />
    </Box>
  );
};
