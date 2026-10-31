import React, { useState } from 'react';
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
import { Card } from '../../components/common/Card';
import { Customer } from '../../types';

export const CustomerManagementScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const {
    activeBusinessCustomers,
    activeBusiness,
    setCartCustomer,
    setActiveTab,
    navigateTo,
    goBack,
  } = useApp();

  const [search, setSearch] = useState('');

  const filteredCustomers = activeBusinessCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.gstin && c.gstin.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectForBilling = (customer: Customer) => {
    setCartCustomer(customer);
    setActiveTab('billing');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Customer Directory & CRM"
        subtitle={`${activeBusinessCustomers.length} registered customers`}
        onBackPress={goBack}
        rightAction={
          <TouchableOpacity
            onPress={() => navigateTo('add_edit_customer')}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Icon name="plus" size={14} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
              New Client
            </Text>
          </TouchableOpacity>
        }
      />

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
            placeholder="Search by customer name, phone or GSTIN..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.mutedText}
            style={[styles.searchInput, { color: colors.charcoal }]}
          />
        </View>
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => (
          <Card style={styles.customerCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.avatarCircle, { backgroundColor: colors.lightCyan }]}>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14 }}>
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '700' }}>
                  {item.name}
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 1 }}>
                  {item.phone} • {item.email || 'No email registered'}
                </Text>
                <Text style={{ color: colors.mutedText, fontSize: 11, marginTop: 2 }}>
                  {item.billingAddress}
                </Text>
              </View>
            </View>

            {/* Metrics Bar: Orders, Spent, Loyalty */}
            <View
              style={[
                styles.metricsRow,
                {
                  backgroundColor: colors.borderLight,
                  borderRadius: radius.md,
                },
              ]}
            >
              <View style={styles.metricCol}>
                <Text style={{ color: colors.secondaryText, fontSize: 10 }}>ORDERS</Text>
                <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13, marginTop: 2 }}>
                  {item.totalOrdersCount}
                </Text>
              </View>

              <View style={styles.metricCol}>
                <Text style={{ color: colors.secondaryText, fontSize: 10 }}>TOTAL SPENT</Text>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13, marginTop: 2 }}>
                  {activeBusiness.currencySymbol}{item.totalSpent?.toLocaleString('en-IN') || 0}
                </Text>
              </View>

              <View style={styles.metricCol}>
                <Text style={{ color: colors.secondaryText, fontSize: 10 }}>LOYALTY PTS</Text>
                <Text style={{ color: colors.orangeAccent, fontWeight: '800', fontSize: 13, marginTop: 2 }}>
                  ★ {item.loyaltyPoints}
                </Text>
              </View>
            </View>

            {/* Actions: Start Bill for this customer */}
            <View style={styles.actionBtnRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectForBilling(item)}
                style={[
                  styles.billCustomerBtn,
                  {
                    backgroundColor: colors.primarySoft,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Icon name="billing" size={14} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12, marginLeft: 6 }}>
                  Bill to this Customer →
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 42,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
    marginLeft: 8,
  },
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
  customerCard: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    marginVertical: 10,
  },
  metricCol: {
    alignItems: 'center',
  },
  actionBtnRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
    paddingTop: 8,
  },
  billCustomerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
