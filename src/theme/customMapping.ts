import {mapping} from "@eva-design/eva";

export const customMapping = {
  ...mapping,
  components: {
    ...mapping.components,
    Text: {
      meta: {
        scope: "all",
      },
      appearances: {
        default: {
          mapping: {
            fontFamily: "Montserrat-Regular", // Correct property
          },
        },
      },
    },
    Button: {
      meta: {
        scope: "all",
      },
      appearances: {
        filled: {
          mapping: {
            borderRadius: 10, // Corrected to camelCase
            paddingVertical: 12,
            paddingHorizontal: 24,
            textFontFamily: "Montserrat-Regular", // Correct key for text font
            textTransform: "uppercase",
          },
        },
      },
    },
    Input: {
      meta: {
        scope: "all",
      },
      appearances: {
        default: {
          mapping: {
            borderRadius: 10,
            textFontFamily: "Montserrat-Regular",
          },
        },
      },
    },
    Card: {
      meta: {
        scope: "all",
      },
      appearances: {
        default: {
          mapping: {
            borderRadius: 16,
            paddingVertical: 20,
            paddingHorizontal: 20,
            backgroundColor: "#FFFFFF", // Correct property name
          },
        },
      },
    },
  },
};
