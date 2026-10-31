import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { InvoiceStatus, Invoice } from '../../types';

export const InvoicesListScreen: React.FC = () => {
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const {
    activeBusiness,
    activeBusinessInvoices,
    setSelectedInvoice,
    navigateTo,
    setActiveTab,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | InvoiceStatus>('ALL');

  const filteredInvoices = useMemo(() => {
    return activeBusinessInvoices.filter((inv) => {
      const matchStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        (inv.customer?.name && inv.customer.name.toLowerCase().includes(search.toLowerCase())) ||
        inv.date.includes(search);
      return matchStatus && matchSearch;
    });
  }, [activeBusinessInvoices, statusFilter, search]);

  const summary = useMemo(() => {
    const totalCount = activeBusinessInvoices.length;
    const totalAmount = activeBusinessInvoices
      .filter((i) => i.status !== 'CANCELLED')
      .reduce((sum, i) => sum + i.grandTotal, 0);
    const paidAmount = activeBusinessInvoices
      .filter((i) => i.status !== 'CANCELLED')
      .reduce((sum, i) => sum + i.paidAmount, 0);
    return { totalCount, totalAmount, paidAmount };
  }, [activeBusinessInvoices]);

  const handleInvoicePress = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    navigateTo('invoice_preview');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header />

      {/* Metrics Banner */}
      <View
        style={[
          styles.summaryBar,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.borderLight,
          },
        ]}
      >
        <View style={styles.summaryItem}>
          <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>
            Total Bills
          </Text>
          <Text style={[styles.sumVal, { color: colors.charcoal }]}>
            {summary.totalCount}
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>
            Total Billed
          </Text>
          <Text style={[styles.sumVal, { color: colors.primary }]}>
            {activeBusiness.currencySymbol}{summary.totalAmount.toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryItem}>
          <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>
            Collected
          </Text>
          <Text style={[styles.sumVal, { color: colors.success }]}>
            {activeBusiness.currencySymbol}{summary.paidAmount.toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
        >
          <Icon name="search" size={18} color={colors.mutedText} />
          <TextInput
            placeholder="Search invoice number, customer, date..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.mutedText}
            style={[
              styles.searchInput,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.sm,
              },
            ]}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close" size={16} color={colors.mutedText} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        {(['ALL', 'PAID', 'PENDING', 'CANCELLED'] as const).map((st) => {
          const isSelected = statusFilter === st;
          return (
            <TouchableOpacity
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[
                styles.filterTabPill,
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
                  styles.filterTabText,
                  {
                    color: isSelected ? colors.white : colors.secondaryText,
                    fontSize: typography.fontSizes.xxs,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {st}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Invoices List */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="invoices" size={42} color={colors.mutedText} />
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.charcoal,
                  fontSize: typography.fontSizes.base,
                  fontWeight: '700',
                  marginTop: 12,
                },
              ]}
            >
              No invoices found
            </Text>
            <Text
              style={[
                styles.emptySub,
                {
                  color: colors.secondaryText,
                  fontSize: typography.fontSizes.xs,
                  marginTop: 4,
                },
              ]}
            >
              Create bills from the Billing tab to generate new invoices
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card
            style={styles.invoiceCard}
            onPress={() => handleInvoicePress(item)}
          >
            <View style={styles.cardHeaderRow}>
              <View style={styles.invLeftCol}>
                <View style={styles.invNumRow}>
                  <Text
                    style={[
                      styles.invoiceNumber,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.base,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    {item.invoiceNumber}
                  </Text>
                  <Badge
                    label={item.paymentMethod}
                    variant="cyan"
                    size="sm"
                  />
                </View>

                <Text
                  style={[
                    styles.invCustName,
                    {
                      color: colors.secondaryText,
                      fontSize: typography.fontSizes.xs,
                      marginTop: 2,
                    },
                  ]}
                >
                  {item.customer?.name || 'Walk-in Customer'} • {item.date} {item.time}
                </Text>
              </View>

              <View style={styles.invRightCol}>
                <Text
                  style={[
                    styles.grandTotalText,
                    {
                      color: colors.primary,
                      fontSize: typography.fontSizes.md,
                      fontWeight: typography.fontWeights.extraBold,
                    },
                  ]}
                >
                  {activeBusiness.currencySymbol}{item.grandTotal.toLocaleString('en-IN')}
                </Text>
                <Badge
                  label={item.status}
                  variant={
                    item.status === 'PAID'
                      ? 'success'
                      : item.status === 'CANCELLED'
                      ? 'error'
                      : 'warning'
                  }
                  size="sm"
                  style={{ marginTop: 4 }}
                />
              </View>
            </View>

            {/* Items summary line */}
            <View
              style={[
                styles.itemsSummaryRow,
                {
                  borderTopColor: colors.borderLight,
                  paddingTop: 8,
                  marginTop: 8,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.fontSizes.xxs,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}
              </Text>

              <Text
                style={{
                  color: colors.primary,
                  fontSize: 11,
                  fontWeight: '700',
                  marginLeft: 8,
                }}
              >
                View PDF →
              </Text>
            </View>
          </Card>
        )}
      />

      {/* Floating Action Button: New Bill */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveTab('billing')}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            ...shadows.redGlow,
          },
        ]}
      >
        <Icon name="plus" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  summaryItem: {
    alignItems: 'center',
  },
  sumLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
  sumVal: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    marginLeft: 8,
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
  },
  filterTabText: {},
  listContent: {
    gap: 10,
    paddingBottom: 80,
  },
  invoiceCard: {
    padding: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invLeftCol: {
    flex: 1,
  },
  invNumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  invoiceNumber: {},
  invCustName: {},
  invRightCol: {
    alignItems: 'flex-end',
  },
  grandTotalText: {},
  itemsSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {},
  emptySub: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
