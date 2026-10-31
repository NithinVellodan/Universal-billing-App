import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Icon, IconName } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { AnalyticsChart } from '../../components/charts/AnalyticsChart';

export const DashboardScreen: React.FC = () => {
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const {
    activeBusiness,
    dashboardMetrics,
    activeBusinessInvoices,
    activeBusinessProducts,
    tables,
    appointments,
    navigateTo,
    setSelectedInvoice,
    setActiveTab,
  } = useApp();

  const lowStockProducts = activeBusinessProducts.filter(
    (p) => p.stock <= p.minStockAlert
  );

  const quickActions: {
    id: string;
    label: string;
    icon: IconName;
    color: string;
    bg: string;
    onPress: () => void;
  }[] = [
    {
      id: 'create_bill',
      label: 'Create Bill',
      icon: 'billing',
      color: colors.white,
      bg: colors.primary,
      onPress: () => setActiveTab('billing'),
    },
    {
      id: 'add_product',
      label: 'Add Product',
      icon: 'plus',
      color: colors.primary,
      bg: colors.primarySoft,
      onPress: () => navigateTo('add_edit_product'),
    },
    {
      id: 'add_customer',
      label: 'Add Customer',
      icon: 'customer',
      color: colors.info,
      bg: colors.infoSoft,
      onPress: () => navigateTo('add_edit_customer'),
    },
    {
      id: 'scan_barcode',
      label: 'Scan Barcode',
      icon: 'barcode',
      color: colors.orangeAccent,
      bg: colors.orangeSoft,
      onPress: () => navigateTo('barcode_scanner'),
    },
    {
      id: 'record_expense',
      label: 'Record Expense',
      icon: 'expense',
      color: colors.warning,
      bg: colors.warningSoft,
      onPress: () => navigateTo('add_expense'),
    },
    {
      id: 'view_reports',
      label: 'View Reports',
      icon: 'reports',
      color: colors.success,
      bg: colors.successSoft,
      onPress: () => setActiveTab('reports'),
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Industry Banner Indicator */}
        <View
          style={[
            styles.industryBanner,
            {
              backgroundColor: colors.cardBackground,
              borderRadius: radius.lg,
              borderColor: colors.borderLight,
              ...shadows.sm,
            },
          ]}
        >
          <View style={styles.bannerLeft}>
            <Text
              style={[
                styles.welcomeText,
                {
                  color: colors.secondaryText,
                  fontSize: typography.fontSizes.xs,
                },
              ]}
            >
              POS & Business Console
            </Text>
            <Text
              style={[
                styles.businessNameHeading,
                {
                  color: colors.charcoal,
                  fontSize: typography.fontSizes.lg,
                  fontWeight: typography.fontWeights.bold,
                },
              ]}
            >
              {activeBusiness.name}
            </Text>
          </View>

          <Badge
            label={activeBusiness.industry.toUpperCase()}
            variant="primary"
            size="md"
          />
        </View>

        {/* Metric Cards Carousel / Grid */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.charcoal,
              fontSize: typography.fontSizes.md,
              fontWeight: typography.fontWeights.bold,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Performance Metrics
        </Text>

        <View style={styles.metricsGrid}>
          {/* Today's Sales - Hero Card */}
          <Card
            variant="cyan"
            style={[styles.heroMetricCard, { borderRadius: radius.xl }]}
          >
            <View style={styles.metricTopRow}>
              <View>
                <Text
                  style={[
                    styles.metricLabel,
                    {
                      color: colors.secondaryText,
                      fontSize: typography.fontSizes.xs,
                    },
                  ]}
                >
                  Today's Sales
                </Text>
                <Text
                  style={[
                    styles.heroMetricValue,
                    {
                      color: colors.primary,
                      fontSize: typography.fontSizes.display,
                      fontWeight: typography.fontWeights.extraBold,
                    },
                  ]}
                >
                  {activeBusiness.currencySymbol}
                  {dashboardMetrics.todaySales.toLocaleString('en-IN')}
                </Text>
              </View>

              <View
                style={[
                  styles.metricIconCircle,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Icon name="trending-up" size={20} color={colors.white} />
              </View>
            </View>

            <View style={styles.metricTrendRow}>
              <Badge label="+18.4% vs yesterday" variant="success" size="sm" />
              <Text
                style={[
                  styles.metricSubInfo,
                  {
                    color: colors.secondaryText,
                    fontSize: typography.fontSizes.xxs,
                    marginLeft: 6,
                  },
                ]}
              >
                Updated live
              </Text>
            </View>
          </Card>

          {/* 2-column Metric Cards */}
          <View style={styles.metricsRow}>
            {/* Total Revenue */}
            <Card style={styles.halfCard}>
              <Text style={[styles.metricLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                Total Revenue
              </Text>
              <Text style={[styles.subMetricValue, { color: colors.charcoal, fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold }]}>
                {activeBusiness.currencySymbol}{dashboardMetrics.totalRevenue.toLocaleString('en-IN')}
              </Text>
              <Text style={{ color: colors.success, fontSize: 11, fontWeight: '600', marginTop: 4 }}>
                ↑ High margins
              </Text>
            </Card>

            {/* Total Orders / Invoices */}
            <Card style={styles.halfCard}>
              <Text style={[styles.metricLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                Completed Bills
              </Text>
              <Text style={[styles.subMetricValue, { color: colors.charcoal, fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold }]}>
                {dashboardMetrics.totalOrders}
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 4 }}>
                Avg {activeBusiness.currencySymbol}680/order
              </Text>
            </Card>
          </View>

          <View style={styles.metricsRow}>
            {/* Total Expenses */}
            <Card style={styles.halfCard}>
              <Text style={[styles.metricLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                Store Expenses
              </Text>
              <Text style={[styles.subMetricValue, { color: colors.error, fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold }]}>
                {activeBusiness.currencySymbol}{dashboardMetrics.totalExpenses.toLocaleString('en-IN')}
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 4 }}>
                Utilities & Ops
              </Text>
            </Card>

            {/* Net Profit */}
            <Card style={styles.halfCard}>
              <Text style={[styles.metricLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                Net Profit
              </Text>
              <Text style={[styles.subMetricValue, { color: colors.success, fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold }]}>
                {activeBusiness.currencySymbol}{Math.max(0, dashboardMetrics.netProfit).toLocaleString('en-IN')}
              </Text>
              <Text style={{ color: colors.success, fontSize: 11, fontWeight: '600', marginTop: 4 }}>
                Healthy EBITDA
              </Text>
            </Card>
          </View>
        </View>

        {/* Quick Action Shortcuts */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.charcoal,
              fontSize: typography.fontSizes.md,
              fontWeight: typography.fontWeights.bold,
              marginTop: spacing.md,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Quick Operations
        </Text>

        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              activeOpacity={0.8}
              onPress={action.onPress}
              style={[
                styles.quickActionTile,
                {
                  backgroundColor: colors.cardBackground,
                  borderRadius: radius.lg,
                  ...shadows.sm,
                },
              ]}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor: action.bg,
                  },
                ]}
              >
                <Icon name={action.icon} size={20} color={action.color} />
              </View>
              <Text
                style={[
                  styles.quickActionText,
                  {
                    color: colors.charcoal,
                    fontSize: typography.fontSizes.xs,
                    fontWeight: typography.fontWeights.medium,
                  },
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dynamic Industry Adaptive Console */}
        {activeBusiness.industry === 'restaurant' && (
          <Card
            variant="elevated"
            style={[styles.industryConsoleCard, { marginTop: spacing.lg }]}
          >
            <View style={styles.consoleHeader}>
              <View style={styles.consoleHeaderLeft}>
                <Icon name="utensils" size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.consoleTitle,
                    {
                      color: colors.charcoal,
                      fontSize: typography.fontSizes.base,
                      fontWeight: typography.fontWeights.bold,
                      marginLeft: 8,
                    },
                  ]}
                >
                  Restaurant Dining & Tables
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigateTo('restaurant_tables')}
              >
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>
                  Floor View →
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tableStatsRow}>
              <View style={styles.tableStatPill}>
                <Text style={[styles.tableStatNum, { color: colors.success }]}>
                  {tables.filter((t) => t.status === 'AVAILABLE').length}
                </Text>
                <Text style={[styles.tableStatLabel, { color: colors.secondaryText }]}>
                  Available
                </Text>
              </View>
              <View style={styles.tableStatPill}>
                <Text style={[styles.tableStatNum, { color: colors.primary }]}>
                  {tables.filter((t) => t.status === 'OCCUPIED').length}
                </Text>
                <Text style={[styles.tableStatLabel, { color: colors.secondaryText }]}>
                  Occupied
                </Text>
              </View>
              <View style={styles.tableStatPill}>
                <Text style={[styles.tableStatNum, { color: colors.warning }]}>
                  {tables.filter((t) => t.status === 'BILLED').length}
                </Text>
                <Text style={[styles.tableStatLabel, { color: colors.secondaryText }]}>
                  Billed
                </Text>
              </View>
              <View style={styles.tableStatPill}>
                <Text style={[styles.tableStatNum, { color: colors.info }]}>
                  {tables.filter((t) => t.status === 'RESERVED').length}
                </Text>
                <Text style={[styles.tableStatLabel, { color: colors.secondaryText }]}>
                  Reserved
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigateTo('restaurant_kds')}
              style={[
                styles.kdsJumpButton,
                {
                  backgroundColor: colors.lightCyan,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Icon name="clock" size={16} color={colors.charcoal} />
              <Text
                style={{
                  color: colors.charcoal,
                  fontWeight: '600',
                  fontSize: 13,
                  marginLeft: 8,
                }}
              >
                Live Kitchen Display System (KDS Queue)
              </Text>
            </TouchableOpacity>
          </Card>
        )}

        {activeBusiness.industry === 'services' && (
          <Card
            variant="elevated"
            style={[styles.industryConsoleCard, { marginTop: spacing.lg }]}
          >
            <View style={styles.consoleHeader}>
              <View style={styles.consoleHeaderLeft}>
                <Icon name="scissors" size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.consoleTitle,
                    {
                      color: colors.charcoal,
                      fontSize: typography.fontSizes.base,
                      fontWeight: typography.fontWeights.bold,
                      marginLeft: 8,
                    },
                  ]}
                >
                  Today's Appointments
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigateTo('service_appointments')}
              >
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>
                  Manage →
                </Text>
              </TouchableOpacity>
            </View>

            {appointments.slice(0, 2).map((apt) => (
              <View
                key={apt.id}
                style={[
                  styles.aptItem,
                  {
                    borderBottomColor: colors.borderLight,
                  },
                ]}
              >
                <View style={styles.aptTime}>
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
                    {apt.time}
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 10 }}>
                    {apt.durationMinutes}m
                  </Text>
                </View>
                <View style={styles.aptDetails}>
                  <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13 }}>
                    {apt.customerName}
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                    {apt.serviceName} • {apt.staffName}
                  </Text>
                </View>
                <Badge
                  label={apt.status}
                  variant={apt.status === 'COMPLETED' ? 'success' : 'primary'}
                  size="sm"
                />
              </View>
            ))}
          </Card>
        )}

        {/* Analytics Chart */}
        <View style={{ marginTop: spacing.lg }}>
          <AnalyticsChart />
        </View>

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <Card
            variant="outlined"
            style={[
              styles.alertCard,
              {
                borderColor: colors.warning,
                backgroundColor: colors.warningSoft,
                marginBottom: spacing.lg,
              },
            ]}
          >
            <View style={styles.alertHeader}>
              <Icon name="alert-circle" size={18} color={colors.warning} />
              <Text
                style={[
                  styles.alertTitle,
                  {
                    color: colors.charcoal,
                    fontSize: typography.fontSizes.sm,
                    fontWeight: typography.fontWeights.bold,
                    marginLeft: 6,
                  },
                ]}
              >
                Low Stock Warning ({lowStockProducts.length} items)
              </Text>
            </View>

            {lowStockProducts.map((p) => (
              <View key={p.id} style={styles.alertItemRow}>
                <Text style={{ color: colors.charcoal, fontSize: 12, flex: 1 }} numberOfLines={1}>
                  {p.name}
                </Text>
                <Badge
                  label={`Only ${p.stock} left`}
                  variant="warning"
                  size="sm"
                />
              </View>
            ))}
          </Card>
        )}

        {/* Recent Invoices Section */}
        <View style={styles.recentSectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.md,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            Recent Invoices
          </Text>

          <TouchableOpacity onPress={() => setActiveTab('invoices')}>
            <Text
              style={{
                color: colors.primary,
                fontSize: typography.fontSizes.xs,
                fontWeight: '700',
              }}
            >
              See All Invoices →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.invoicesList}>
          {activeBusinessInvoices.slice(0, 3).map((inv) => (
            <Card
              key={inv.id}
              style={styles.invoiceItemCard}
              onPress={() => {
                setSelectedInvoice(inv);
                navigateTo('invoice_preview');
              }}
            >
              <View style={styles.invLeft}>
                <View
                  style={[
                    styles.invIcon,
                    {
                      backgroundColor: colors.primarySoft,
                    },
                  ]}
                >
                  <Icon name="receipt" size={18} color={colors.primary} />
                </View>

                <View style={styles.invInfo}>
                  <Text
                    style={[
                      styles.invNum,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.base,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    {inv.invoiceNumber}
                  </Text>
                  <Text
                    style={[
                      styles.invCust,
                      {
                        color: colors.secondaryText,
                        fontSize: typography.fontSizes.xs,
                      },
                    ]}
                  >
                    {inv.customer?.name || 'Walk-in Customer'} • {inv.time}
                  </Text>
                </View>
              </View>

              <View style={styles.invRight}>
                <Text
                  style={[
                    styles.invAmount,
                    {
                      color: colors.charcoal,
                      fontSize: typography.fontSizes.base,
                      fontWeight: typography.fontWeights.extraBold,
                    },
                  ]}
                >
                  {activeBusiness.currencySymbol}
                  {inv.grandTotal.toLocaleString('en-IN')}
                </Text>
                <Badge
                  label={inv.status}
                  variant={inv.status === 'PAID' ? 'success' : 'warning'}
                  size="sm"
                />
              </View>
            </Card>
          ))}
        </View>
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
  industryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerLeft: {},
  welcomeText: {
    letterSpacing: 0.5,
  },
  businessNameHeading: {
    marginTop: 2,
    letterSpacing: -0.2,
  },
  sectionTitle: {
    letterSpacing: -0.2,
  },
  metricsGrid: {
    marginBottom: 8,
  },
  heroMetricCard: {
    padding: 18,
    marginBottom: 10,
  },
  metricTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricLabel: {
    letterSpacing: 0.2,
  },
  heroMetricValue: {
    letterSpacing: -0.5,
    marginTop: 4,
  },
  metricIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metricSubInfo: {},
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  halfCard: {
    flex: 1,
    padding: 14,
  },
  subMetricValue: {
    marginTop: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionTile: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionText: {
    textAlign: 'center',
  },
  industryConsoleCard: {
    padding: 14,
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  consoleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consoleTitle: {},
  tableStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  tableStatPill: {
    alignItems: 'center',
  },
  tableStatNum: {
    fontSize: 20,
    fontWeight: '800',
  },
  tableStatLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  kdsJumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  aptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  aptTime: {
    width: 65,
  },
  aptDetails: {
    flex: 1,
  },
  alertCard: {
    padding: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {},
  alertItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  recentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  invoicesList: {
    gap: 8,
  },
  invoiceItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  invLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  invIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  invInfo: {
    flex: 1,
  },
  invNum: {},
  invCust: {
    marginTop: 2,
  },
  invRight: {
    alignItems: 'flex-end',
  },
  invAmount: {
    marginBottom: 4,
  },
});
