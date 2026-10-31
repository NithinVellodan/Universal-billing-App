import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cyan' | 'orange' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { colors, typography, radius, shadows } = useTheme();

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: disabled ? colors.mutedText : colors.primary,
            ...(disabled ? {} : shadows.redGlow),
          },
          text: { color: colors.white },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: disabled ? colors.border : colors.charcoal,
          },
          text: { color: colors.white },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: disabled ? colors.border : colors.primary,
          },
          text: { color: disabled ? colors.mutedText : colors.primary },
        };
      case 'cyan':
        return {
          button: {
            backgroundColor: colors.lightCyan,
            borderWidth: 1,
            borderColor: colors.lightCyanBorder,
          },
          text: { color: colors.charcoal },
        };
      case 'orange':
        return {
          button: {
            backgroundColor: colors.orangeAccent,
            ...shadows.orangeGlow,
          },
          text: { color: colors.white },
        };
      case 'danger':
        return {
          button: {
            backgroundColor: colors.error,
          },
          text: { color: colors.white },
        };
      case 'ghost':
      default:
        return {
          button: {
            backgroundColor: 'transparent',
          },
          text: { color: colors.charcoal },
        };
    }
  };

  const getSizeStyles = (): { button: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          button: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: radius.md,
          },
          text: {
            fontSize: typography.fontSizes.xs,
          },
        };
      case 'lg':
        return {
          button: {
            paddingVertical: 14,
            paddingHorizontal: 22,
            borderRadius: radius.lg,
          },
          text: {
            fontSize: typography.fontSizes.md,
          },
        };
      case 'md':
      default:
        return {
          button: {
            paddingVertical: 11,
            paddingHorizontal: 18,
            borderRadius: radius.md,
          },
          text: {
            fontSize: typography.fontSizes.base,
          },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        vStyles.button,
        sStyles.button,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={vStyles.text.color || colors.white}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              {
                fontWeight: typography.fontWeights.semiBold,
              },
              vStyles.text,
              sStyles.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 6,
  },
  iconRight: {
    marginLeft: 6,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
});
