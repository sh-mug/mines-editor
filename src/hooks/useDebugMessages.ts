import { useCallback, useState } from 'react';

function useDebugMessages() {
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = useCallback((message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  return { messages, addMessage };
}

export default useDebugMessages;
