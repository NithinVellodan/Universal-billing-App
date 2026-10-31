import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const PurchaseManagerScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const { activeBusinessPurchases, activeBusiness, goBack } = useApp();

  const totalProcurement = activeBusinessPurchases.reduce(
    (sum, p) => sum + p.totalAmount,
    0
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Purchase Orders & Vendors"
        subtitle="Track stock inwards and distributor POs"
        onBackPress={goBack}
      />

      {/* Summary Banner */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Card variant="cyan" style={styles.summaryCard}>
          <Text style={{ color: colors.secondaryText, fontSize: 11, textTransform: 'uppercase' }}>
            TOTAL PROCUREMENT VOLUME
          </Text>
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '900', marginTop: 4 }}>
            {activeBusiness.currencySymbol}{totalProcurement.toLocaleString('en-IN')}
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
            Input Tax Credit (ITC) eligible purchases
          </Text>
        </Card>
      </View>

      <FlatList
        data={activeBusinessPurchases}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => (
          <Card style={styles.poCard}>
            <View style={styles.poHeader}>
              <View>
                <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '700' }}>
                  {item.poNumber}
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 1 }}>
                  Supplier: {item.supplierName}
                </Text>
                {item.supplierGstin && (
                  <Text style={{ color: colors.mutedText, fontSize: 11 }}>
                    GSTIN: {item.supplierGstin}
                  </Text>
                )}
              </View>

              <Badge
                label={item.status}
                variant={item.status === 'RECEIVED' ? 'success' : 'warning'}
                size="sm"
              />
            </View>

            <View
              style={[
                styles.poMetaRow,
                {
                  backgroundColor: colors.borderLight,
                  borderRadius: radius.md,
                },
              ]}
            >
              <View>
                <Text style={{ color: colors.secondaryText, fontSize: 10 }}>ORDER DATE</Text>
                <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600', marginTop: 1 }}>
                  {item.date}
                </Text>
              </View>

              <View>
                <Text style={{ color: colors.secondaryText, fontSize: 10 }}>SKUS INWARD</Text>
                <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600', marginTop: 1 }}>
                  {item.itemsCount} products
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.secondaryText, fontSize: 10 }}>TOTAL BILL</Text>
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800', marginTop: 1 }}>
                  {activeBusiness.currencySymbol}{item.totalAmount.toLocaleString('en-IN')}
                </Text>
              </View>
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
  summaryCard: {
    padding: 16,
  },
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
  poCard: {
    padding: 14,
  },
  poHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  poMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 10,
  },
});
