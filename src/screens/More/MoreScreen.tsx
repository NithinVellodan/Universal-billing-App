import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon, IconName } from '../../components/common/Icon';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  iconColor: string;
  iconBg: string;
  badge?: string;
  onPress: () => void;
}

export const MoreScreen: React.FC = () => {
  const { colors, typography, radius, spacing, isDark, toggleTheme } = useTheme();
  const {
    activeBusiness,
    activeBusinessProducts,
    activeBusinessCustomers,
    tables,
    kots,
    appointments,
    navigateTo,
  } = useApp();

  const managementSections: {
    category: string;
    items: MenuItem[];
  }[] = [
    {
      category: 'CORE BUSINESS ASSETS',
      items: [
        {
          id: 'products',
          title: 'Products & Inventory',
          subtitle: `${activeBusinessProducts.length} items • SKU & variants`,
          icon: 'cart',
          iconColor: colors.primary,
          iconBg: colors.primarySoft,
          onPress: () => navigateTo('product_management'),
        },
        {
          id: 'customers',
          title: 'Customers & CRM',
          subtitle: `${activeBusinessCustomers.length} registered • Loyalty & balances`,
          icon: 'customer',
          iconColor: colors.info,
          iconBg: colors.infoSoft,
          onPress: () => navigateTo('customer_management'),
        },
        {
          id: 'barcode_scanner',
          title: 'Barcode Scanner Tool',
          subtitle: 'Scan UPC/EAN barcodes for fast POS lookup',
          icon: 'barcode',
          iconColor: colors.orangeAccent,
          iconBg: colors.orangeSoft,
          onPress: () => navigateTo('barcode_scanner'),
        },
      ],
    },
    {
      category: 'INDUSTRY SPECIFIC MODULES',
      items: [
        {
          id: 'rest_tables',
          title: 'Restaurant Tables Floor Plan',
          subtitle: `${tables.length} tables • Live dining & bills`,
          icon: 'table',
          iconColor: '#16A36A',
          iconBg: '#E6F7EF',
          badge: 'Dining',
          onPress: () => navigateTo('restaurant_tables'),
        },
        {
          id: 'rest_kds',
          title: 'Kitchen Display System (KDS)',
          subtitle: `${kots.length} active tickets • Chef queue`,
          icon: 'utensils',
          iconColor: '#EA580C',
          iconBg: '#FFEDD5',
          badge: 'KOT',
          onPress: () => navigateTo('restaurant_kds'),
        },
        {
          id: 'pharma_batches',
          title: 'Pharmacy Batch & Expiry Tracker',
          subtitle: 'Track batch numbers, Mfg, and expiry warnings',
          icon: 'pill',
          iconColor: '#2563EB',
          iconBg: '#EFF6FF',
          badge: 'Pharma',
          onPress: () => navigateTo('pharmacy_batches'),
        },
        {
          id: 'service_appointments',
          title: 'Salon & Service Appointments',
          subtitle: `${appointments.length} slots • Staff scheduling`,
          icon: 'scissors',
          iconColor: '#9333EA',
          iconBg: '#F3E8FF',
          badge: 'Services',
          onPress: () => navigateTo('service_appointments'),
        },
      ],
    },
    {
      category: 'FINANCE & OPERATIONS',
      items: [
        {
          id: 'expenses',
          title: 'Expense Management',
          subtitle: 'Record overheads, utilities & vendor payouts',
          icon: 'expense',
          iconColor: colors.warning,
          iconBg: colors.warningSoft,
          onPress: () => navigateTo('expense_manager'),
        },
        {
          id: 'purchases',
          title: 'Purchase Orders & Suppliers',
          subtitle: 'Supplier invoices & incoming shipments',
          icon: 'truck',
          iconColor: colors.charcoal,
          iconBg: colors.borderLight,
          onPress: () => navigateTo('purchase_manager'),
        },
        {
          id: 'staff',
          title: 'Employees & Permissions',
          subtitle: 'Cashier, manager & admin role access',
          icon: 'users',
          iconColor: '#0D9488',
          iconBg: '#CCFBF1',
          onPress: () => navigateTo('staff_manager'),
        },
        {
          id: 'branches',
          title: 'Multi-Branch Locations',
          subtitle: '2 active branches in Kochi network',
          icon: 'building',
          iconColor: '#4F46E5',
          iconBg: '#EEF2FF',
          onPress: () => navigateTo('branch_manager'),
        },
      ],
    },
    {
      category: 'PREFERENCES & ONBOARDING',
      items: [
        {
          id: 'onboarding',
          title: 'Business Onboarding Wizard',
          subtitle: 'Add new business, industry categories, or branches',
          icon: 'store',
          iconColor: colors.primary,
          iconBg: colors.primarySoft,
          onPress: () => navigateTo('onboarding'),
        },
        {
          id: 'settings',
          title: 'App & Invoice Settings',
          subtitle: 'GST, thermal printer 80mm, invoice templates',
          icon: 'settings',
          iconColor: colors.charcoal,
          iconBg: colors.borderLight,
          onPress: () => navigateTo('settings'),
        },
      ],
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Active Business Profile Card */}
        <Card
          variant="cyan"
          style={[styles.profileCard, { borderRadius: radius.xl }]}
        >
          <View style={styles.profileRow}>
            <View
              style={[
                styles.profileAvatar,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.profileAvatarText}>
                {activeBusiness.name.slice(0, 2).toUpperCase()}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text
                  style={[
                    styles.profileName,
                    {
                      color: colors.charcoal,
                      fontSize: typography.fontSizes.base,
                      fontWeight: typography.fontWeights.bold,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {activeBusiness.name}
                </Text>
                <Badge label="Verified" variant="success" size="sm" />
              </View>

              <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 2 }}>
                {activeBusiness.subcategory} • GST: {activeBusiness.gstin || 'None'}
              </Text>
              <Text style={{ color: colors.mutedText, fontSize: 11, marginTop: 1 }}>
                Logged in as: Nithin V. (Administrator)
              </Text>
            </View>
          </View>
        </Card>

        {/* Dark Mode Toggle Card */}
        <Card style={styles.darkModeCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              name={isDark ? 'moon' : 'sun'}
              size={20}
              color={colors.primary}
            />
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  color: colors.charcoal,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                Dark Theme Mode
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                {isDark ? 'OLED Dark mode enabled' : 'Light clean mode enabled'}
              </Text>
            </View>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </Card>

        {/* Menu Sections */}
        {managementSections.map((sec, secIdx) => (
          <View key={secIdx} style={styles.menuSection}>
            <Text
              style={[
                styles.sectionCategoryHeader,
                {
                  color: colors.secondaryText,
                  fontSize: typography.fontSizes.xs,
                  fontWeight: typography.fontWeights.bold,
                  marginBottom: 8,
                },
              ]}
            >
              {sec.category}
            </Text>

            <Card padding="none" style={styles.menuCardWrapper}>
              {sec.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={item.onPress}
                  style={[
                    styles.menuItemRow,
                    {
                      borderBottomColor: colors.borderLight,
                      borderBottomWidth:
                        idx === sec.items.length - 1 ? 0 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.itemIconCircle,
                      { backgroundColor: item.iconBg },
                    ]}
                  >
                    <Icon name={item.icon} size={18} color={item.iconColor} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text
                        style={[
                          styles.menuItemTitle,
                          {
                            color: colors.charcoal,
                            fontSize: typography.fontSizes.sm,
                            fontWeight: typography.fontWeights.bold,
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.badge && (
                        <Badge label={item.badge} variant="cyan" size="sm" />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.menuItemSubtitle,
                        {
                          color: colors.secondaryText,
                          fontSize: typography.fontSizes.xs,
                          marginTop: 2,
                        },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  <Icon
                    name="chevron-right"
                    size={16}
                    color={colors.mutedText}
                  />
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    padding: 16,
    marginBottom: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  profileName: {
    maxWidth: 180,
  },
  darkModeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    marginBottom: 16,
  },
  menuSection: {
    marginBottom: 16,
  },
  sectionCategoryHeader: {
    letterSpacing: 0.5,
  },
  menuCardWrapper: {
    overflow: 'hidden',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {},
  menuItemSubtitle: {},
});
