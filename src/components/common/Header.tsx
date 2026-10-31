import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Icon } from './Icon';
import { Badge } from './Badge';
import { BusinessSwitcherModal } from '../navigation/BusinessSwitcherModal';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, isDark } = useTheme();
  const {
    activeBusiness,
    notifications,
    navigateTo,
    goBack,
  } = useApp();

  const [switcherVisible, setSwitcherVisible] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      goBack();
    }
  };

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case 'supermarket':
        return '#16A36A'; // Emerald
      case 'restaurant':
        return '#FF982E'; // Orange
      case 'pharmacy':
        return '#2563EB'; // Blue
      case 'fashion':
        return '#9333EA'; // Purple
      case 'wholesale':
        return '#D97706'; // Amber
      case 'services':
        return '#EC4899'; // Pink
      default:
        return colors.primary;
    }
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.xs,
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.borderLight,
          },
        ]}
      >
        {showBack ? (
          <View style={styles.subHeaderRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={[
                styles.backButton,
                {
                  backgroundColor: colors.borderLight,
                },
              ]}
            >
              <Icon name="chevron-left" size={20} color={colors.charcoal} />
            </TouchableOpacity>

            <View style={styles.titleColumn}>
              <Text
                numberOfLines={1}
                style={[
                  styles.titleText,
                  {
                    color: colors.charcoal,
                    fontSize: typography.fontSizes.lg,
                    fontWeight: typography.fontWeights.bold,
                  },
                ]}
              >
                {title || 'Details'}
              </Text>
              {subtitle && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.subtitleText,
                    {
                      color: colors.secondaryText,
                      fontSize: typography.fontSizes.xs,
                    },
                  ]}
                >
                  {subtitle}
                </Text>
              )}
            </View>

            {rightAction ? (
              <View style={styles.rightActionContainer}>{rightAction}</View>
            ) : (
              <View style={{ width: 36 }} />
            )}
          </View>
        ) : (
          <View style={styles.mainHeaderRow}>
            {/* Business Logo & Switcher */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSwitcherVisible(true)}
              style={styles.businessSelector}
            >
              <View
                style={[
                  styles.logoBadge,
                  {
                    backgroundColor: getIndustryColor(activeBusiness.industry),
                  },
                ]}
              >
                <Text style={styles.logoBadgeText}>
                  {activeBusiness.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={styles.businessTextGroup}>
                <View style={styles.nameRow}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.businessName,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.md,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    {activeBusiness.name}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={16}
                    color={colors.secondaryText}
                  />
                </View>

                <View style={styles.categoryPillRow}>
                  <Badge
                    label={activeBusiness.subcategory || activeBusiness.industry}
                    variant="cyan"
                    size="sm"
                  />
                  <Text
                    style={[
                      styles.locationText,
                      {
                        color: colors.mutedText,
                        fontSize: typography.fontSizes.xxs,
                        marginLeft: 6,
                      },
                    ]}
                  >
                    {activeBusiness.city}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Header Right Actions */}
            <View style={styles.rightActionsRow}>
              {/* Notification Icon */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('notifications')}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colors.borderLight,
                  },
                ]}
              >
                <Icon name="bell" size={20} color={colors.charcoal} />
                {unreadCount > 0 && (
                  <View
                    style={[
                      styles.unreadDot,
                      {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.unreadCountText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Profile Avatar / Settings */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigateTo('settings')}
                style={[
                  styles.avatarButton,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.primarySoft,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    {
                      color: colors.primary,
                      fontSize: typography.fontSizes.xs,
                      fontWeight: typography.fontWeights.bold,
                    },
                  ]}
                >
                  NV
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <BusinessSwitcherModal
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  mainHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
    marginHorizontal: 12,
  },
  titleText: {
    letterSpacing: -0.2,
  },
  subtitleText: {
    marginTop: 1,
  },
  rightActionContainer: {
    minWidth: 36,
    alignItems: 'flex-end',
  },
  businessSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  businessTextGroup: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  businessName: {
    maxWidth: 160,
  },
  categoryPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {},
  rightActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {},
});
