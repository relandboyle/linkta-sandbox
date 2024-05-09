import React from 'react';
import { TextField } from '@radix-ui/themes';

const PromptInputForm = () => {
  return (
    <form className="mt-48">
    <TextField.Root placeholder="Generateeeee">
      <TextField.Slot>

      </TextField.Slot>
    </TextField.Root>
    <button className="border-2" type="submit">Generate</button>
    </form>
  )
};

export default PromptInputForm;
