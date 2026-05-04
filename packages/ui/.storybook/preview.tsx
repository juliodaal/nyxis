import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import './preview-tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    layout: 'padded',
    options: {
      storySort: {
        order: ['Foundations', 'Theme', 'Components', 'Animations', 'Domain Patterns'],
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Re-enable color-contrast at story level by exception only.
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
        },
      },
    },
  },
  decorators: [
    withThemeByDataAttribute<typeof Preview>({
      themes: {
        light: 'light',
        dark: 'dark',
        dim: 'dim',
        'high contrast': 'high-contrast',
      },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;
