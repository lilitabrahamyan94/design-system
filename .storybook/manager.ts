import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Design System',
    fontBase: '"Inter", system-ui, sans-serif',
    colorPrimary: '#006ECE',
    colorSecondary: '#006ECE',
    appBg: '#F5F5F5',
    appContentBg: '#FFFFFF',
    appBorderColor: '#EBEBEB',
    textColor: '#141414',
    barSelectedColor: '#006ECE',
  }),
});
