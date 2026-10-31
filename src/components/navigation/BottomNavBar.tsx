import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Icon, IconName } from '../common/Icon';
import { MainTabType } from '../../types';

interface TabItem {
  id: MainTabType;
  label: string;
  icon: IconName;
}

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'billing', label: 'Billing', icon: 'billing' },
  { id: 'invoices', label: 'Invoices', icon: 'invoices' },
  { id: 'reports', label: 'Reports', icon: 'reports' },
  { id: 'more', label: 'More', icon: 'more' },
];

export const BottomNavBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors, typography, shadows } = useTheme();
  const { activeTab, setActiveTab, cartTotals } = useApp();

  return (
    <View
      style={[
        styles.navContainer,
        {
          paddingBottom: Math.max(insets.bottom, 10),
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.borderLight,
          ...shadows.md,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const isBilling = tab.id === 'billing';

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.id)}
            style={styles.tabButton}
          >
            <View style={styles.iconContainer}>
              <View
                style={[
                  styles.iconHighlight,
                  isActive && {
                    backgroundColor: colors.primarySoft,
                  },
                ]}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  color={isActive ? colors.primary : colors.secondaryText}
                  strokeWidth={isActive ? 2.3 : 1.8}
                />
              </View>

              {/* Cart badge on billing tab */}
              {isBilling && cartTotals.itemCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {cartTotals.itemCount > 99 ? '99+' : cartTotals.itemCount}
                  </Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.tabLabel,
                {
                  color: isActive ? colors.primary : colors.secondaryText,
                  fontSize: typography.fontSizes.xxs,
                  fontWeight: isActive
                    ? typography.fontWeights.bold
                    : typography.fontWeights.medium,
                },
              ]}
            >
              {tab.label}
            </Text>

            {isActive && (
              <View
                style={[
                  styles.activeDot,
                  {
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    height: 48,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 16,
  },
  tabLabel: {
    marginTop: 2,
    letterSpacing: 0.2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: -4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
