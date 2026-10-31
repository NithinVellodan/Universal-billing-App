import React from 'react';
import {
  View,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat' | 'cyan';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'elevated',
  padding = 'md',
}) => {
  const { colors, radius, shadows, spacing } = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return spacing.sm;
      case 'lg':
        return spacing.xl;
      case 'md':
      default:
        return spacing.lg;
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'cyan':
        return {
          backgroundColor: colors.lightCyan,
          borderWidth: 1,
          borderColor: colors.lightCyanBorder,
        };
      case 'flat':
        return {
          backgroundColor: colors.borderLight,
        };
      case 'elevated':
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.borderLight,
          ...shadows.sm,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius: radius.lg,
    padding: getPadding(),
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
