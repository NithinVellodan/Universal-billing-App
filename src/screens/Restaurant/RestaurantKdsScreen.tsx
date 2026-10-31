import React, { useState } from 'react';
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
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { KitchenOrderTicket } from '../../types';

export const RestaurantKdsScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const { kots, updateKotStatus, goBack } = useApp();

  const [filter, setFilter] = useState<'ALL' | 'PREPARING' | 'READY'>('ALL');
  const [readyChime, setReadyChime] = useState<string | null>(null);

  const filteredKots = kots.filter((k) => {
    if (filter === 'ALL') return true;
    return k.status === filter;
  });

  const advanceKotStatus = (kot: KitchenOrderTicket) => {
    let nextStatus: KitchenOrderTicket['status'] = 'READY';
    if (kot.status === 'PENDING') nextStatus = 'PREPARING';
    else if (kot.status === 'PREPARING') nextStatus = 'READY';
    else if (kot.status === 'READY') nextStatus = 'SERVED';

    updateKotStatus(kot.id, nextStatus);

    if (nextStatus === 'READY') {
      setReadyChime(`Order ${kot.orderNumber} for Table ${kot.tableNumber} is READY! Steward notified.`);
      setTimeout(() => setReadyChime(null), 3500);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Kitchen Display System (KDS)"
        subtitle="Live chef queue & order tickets"
        onBackPress={goBack}
      />

      {readyChime && (
        <View style={[styles.chimeBanner, { backgroundColor: colors.successSoft }]}>
          <Icon name="bell" size={16} color={colors.success} />
          <Text style={[styles.chimeText, { color: colors.success }]}>
            {readyChime}
          </Text>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'PREPARING', 'READY'] as const).map((tab) => {
          const isSelected = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[
                styles.filterTab,
                {
                  backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                  borderColor: isSelected ? colors.primary : colors.borderLight,
                  borderRadius: radius.round,
                },
              ]}
            >
              <Text
                style={{
                  color: isSelected ? colors.white : colors.charcoal,
                  fontSize: 12,
                  fontWeight: isSelected ? '700' : '500',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        <View style={styles.ticketsGrid}>
          {filteredKots.map((kot) => (
            <Card
              key={kot.id}
              style={[
                styles.ticketCard,
                {
                  borderColor:
                    kot.status === 'READY'
                      ? colors.success
                      : kot.status === 'PREPARING'
                      ? colors.primary
                      : colors.warning,
                  borderTopWidth: 4,
                  borderRadius: radius.xl,
                },
              ]}
            >
              {/* Ticket Header */}
              <View style={styles.ticketHeader}>
                <View>
                  <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '800' }}>
                    {kot.orderNumber}
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                    {kot.tableNumber} • {kot.orderType}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Badge
                    label={kot.status}
                    variant={
                      kot.status === 'READY'
                        ? 'success'
                        : kot.status === 'PREPARING'
                        ? 'primary'
                        : 'warning'
                    }
                    size="sm"
                  />
                  <Text style={{ color: colors.mutedText, fontSize: 10, marginTop: 2 }}>
                    {kot.time} ({kot.stewardName})
                  </Text>
                </View>
              </View>

              {/* Items List */}
              <View style={styles.itemsBlock}>
                {kot.items.map((item, i) => (
                  <View
                    key={i}
                    style={[
                      styles.kotItemRow,
                      { borderBottomColor: colors.borderLight },
                    ]}
                  >
                    <View style={styles.itemQtyCircle}>
                      <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>
                        {item.quantity}x
                      </Text>
                    </View>

                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13 }}>
                        {item.productName}
                      </Text>
                      {item.notes && (
                        <Text style={{ color: colors.error, fontSize: 11, fontStyle: 'italic' }}>
                          Note: {item.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Advance Status Button */}
              {kot.status !== 'SERVED' && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => advanceKotStatus(kot)}
                  style={[
                    styles.advanceBtn,
                    {
                      backgroundColor:
                        kot.status === 'PREPARING'
                          ? colors.success
                          : colors.primary,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Text style={{ color: colors.white, fontWeight: '700', fontSize: 13 }}>
                    {kot.status === 'PENDING'
                      ? 'Mark as Preparing 🍳'
                      : kot.status === 'PREPARING'
                      ? 'Mark Order Ready 🔔'
                      : 'Mark as Served ✓'}
                  </Text>
                </TouchableOpacity>
              )}
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
  chimeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chimeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  ticketsGrid: {
    gap: 12,
  },
  ticketCard: {
    padding: 14,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  itemsBlock: {
    marginVertical: 8,
  },
  kotItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  itemQtyCircle: {
    width: 28,
    alignItems: 'center',
  },
  advanceBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 6,
  },
});
