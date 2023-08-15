// theme.ts (tsx file with usage of StyleFunctions, see 4.)
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Radio: {
      variants: {
        primary: ({ colorScheme = "primary" }) => ({
          color: `${colorScheme}.500`,
          control: {
            _checked: {
              color: "var(--koii-choose-color)",
            },
          },
        }),
      },
      defaultProps: {
        variant: "primary",
        colorScheme: "primary",
      },
    },
  },
});

export default theme;
