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
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Product } from '../../types';

export const AddEditProductScreen: React.FC = () => {
  const { colors, typography, radius, spacing } = useTheme();
  const { activeBusiness, addProduct, goBack } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState(
    activeBusiness.industry === 'restaurant'
      ? 'North Indian Curries'
      : activeBusiness.industry === 'pharmacy'
      ? 'Analgesics'
      : 'Groceries'
  );
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [barcode, setBarcode] = useState(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
  const [unit, setUnit] = useState<'pcs' | 'kg' | 'box' | 'ltr'>('pcs');
  const [purchasePrice, setPurchasePrice] = useState('120');
  const [sellingPrice, setSellingPrice] = useState('180');
  const [mrp, setMrp] = useState('200');
  const [stock, setStock] = useState('50');
  const [minStockAlert, setMinStockAlert] = useState('10');
  const [taxRate, setTaxRate] = useState<number>(activeBusiness.settings.defaultTaxRate || 5);

  const taxRates = [0, 5, 12, 18, 28];
  const units: ('pcs' | 'kg' | 'box' | 'ltr')[] = ['pcs', 'kg', 'box', 'ltr'];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a product name');
      return;
    }

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      businessId: activeBusiness.id,
      name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      barcode: barcode.trim(),
      category: category.trim(),
      unit,
      purchasePrice: parseFloat(purchasePrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      mrp: parseFloat(mrp) || parseFloat(sellingPrice) || 0,
      stock: parseInt(stock, 10) || 0,
      minStockAlert: parseInt(minStockAlert, 10) || 5,
      taxRate,
      industry: activeBusiness.industry,
    };

    addProduct(newProd);
    Alert.alert('Success', `Product "${newProd.name}" added to catalog.`, [
      { text: 'OK', onPress: goBack },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Add New Product"
        subtitle={`Configure item for ${activeBusiness.name}`}
        onBackPress={goBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        <Card style={styles.formCard}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.bold,
                marginBottom: 12,
              },
            ]}
          >
            BASIC PRODUCT INFORMATION
          </Text>

          <Input
            label="Product Title / Name *"
            placeholder="e.g. Fortune Sunflower Oil 1L, Dum Biryani..."
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Category"
            placeholder="e.g. Dairy, Curries, Tablets, Shirts"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Input
                label="SKU Code"
                placeholder="SKU-1001"
                value={sku}
                onChangeText={setSku}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Barcode / EAN"
                placeholder="890123..."
                value={barcode}
                onChangeText={setBarcode}
              />
            </View>
          </View>

          {/* Unit Selector */}
          <Text
            style={{
              color: colors.charcoal,
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 6,
            }}
          >
            Unit of Measurement
          </Text>
          <View style={styles.unitRow}>
            {units.map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={[
                  styles.unitPill,
                  {
                    backgroundColor: unit === u ? colors.primary : colors.cardBackground,
                    borderColor: unit === u ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: unit === u ? colors.white : colors.charcoal,
                    fontSize: 12,
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pricing & GST */}
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.bold,
                marginTop: 16,
                marginBottom: 12,
              },
            ]}
          >
            PRICING & TAX RATES
          </Text>

          <View style={styles.threeCol}>
            <View style={{ flex: 1 }}>
              <Input
                label={`Cost (${activeBusiness.currencySymbol})`}
                keyboardType="numeric"
                value={purchasePrice}
                onChangeText={setPurchasePrice}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label={`Selling (${activeBusiness.currencySymbol}) *`}
                keyboardType="numeric"
                value={sellingPrice}
                onChangeText={setSellingPrice}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label={`MRP (${activeBusiness.currencySymbol})`}
                keyboardType="numeric"
                value={mrp}
                onChangeText={setMrp}
              />
            </View>
          </View>

          {/* GST Tax Rate */}
          <Text
            style={{
              color: colors.charcoal,
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 6,
            }}
          >
            Applicable GST Rate (%)
          </Text>
          <View style={styles.taxPillRow}>
            {taxRates.map((rate) => (
              <TouchableOpacity
                key={rate}
                onPress={() => setTaxRate(rate)}
                style={[
                  styles.taxPill,
                  {
                    backgroundColor: taxRate === rate ? colors.primary : colors.borderLight,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: taxRate === rate ? colors.white : colors.charcoal,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {rate}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stock & Inventory */}
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.sm,
                fontWeight: typography.fontWeights.bold,
                marginTop: 16,
                marginBottom: 12,
              },
            ]}
          >
            INITIAL INVENTORY STOCK
          </Text>

          <View style={styles.twoCol}>
            <View style={{ flex: 1 }}>
              <Input
                label="Opening Stock Qty"
                keyboardType="numeric"
                value={stock}
                onChangeText={setStock}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Low Stock Alert Threshold"
                keyboardType="numeric"
                value={minStockAlert}
                onChangeText={setMinStockAlert}
              />
            </View>
          </View>

          <Button
            title="Save Product to Inventory"
            variant="primary"
            size="lg"
            onPress={handleSave}
            style={{ marginTop: 12 }}
            fullWidth
          />
        </Card>
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
  formCard: {
    padding: 18,
  },
  sectionTitle: {
    letterSpacing: 0.5,
  },
  twoCol: {
    flexDirection: 'row',
    gap: 10,
  },
  threeCol: {
    flexDirection: 'row',
    gap: 8,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  unitPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  taxPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  taxPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
});
