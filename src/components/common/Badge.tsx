import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'cyan' | 'orange';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  style,
  textStyle,
  icon,
}) => {
  const { colors, typography, radius } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primarySoft, text: colors.primary };
      case 'success':
        return { bg: colors.successSoft, text: colors.success };
      case 'warning':
        return { bg: colors.warningSoft, text: colors.warning };
      case 'error':
        return { bg: colors.errorSoft, text: colors.error };
      case 'info':
        return { bg: colors.infoSoft, text: colors.info };
      case 'cyan':
        return { bg: colors.lightCyan, text: colors.charcoal };
      case 'orange':
        return { bg: colors.orangeSoft, text: colors.orangeAccent };
      case 'neutral':
      default:
        return { bg: colors.borderLight, text: colors.secondaryText };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderRadius: radius.round,
          paddingHorizontal: size === 'sm' ? 6 : 10,
          paddingVertical: size === 'sm' ? 2 : 4,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: text,
            fontSize: size === 'sm' ? typography.fontSizes.xxs : typography.fontSizes.xs,
            fontWeight: typography.fontWeights.semiBold,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
