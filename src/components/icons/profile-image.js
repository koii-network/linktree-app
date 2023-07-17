import React from "react";
import { Box } from "@chakra-ui/react";

function ProfileImageSvg() {
  return (
    <Box
      as='svg'
      role='img'
      width='124px'
      height='124px'
      viewBox='0 0 124 124'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      marginBottom='-5px'
    >
      <mask
        id='mask0_1244_6354'
        maskUnits='userSpaceOnUse'
        x='0'
        y='0'
        width='124'
        height='124'
      >
        <circle cx='62' cy='62' r='62' fill='#5ED9D1' fill-opacity='0.7' />
      </mask>
      <g mask='url(#mask0_1244_6354)'>
        <path
          d='M61.0415 67.0415C46.6213 67.0415 34.9478 55.368 34.9478 40.9478C34.9478 26.5275 46.6213 14.854 61.0415 14.854C75.4617 14.854 87.1352 26.5275 87.1352 40.9478C87.1352 55.368 75.4617 67.0415 61.0415 67.0415Z'
          fill='currentColor'
          stroke='currentColor'
          stroke-width='4.69688'
          stroke-miterlimit='10'
          stroke-linecap='round'
        />
        <path
          d='M99.4154 116.395C75.0613 126.168 47.7498 126.168 23.3956 116.395C20.0904 114.999 18.0029 111.858 18.0029 108.368V104.005C18.0029 84.6338 33.6592 68.9277 52.9686 68.9277H70.0165C89.3259 68.9277 104.982 84.6338 104.982 104.005V108.368C104.808 111.858 102.721 114.999 99.4154 116.395Z'
          fill='currentColor'
          stroke='currentColor'
          stroke-width='4.69688'
          stroke-miterlimit='10'
          stroke-linecap='round'
        />
      </g>
    </Box>
  );
}

export default ProfileImageSvg;
