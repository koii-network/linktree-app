import { Box } from "@chakra-ui/react";
import React, { useState } from "react";

export const PreviewImage = ({ file }) => {
  const [preview, setPreview] = useState(null);
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    setPreview(reader.result);
  };

  return (
    <Box display='flex' justifyContent='center'>
      <img src={preview} alt='User' className='user-image' />
    </Box>
  );
};
