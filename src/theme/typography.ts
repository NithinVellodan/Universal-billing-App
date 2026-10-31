import { TextStyle } from 'react-native';

export const typography = {
  fontSizes: {
    xxs: 10,
    xs: 12,
    sm: 13,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    display: 30,
    hero: 36,
  },
  fontWeights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semiBold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extraBold: '800' as TextStyle['fontWeight'],
  },
  lineHeights: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    loose: 28,
    display: 36,
  },
};
