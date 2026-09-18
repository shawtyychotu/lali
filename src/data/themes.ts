import { CurtainTheme, FlavorConfig } from '../types';

export const WHITE_CURTAIN_THEME: CurtainTheme = {
  id: 'pure-white',
  name: 'Pure White',
  bgClass: 'bg-white',
  bgHex: '#FFFFFF',
  textColor: '#000000',
  accentColor: '#000000',
};

export const COLORFUL_LOLLIPOP: FlavorConfig = {
  id: 'rainbow-candy-spiral',
  name: 'Vibrant Rainbow Swirl',
  description: 'Bright rainbow confectionery candy spiral',
  colors: ['#FF1E56', '#FF8C00', '#FFD700', '#00C853', '#00B0FF', '#7C4DFF'],
  glowColor: 'rgba(255, 30, 86, 0.35)',
  accentColor: '#FF1E56',
};
