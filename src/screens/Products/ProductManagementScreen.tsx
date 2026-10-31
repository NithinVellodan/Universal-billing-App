import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Product } from '../../types';

export const ProductManagementScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const {
    activeBusinessProducts,
    activeBusiness,
    updateProduct,
    deleteProduct,
    navigateTo,
    goBack,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    activeBusinessProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [activeBusinessProducts]);

  const filteredProducts = useMemo(() => {
    return activeBusinessProducts.filter((p) => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.barcode.includes(search);
      return matchCat && matchSearch;
    });
  }, [activeBusinessProducts, selectedCategory, search]);

  const handleStockAdjust = (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    updateProduct(product.id, { stock: newStock });
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteProduct(product.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Products & Inventory"
        subtitle={`${activeBusinessProducts.length} items catalogued`}
        onBackPress={goBack}
        rightAction={
          <TouchableOpacity
            onPress={() => navigateTo('add_edit_product')}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Icon name="plus" size={14} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
              Add Item
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
            placeholder="Search catalog by name, SKU or barcode..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={colors.mutedText}
            style={[styles.searchInput, { color: colors.charcoal }]}
          />
        </View>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryPillsRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.catPill,
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
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(p) => p.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => (
          <Card style={styles.productCard}>
            <View style={styles.prodTopRow}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                  {item.name}
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
                  SKU: {item.sku} • Code: {item.barcode}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  <Badge label={item.category} variant="neutral" size="sm" />
                  <Badge label={`GST ${item.taxRate}%`} variant="cyan" size="sm" />
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '800' }}>
                  {activeBusiness.currencySymbol}{item.sellingPrice}
                </Text>
                <Text style={{ color: colors.mutedText, fontSize: 11 }}>
                  Cost: {activeBusiness.currencySymbol}{item.purchasePrice}
                </Text>
              </View>
            </View>

            {/* Stock Level & Adjust Controls */}
            <View
              style={[
                styles.stockAdjustRow,
                {
                  borderTopColor: colors.borderLight,
                  paddingTop: 8,
                  marginTop: 10,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.secondaryText, fontSize: 12, marginRight: 6 }}>
                  Current Stock:
                </Text>
                <Badge
                  label={`${item.stock} ${item.unit}`}
                  variant={item.stock <= item.minStockAlert ? 'warning' : 'success'}
                  size="sm"
                />
              </View>

              <View style={styles.stockActions}>
                <TouchableOpacity
                  onPress={() => handleStockAdjust(item, -1)}
                  style={[styles.adjustBtn, { backgroundColor: colors.borderLight }]}
                >
                  <Icon name="minus" size={14} color={colors.charcoal} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleStockAdjust(item, 5)}
                  style={[styles.adjustBtn, { backgroundColor: colors.primarySoft, marginLeft: 6 }]}
                >
                  <Icon name="plus" size={14} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  style={[styles.deleteBtn, { marginLeft: 12 }]}
                >
                  <Icon name="trash" size={16} color={colors.error} />
                </TouchableOpacity>
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
  categoryPillsRow: {
    paddingVertical: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 40,
  },
  productCard: {
    padding: 12,
  },
  prodTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stockAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  stockActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    padding: 4,
  },
});
