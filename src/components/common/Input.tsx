import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { useTheme } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  prefix?: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  prefix,
  suffix,
  placeholderTextColor,
  ...rest
}) => {
  const { colors, typography, radius, spacing } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: colors.charcoal,
              fontSize: typography.fontSizes.xs,
              fontWeight: typography.fontWeights.medium,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.cardBackground,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        {prefix && (
          <Text
            style={[
              styles.affixText,
              {
                color: colors.secondaryText,
                fontSize: typography.fontSizes.base,
                fontWeight: typography.fontWeights.medium,
                marginRight: 4,
              },
            ]}
          >
            {prefix}
          </Text>
        )}

        <TextInput
          placeholderTextColor={placeholderTextColor || colors.mutedText}
          style={[
            styles.input,
            {
              color: colors.charcoal,
              fontSize: typography.fontSizes.base,
            },
            inputStyle,
          ]}
          {...rest}
        />

        {suffix && (
          <Text
            style={[
              styles.affixText,
              {
                color: colors.secondaryText,
                fontSize: typography.fontSizes.base,
                fontWeight: typography.fontWeights.medium,
                marginLeft: 4,
              },
            ]}
          >
            {suffix}
          </Text>
        )}

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.error,
              fontSize: typography.fontSizes.xxs,
              marginTop: spacing.xxs,
            },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 46,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  iconContainer: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  affixText: {},
  errorText: {
    letterSpacing: 0.2,
  },
});
