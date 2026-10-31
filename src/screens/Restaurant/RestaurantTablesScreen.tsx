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
import { RestaurantTable, TableStatus } from '../../types';

export const RestaurantTablesScreen: React.FC = () => {
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const {
    tables,
    updateTableStatus,
    setSelectedTable,
    setOrderType,
    setActiveTab,
    goBack,
    navigateTo,
  } = useApp();

  const [selectedSection, setSelectedSection] = useState<string>('All');

  const sections = ['All', 'Main Hall', 'AC Lounge', 'Rooftop Patio'];

  const filteredTables = tables.filter((t) =>
    selectedSection === 'All' ? true : t.section === selectedSection
  );

  const handleStartOrder = (table: RestaurantTable) => {
    setSelectedTable(table.tableNumber);
    setOrderType('DINE_IN');
    if (table.status === 'AVAILABLE') {
      updateTableStatus(table.id, 'OCCUPIED');
    }
    setActiveTab('billing');
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return colors.success;
      case 'OCCUPIED':
        return colors.primary;
      case 'BILLED':
        return colors.warning;
      case 'RESERVED':
        return colors.info;
      default:
        return colors.secondaryText;
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Restaurant Tables & Floor"
        subtitle="Manage seating, active diners, and billing"
        onBackPress={goBack}
        rightAction={
          <TouchableOpacity
            onPress={() => navigateTo('restaurant_kds')}
            style={[styles.kdsBtn, { backgroundColor: colors.primarySoft }]}
          >
            <Icon name="clock" size={14} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
              KDS
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Floor Section Tabs */}
      <View style={styles.sectionTabs}>
        {sections.map((sec) => {
          const isSelected = selectedSection === sec;
          return (
            <TouchableOpacity
              key={sec}
              onPress={() => setSelectedSection(sec)}
              style={[
                styles.sectionPill,
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
                {sec}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Floor Grid */}
        <View style={styles.tablesGrid}>
          {filteredTables.map((tbl) => {
            const statusColor = getStatusColor(tbl.status);
            const isOccupied = tbl.status === 'OCCUPIED' || tbl.status === 'BILLED';

            return (
              <TouchableOpacity
                key={tbl.id}
                activeOpacity={0.8}
                onPress={() => handleStartOrder(tbl)}
                style={[
                  styles.tableCard,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: statusColor,
                    borderWidth: 2,
                    borderRadius: radius.xl,
                    ...shadows.sm,
                  },
                ]}
              >
                {/* Table Header */}
                <View style={styles.tableCardHeader}>
                  <Text
                    style={[
                      styles.tableNumberText,
                      { color: colors.charcoal, fontSize: typography.fontSizes.lg, fontWeight: '800' },
                    ]}
                  >
                    {tbl.tableNumber}
                  </Text>
                  <Badge label={tbl.status} variant={tbl.status === 'AVAILABLE' ? 'success' : tbl.status === 'OCCUPIED' ? 'primary' : 'warning'} size="sm" />
                </View>

                {/* Section & Capacity */}
                <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
                  {tbl.section} • {tbl.capacity} Pax
                </Text>

                {/* Diners & Bill Total if Occupied */}
                {isOccupied && (
                  <View
                    style={[
                      styles.occupiedBlock,
                      {
                        backgroundColor: colors.borderLight,
                        borderRadius: radius.md,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.primary, fontSize: 15, fontWeight: '800' }}>
                      ₹{tbl.currentBillTotal || 0}
                    </Text>
                    <Text style={{ color: colors.secondaryText, fontSize: 10 }}>
                      {tbl.occupiedSince || 'Active'} • {tbl.activeKotCount || 1} KOT
                    </Text>
                  </View>
                )}

                {/* Order Action Button */}
                <TouchableOpacity
                  onPress={() => handleStartOrder(tbl)}
                  style={[
                    styles.takeOrderBtn,
                    {
                      backgroundColor: isOccupied ? colors.lightCyan : colors.primarySoft,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: isOccupied ? colors.charcoal : colors.primary,
                      fontSize: 11,
                      fontWeight: '700',
                    }}
                  >
                    {isOccupied ? 'Update Order →' : '+ Start Order'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  kdsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  sectionTabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  sectionPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  tablesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tableCard: {
    width: '47.5%',
    padding: 14,
  },
  tableCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableNumberText: {},
  occupiedBlock: {
    padding: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  takeOrderBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 10,
  },
});
