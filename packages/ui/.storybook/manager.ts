import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

const nyxisTheme = create({
  base: 'dark',
  brandTitle: 'Nyxis',
  brandUrl: 'https://github.com/juliodaal/nyxis',
  brandTarget: '_blank',

  colorPrimary: '#A855F7',
  colorSecondary: '#A855F7',

  appBg: '#1a1722',
  appContentBg: '#221d2c',
  appPreviewBg: '#0e0c14',
  appBorderColor: 'rgba(255,255,255,0.08)',
  appBorderRadius: 8,

  textColor: '#f4f1f8',
  textInverseColor: '#1a1722',

  barTextColor: '#bdb5cf',
  barSelectedColor: '#A855F7',
  barHoverColor: '#cbb6f0',
  barBg: '#1a1722',

  inputBg: '#221d2c',
  inputBorder: 'rgba(255,255,255,0.08)',
  inputTextColor: '#f4f1f8',
  inputBorderRadius: 6,
});

addons.setConfig({
  theme: nyxisTheme,
  enableShortcuts: true,
  showToolbar: true,
});
