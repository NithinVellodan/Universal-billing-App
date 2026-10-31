import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const PharmacyBatchesScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const { activeBusinessProducts, goBack, addToCart, setActiveTab } = useApp();

  const [search, setSearch] = useState('');

  // Extract all batches from products
  const batchList: {
    productName: string;
    productId: string;
    category: string;
    batchNo: string;
    mfgDate: string;
    expiryDate: string;
    stock: number;
    sellingPrice: number;
    mrp: number;
    product: any;
    batch: any;
  }[] = [];

  activeBusinessProducts.forEach((p) => {
    if (p.batches && p.batches.length > 0) {
      p.batches.forEach((b) => {
        batchList.push({
          productName: p.name,
          productId: p.id,
          category: p.category,
          batchNo: b.batchNo,
          mfgDate: b.mfgDate,
          expiryDate: b.expiryDate,
          stock: b.stock,
          sellingPrice: b.sellingPrice,
          mrp: b.mrp,
          product: p,
          batch: b,
        });
      });
    }
  });

  const filteredBatches = batchList.filter(
    (b) =>
      b.productName.toLowerCase().includes(search.toLowerCase()) ||
      b.batchNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleDispense = (item: any) => {
    addToCart(item.product, 1, undefined, item.batch);
    setActiveTab('billing');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Pharmacy Batches & Expiry"
        subtitle="Schedule H & batch tracking compliance"
        onBackPress={goBack}
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
            placeholder="Search medicine or batch number..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.mutedText}
            style={[styles.searchInput, { color: colors.charcoal }]}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Compliance Warning Banner */}
        <Card
          variant="cyan"
          style={[styles.complianceCard, { borderRadius: radius.xl }]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="shield-check" size={24} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: colors.charcoal, fontWeight: '800', fontSize: 13 }}>
                Drugs & Cosmetics Act Compliance (Form 20/21)
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 1 }}>
                Mandatory printing of Batch No & Expiry on all retail drug invoices.
              </Text>
            </View>
          </View>
        </Card>

        {/* Batches List */}
        <View style={styles.batchesList}>
          {filteredBatches.map((b, idx) => {
            const isNearExpiry = b.expiryDate < '2026-12-31';

            return (
              <Card
                key={idx}
                style={[
                  styles.batchCard,
                  {
                    borderLeftColor: isNearExpiry ? colors.warning : colors.success,
                    borderLeftWidth: 4,
                  },
                ]}
              >
                <View style={styles.batchTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                      {b.productName}
                    </Text>
                    <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
                      {b.category} • Schedule H Drug
                    </Text>
                  </View>

                  <Badge
                    label={isNearExpiry ? 'Expiring Soon' : 'Valid'}
                    variant={isNearExpiry ? 'warning' : 'success'}
                    size="sm"
                  />
                </View>

                {/* Batch Details Grid */}
                <View
                  style={[
                    styles.batchDetailsGrid,
                    {
                      backgroundColor: colors.borderLight,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <View style={styles.bCol}>
                    <Text style={{ color: colors.secondaryText, fontSize: 10 }}>BATCH NO</Text>
                    <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 12, marginTop: 2 }}>
                      {b.batchNo}
                    </Text>
                  </View>

                  <View style={styles.bCol}>
                    <Text style={{ color: colors.secondaryText, fontSize: 10 }}>EXPIRY DATE</Text>
                    <Text style={{ color: isNearExpiry ? colors.error : colors.charcoal, fontWeight: '700', fontSize: 12, marginTop: 2 }}>
                      {b.expiryDate}
                    </Text>
                  </View>

                  <View style={styles.bCol}>
                    <Text style={{ color: colors.secondaryText, fontSize: 10 }}>AVAILABLE</Text>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 12, marginTop: 2 }}>
                      {b.stock} units
                    </Text>
                  </View>

                  <View style={styles.bCol}>
                    <Text style={{ color: colors.secondaryText, fontSize: 10 }}>PRICE (MRP)</Text>
                    <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 12, marginTop: 2 }}>
                      ₹{b.sellingPrice} (₹{b.mrp})
                    </Text>
                  </View>
                </View>

                {/* Dispense / Add to Bill */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDispense(b)}
                  style={[
                    styles.dispenseBtn,
                    {
                      backgroundColor: colors.primarySoft,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Icon name="cart" size={14} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12, marginLeft: 6 }}>
                    Dispense & Add to Bill →
                  </Text>
                </TouchableOpacity>
              </Card>
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
  scrollContent: {
    paddingBottom: 40,
  },
  complianceCard: {
    padding: 14,
    marginBottom: 14,
  },
  batchesList: {
    gap: 12,
  },
  batchCard: {
    padding: 14,
  },
  batchTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  batchDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10,
  },
  bCol: {
    alignItems: 'flex-start',
  },
  dispenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
