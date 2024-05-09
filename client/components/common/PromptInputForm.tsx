import { Box, TextField } from '@radix-ui/themes';
import React, { useState } from 'react';

const PromptInputForm = () => {
  const [promptValue, setPromptValue] = useState('');

  const handleChange = (event) => {
    setPromptValue(event.target.value);
  };

  const handleSubmit = () => {
    // console.log(inputValue);
  };

  return (
    <div className="mt-48">
      <Box maxWidth="200px">
        <TextField.Root
          placeholder="Enter your prompt"
          value={promptValue}
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
