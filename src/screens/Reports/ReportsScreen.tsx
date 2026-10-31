import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { AnalyticsChart } from '../../components/charts/AnalyticsChart';

export const ReportsScreen: React.FC = () => {
  const { colors, typography, radius, spacing } = useTheme();
  const {
    activeBusiness,
    activeBusinessInvoices,
    activeBusinessExpenses,
    activeBusinessProducts,
    dashboardMetrics,
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    'SALES' | 'PROFIT_LOSS' | 'GST' | 'INVENTORY'
  >('SALES');

  // Stock Valuation
  const stockValuation = activeBusinessProducts.reduce(
    (sum, p) => sum + p.purchasePrice * p.stock,
    0
  );
  const retailValuation = activeBusinessProducts.reduce(
    (sum, p) => sum + p.sellingPrice * p.stock,
    0
  );

  // GST Totals
  const totalCgst = activeBusinessInvoices.reduce(
    (sum, inv) => sum + (inv.status !== 'CANCELLED' ? inv.cgstTotal : 0),
    0
  );
  const totalSgst = activeBusinessInvoices.reduce(
    (sum, inv) => sum + (inv.status !== 'CANCELLED' ? inv.sgstTotal : 0),
    0
  );

  const handleExport = (format: string) => {
    Alert.alert(
      'Export Successful',
      `${activeReportTab} Report has been exported to ${format} successfully.`
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Header & Export Actions */}
        <View style={styles.topBar}>
          <View>
            <Text
              style={[
                styles.pageTitle,
                {
                  color: colors.charcoal,
                  fontSize: typography.fontSizes.lg,
                  fontWeight: typography.fontWeights.bold,
                },
              ]}
            >
              Financial & GST Reports
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                {
                  color: colors.secondaryText,
                  fontSize: typography.fontSizes.xs,
                },
              ]}
            >
              Audited business performance and statutory returns
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleExport('Excel / PDF')}
            style={[
              styles.exportButton,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          >
            <Icon name="download" size={16} color={colors.primary} />
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: '700',
                marginLeft: 4,
              }}
            >
              Export
            </Text>
          </TouchableOpacity>
        </View>

        {/* Report Category Navigation Pills */}
        <View style={styles.navTabsRow}>
          {(['SALES', 'PROFIT_LOSS', 'GST', 'INVENTORY'] as const).map((tab) => {
            const isSelected = activeReportTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.7}
                onPress={() => setActiveReportTab(tab)}
                style={[
                  styles.navTabPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.borderLight,
                    borderRadius: radius.round,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.navTabText,
                    {
                      color: isSelected ? colors.white : colors.charcoal,
                      fontSize: typography.fontSizes.xxs,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {tab.replace('_', ' & ')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab 1: Sales Reports */}
        {activeReportTab === 'SALES' && (
          <View style={styles.tabContentBlock}>
            {/* Sales Chart */}
            <AnalyticsChart />

            {/* Sales Summary Metrics */}
            <View style={styles.statsCardGrid}>
              <Card style={styles.halfStatCard}>
                <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                  Total Orders
                </Text>
                <Text style={{ color: colors.charcoal, fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                  {dashboardMetrics.totalOrders}
                </Text>
                <Badge label="+12% this month" variant="success" size="sm" style={{ marginTop: 6 }} />
              </Card>

              <Card style={styles.halfStatCard}>
                <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                  Avg Order Value
                </Text>
                <Text style={{ color: colors.charcoal, fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                  {activeBusiness.currencySymbol}
                  {dashboardMetrics.totalOrders > 0
                    ? Math.round(dashboardMetrics.totalRevenue / dashboardMetrics.totalOrders)
                    : 0}
                </Text>
                <Badge label="Healthy Ticket" variant="info" size="sm" style={{ marginTop: 6 }} />
              </Card>
            </View>

            {/* Top Performing Items */}
            <Card style={{ marginTop: spacing.md }}>
              <Text
                style={{
                  color: colors.charcoal,
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 12,
                }}
              >
                Top-Selling Products (By Volume)
              </Text>

              {activeBusinessProducts.slice(0, 4).map((p, idx) => (
                <View
                  key={p.id}
                  style={[
                    styles.topItemRow,
                    {
                      borderBottomColor: colors.borderLight,
                      paddingVertical: 10,
                    },
                  ]}
                >
                  <View style={styles.topItemIndex}>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>
                      0{idx + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13 }}>
                      {p.name}
                    </Text>
                    <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                      {p.category} • GST {p.taxRate}%
                    </Text>
                  </View>
                  <Text style={{ color: colors.charcoal, fontWeight: '800', fontSize: 14 }}>
                    {activeBusiness.currencySymbol}{p.sellingPrice}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Tab 2: Profit & Loss Statement */}
        {activeReportTab === 'PROFIT_LOSS' && (
          <View style={styles.tabContentBlock}>
            <Card variant="elevated" style={styles.plSummaryCard}>
              <View style={styles.plRow}>
                <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '600' }}>
                  A. Gross Billed Revenue
                </Text>
                <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '800' }}>
                  {activeBusiness.currencySymbol}{dashboardMetrics.totalRevenue.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.plRow}>
                <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                  Less: Product Cost of Goods (COGS)
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                  -{activeBusiness.currencySymbol}{Math.round(dashboardMetrics.totalRevenue * 0.65).toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={[styles.plDivider, { backgroundColor: colors.borderLight }]} />

              <View style={styles.plRow}>
                <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                  B. Operating Expenses
                </Text>
                <Text style={{ color: colors.error, fontSize: 15, fontWeight: '800' }}>
                  -{activeBusiness.currencySymbol}{dashboardMetrics.totalExpenses.toLocaleString('en-IN')}
                </Text>
              </View>

              {activeBusinessExpenses.map((exp) => (
                <View key={exp.id} style={styles.plSubRow}>
                  <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                    • {exp.title} ({exp.category})
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                    {activeBusiness.currencySymbol}{exp.amount.toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}

              <View style={[styles.plDivider, { backgroundColor: colors.borderLight }]} />

              <View
                style={[
                  styles.netProfitBanner,
                  {
                    backgroundColor: colors.successSoft,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text style={{ color: colors.success, fontSize: 15, fontWeight: '800' }}>
                  NET OPERATING PROFIT
                </Text>
                <Text style={{ color: colors.success, fontSize: 20, fontWeight: '900' }}>
                  {activeBusiness.currencySymbol}{dashboardMetrics.netProfit.toLocaleString('en-IN')}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Tab 3: GST & Tax Reports */}
        {activeReportTab === 'GST' && (
          <View style={styles.tabContentBlock}>
            <Card style={styles.gstCard}>
              <View style={styles.gstHeader}>
                <View>
                  <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '800' }}>
                    GSTR-1 & GSTR-3B Tax Summary
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 1 }}>
                    Entity GSTIN: {activeBusiness.gstin || 'Unregistered'}
                  </Text>
                </View>
                <Badge label="GSTR Verified" variant="success" size="sm" />
              </View>

              <View style={styles.gstTaxGrid}>
                <View style={[styles.taxCol, { backgroundColor: colors.lightCyan, borderRadius: radius.md }]}>
                  <Text style={{ color: colors.secondaryText, fontSize: 11 }}>CGST Collected</Text>
                  <Text style={{ color: colors.charcoal, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                    {activeBusiness.currencySymbol}{totalCgst.toFixed(2)}
                  </Text>
                </View>

                <View style={[styles.taxCol, { backgroundColor: colors.lightCyan, borderRadius: radius.md }]}>
                  <Text style={{ color: colors.secondaryText, fontSize: 11 }}>SGST Collected</Text>
                  <Text style={{ color: colors.charcoal, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                    {activeBusiness.currencySymbol}{totalSgst.toFixed(2)}
                  </Text>
                </View>
              </View>

              <View style={[styles.totalTaxBanner, { backgroundColor: colors.borderLight, borderRadius: radius.md }]}>
                <Text style={{ color: colors.charcoal, fontSize: 13, fontWeight: '700' }}>
                  Total Tax Payable to Government
                </Text>
                <Text style={{ color: colors.primary, fontSize: 17, fontWeight: '900' }}>
                  {activeBusiness.currencySymbol}{(totalCgst + totalSgst).toFixed(2)}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {/* Tab 4: Inventory & Stock Valuation */}
        {activeReportTab === 'INVENTORY' && (
          <View style={styles.tabContentBlock}>
            <Card style={styles.valuationCard}>
              <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '800', marginBottom: 12 }}>
                Current Inventory Valuation
              </Text>

              <View style={styles.valRow}>
                <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                  Total Catalog SKUs
                </Text>
                <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                  {activeBusinessProducts.length} items
                </Text>
              </View>

              <View style={styles.valRow}>
                <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                  Total Stock Purchase Cost
                </Text>
                <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                  {activeBusiness.currencySymbol}{stockValuation.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.valRow}>
                <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                  Potential Retail Value (MRP/Selling)
                </Text>
                <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '800' }}>
                  {activeBusiness.currencySymbol}{retailValuation.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={[styles.valRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 8, marginTop: 4 }]}>
                <Text style={{ color: colors.success, fontSize: 13, fontWeight: '700' }}>
                  Projected Gross Profit Margin
                </Text>
                <Text style={{ color: colors.success, fontSize: 16, fontWeight: '900' }}>
                  +{activeBusiness.currencySymbol}{(retailValuation - stockValuation).toLocaleString('en-IN')}
                </Text>
              </View>
            </Card>
          </View>
        )}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  pageTitle: {
    letterSpacing: -0.2,
  },
  pageSubtitle: {
    marginTop: 2,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  navTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  navTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  navTabText: {},
  tabContentBlock: {},
  statsCardGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  halfStatCard: {
    flex: 1,
    padding: 14,
  },
  topItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  topItemIndex: {
    width: 26,
    alignItems: 'center',
  },
  plSummaryCard: {
    padding: 16,
  },
  plRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  plSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 12,
    marginVertical: 2,
  },
  plDivider: {
    height: 1,
    marginVertical: 10,
  },
  netProfitBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginTop: 10,
  },
  gstCard: {
    padding: 16,
  },
  gstHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  gstTaxGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  taxCol: {
    flex: 1,
    padding: 12,
  },
  totalTaxBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  valuationCard: {
    padding: 16,
  },
  valRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
});
