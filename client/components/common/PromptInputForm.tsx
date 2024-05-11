import { Box, TextField } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PromptInputForm = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const newPromptMutation = useMutation({
    mutationFn: async (userInput) => {
      const response = await axios.post('http://localhost:3000/gen-ai/query', {
        prompt: userInput.prompt });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Prompt sent successfully', data);
      navigate('/output');
    },
    onError: (error) => {
      console.error('Error sending prompt: ', error);
    },
  });

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    // console.log(inputValue);
    console.log('text typed into input bar: ', inputValue);
    newPromptMutation.mutate({ prompt: inputValue });
  };

  return (
    <div className="mt-48">
      <Box maxWidth="200px">
        <TextField.Root
          type="text"
          placeholder="Enter your prompt"
          value={inputValue}
          onChange={handleChange}
        />
      </Box>
      <button
        className="border-2"
        onClick={handleSubmit}
      >
        Generate
      </button>
    </div>
  );
};

export default PromptInputForm;
