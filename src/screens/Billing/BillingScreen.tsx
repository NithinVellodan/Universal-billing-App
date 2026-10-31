import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { CartModal } from './CartModal';
import { CheckoutModal } from './CheckoutModal';
import { Product } from '../../types';

export const BillingScreen: React.FC = () => {
  const { colors, typography, radius, shadows } = useTheme();
  const {
    activeBusiness,
    activeBusinessProducts,
    cart,
    addToCart,
    cartTotals,
    heldBills,
    resumeHeldBill,
    selectedTable,
    orderType,
    setOrderType,
    navigateTo,
    setSelectedInvoice,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [heldBillsModalOpen, setHeldBillsModalOpen] = useState(false);

  // Variant selector modal for products that have variants/batches
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    activeBusinessProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [activeBusinessProducts]);

  // Filtered products
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

  const handleProductPress = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      setVariantModalProduct(product);
    } else if (product.batches && product.batches.length > 0) {
      setVariantModalProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleCheckoutSuccess = (invoice: any) => {
    setSelectedInvoice(invoice);
    navigateTo('invoice_preview');
  };

  const getProductCartCount = (productId: string) => {
    return cart
      .filter((item) => item.product.id === productId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header />

      {/* POS Toolbar: Order Type selector & Held Bills pill */}
      <View
        style={[
          styles.posToolbar,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.borderLight,
          },
        ]}
      >
        {activeBusiness.industry === 'restaurant' ? (
          <View style={styles.restaurantToolbar}>
            <View style={styles.orderTypeTabs}>
              {(['DINE_IN', 'TAKEAWAY', 'DELIVERY'] as const).map((type) => {
                const isSelected = orderType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setOrderType(type)}
                    style={[
                      styles.orderTypePill,
                      isSelected && {
                        backgroundColor: colors.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.orderTypePillText,
                        {
                          color: isSelected ? colors.white : colors.secondaryText,
                          fontSize: typography.fontSizes.xxs,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {type.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {orderType === 'DINE_IN' && (
              <TouchableOpacity
                onPress={() => navigateTo('restaurant_tables')}
                style={[
                  styles.tableSelectorBtn,
                  {
                    backgroundColor: colors.lightCyan,
                    borderColor: colors.lightCyanBorder,
                  },
                ]}
              >
                <Icon name="table" size={14} color={colors.primary} />
                <Text
                  style={{
                    color: colors.charcoal,
                    fontSize: 11,
                    fontWeight: '700',
                    marginLeft: 4,
                  }}
                >
                  {selectedTable ? `Table: ${selectedTable}` : 'Pick Table'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.retailToolbar}>
            <View style={styles.counterBadge}>
              <Icon name="store" size={14} color={colors.primary} />
              <Text
                style={{
                  color: colors.charcoal,
                  fontSize: 12,
                  fontWeight: '600',
                  marginLeft: 6,
                }}
              >
                Counter #01 (Active)
              </Text>
            </View>
          </View>
        )}

        {/* Held Bills Tray Button */}
        {heldBills.length > 0 && (
          <TouchableOpacity
            onPress={() => setHeldBillsModalOpen(true)}
            style={[
              styles.heldTrayBtn,
              {
                backgroundColor: colors.warningSoft,
                borderColor: colors.warning,
              },
            ]}
          >
            <Icon name="clock" size={14} color={colors.warning} />
            <Text
              style={{
                color: colors.warning,
                fontSize: 11,
                fontWeight: '700',
                marginLeft: 4,
              }}
            >
              Held ({heldBills.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search & Barcode Scan Row */}
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
            placeholder="Search items, SKU, or barcode..."
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

        {/* Barcode scanner action */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigateTo('barcode_scanner')}
          style={[
            styles.barcodeActionBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.md,
              ...shadows.redGlow,
            },
          ]}
        >
          <Icon name="barcode" size={20} color={colors.white} />
        </TouchableOpacity>

        {/* Grid / List toggle */}
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          style={[
            styles.viewModeBtn,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
              borderRadius: radius.md,
            },
          ]}
        >
          <Icon
            name={viewMode === 'grid' ? 'receipt' : 'table'}
            size={18}
            color={colors.charcoal}
          />
        </TouchableOpacity>
      </View>

      {/* Category Horizontal Filter Chips */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.cardBackground,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.borderLight,
                    borderRadius: radius.round,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isSelected ? colors.white : colors.charcoal,
                      fontSize: typography.fontSizes.xs,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Products Grid / List */}
      <FlatList
        key={viewMode}
        numColumns={viewMode === 'grid' ? 2 : 1}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productListContent,
          { paddingBottom: cart.length > 0 ? 110 : 30 },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyProductState}>
            <Icon name="search" size={42} color={colors.mutedText} />
            <Text
              style={[
                styles.emptyProductTitle,
                {
                  color: colors.charcoal,
                  fontSize: typography.fontSizes.base,
                  fontWeight: '700',
                  marginTop: 12,
                },
              ]}
            >
              No products found
            </Text>
            <Text
              style={[
                styles.emptyProductSub,
                {
                  color: colors.secondaryText,
                  fontSize: typography.fontSizes.xs,
                  marginTop: 4,
                },
              ]}
            >
              Try adjusting your search query or category
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const inCartCount = getProductCartCount(item.id);
          const isGrid = viewMode === 'grid';

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleProductPress(item)}
              style={[
                isGrid ? styles.productCardGrid : styles.productCardList,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: inCartCount > 0 ? colors.primary : colors.borderLight,
                  borderWidth: inCartCount > 0 ? 1.5 : 1,
                  borderRadius: radius.lg,
                  ...shadows.sm,
                },
              ]}
            >
              {/* In-cart count badge */}
              {inCartCount > 0 && (
                <View
                  style={[
                    styles.inCartIndicatorBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.inCartIndicatorText}>{inCartCount}</Text>
                </View>
              )}

              {/* Product Info */}
              <View style={styles.productInfoBlock}>
                <View style={styles.catStockRow}>
                  <Text
                    style={[
                      styles.productCategoryLabel,
                      {
                        color: colors.secondaryText,
                        fontSize: typography.fontSizes.xxs,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.category}
                  </Text>
                  <Badge
                    label={`${item.stock} ${item.unit}`}
                    variant={item.stock <= item.minStockAlert ? 'warning' : 'neutral'}
                    size="sm"
                  />
                </View>

                <Text
                  style={[
                    styles.productName,
                    {
                      color: colors.charcoal,
                      fontSize: typography.fontSizes.sm,
                      fontWeight: typography.fontWeights.bold,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.productSku,
                    {
                      color: colors.mutedText,
                      fontSize: typography.fontSizes.xxs,
                      marginTop: 2,
                    },
                  ]}
                >
                  SKU: {item.sku}
                </Text>

                <View style={styles.priceActionRow}>
                  <View>
                    <Text
                      style={[
                        styles.productPrice,
                        {
                          color: colors.primary,
                          fontSize: typography.fontSizes.base,
                          fontWeight: typography.fontWeights.extraBold,
                        },
                      ]}
                    >
                      {activeBusiness.currencySymbol}{item.sellingPrice.toLocaleString('en-IN')}
                    </Text>
                    {item.mrp > item.sellingPrice && (
                      <Text
                        style={[
                          styles.mrpCrossed,
                          {
                            color: colors.mutedText,
                            fontSize: typography.fontSizes.xxs,
                            textDecorationLine: 'line-through',
                          },
                        ]}
                      >
                        MRP {activeBusiness.currencySymbol}{item.mrp}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => handleProductPress(item)}
                    style={[
                      styles.addToCartBtn,
                      {
                        backgroundColor: inCartCount > 0 ? colors.primary : colors.primarySoft,
                        borderRadius: radius.md,
                      },
                    ]}
                  >
                    <Icon
                      name="plus"
                      size={16}
                      color={inCartCount > 0 ? colors.white : colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Sticky Bottom Cart Bar */}
      {cart.length > 0 && (
        <View
          style={[
            styles.stickyCartBar,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.borderLight,
              ...shadows.lg,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCartModalOpen(true)}
            style={styles.cartInfoSection}
          >
            <View
              style={[
                styles.cartCounterCircle,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.cartCounterText}>{cartTotals.itemCount}</Text>
            </View>

            <View style={{ marginLeft: 10 }}>
              <Text
                style={[
                  styles.cartTotalHeading,
                  {
                    color: colors.charcoal,
                    fontSize: typography.fontSizes.md,
                    fontWeight: typography.fontWeights.extraBold,
                  },
                ]}
              >
                {activeBusiness.currencySymbol}{cartTotals.grandTotal.toLocaleString('en-IN')}
              </Text>
              <Text
                style={[
                  styles.taxIncludedNote,
                  {
                    color: colors.secondaryText,
                    fontSize: typography.fontSizes.xxs,
                  },
                ]}
              >
                Incl. taxes ({activeBusiness.currencySymbol}{cartTotals.taxTotal.toFixed(2)})
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.cartBarButtons}>
            <TouchableOpacity
              onPress={() => setCartModalOpen(true)}
              style={[
                styles.viewCartPill,
                {
                  backgroundColor: colors.borderLight,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.charcoal,
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                View Cart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCheckoutModalOpen(true)}
              style={[
                styles.checkoutPill,
                {
                  backgroundColor: colors.primary,
                  borderRadius: radius.md,
                  ...shadows.redGlow,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 13,
                  fontWeight: '800',
                }}
              >
                Pay →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cart Modal */}
      <CartModal
        visible={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        onProceedToCheckout={() => {
          setCartModalOpen(false);
          setCheckoutModalOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        visible={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />

      {/* Variant / Batch Selector Modal */}
      {variantModalProduct && (
        <Modal visible={!!variantModalProduct} transparent animationType="fade">
          <View style={[styles.modalBackdrop, { backgroundColor: colors.backdrop }]}>
            <View
              style={[
                styles.variantPickerCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <View style={styles.variantHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '700' }}>
                    Select Option
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                    {variantModalProduct.name}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setVariantModalProduct(null)}>
                  <Icon name="close" size={18} color={colors.charcoal} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 260, marginVertical: 10 }}>
                {variantModalProduct.variants?.map((v) => (
                  <TouchableOpacity
                    key={v.id}
                    onPress={() => {
                      addToCart(variantModalProduct, 1, v);
                      setVariantModalProduct(null);
                    }}
                    style={[
                      styles.variantOptionRow,
                      { borderBottomColor: colors.borderLight },
                    ]}
                  >
                    <View>
                      <Text style={{ color: colors.charcoal, fontWeight: '600', fontSize: 13 }}>
                        {v.name}
                      </Text>
                      <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                        Stock: {v.stock}
                      </Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14 }}>
                      {activeBusiness.currencySymbol}{variantModalProduct.sellingPrice + v.additionalPrice}
                    </Text>
                  </TouchableOpacity>
                ))}

                {variantModalProduct.batches?.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    onPress={() => {
                      addToCart(variantModalProduct, 1, undefined, b);
                      setVariantModalProduct(null);
                    }}
                    style={[
                      styles.variantOptionRow,
                      { borderBottomColor: colors.borderLight },
                    ]}
                  >
                    <View>
                      <Text style={{ color: colors.charcoal, fontWeight: '600', fontSize: 13 }}>
                        Batch #{b.batchNo}
                      </Text>
                      <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                        Expiry: {b.expiryDate} • Stock: {b.stock}
                      </Text>
                    </View>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14 }}>
                      {activeBusiness.currencySymbol}{b.sellingPrice}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Held Bills Modal */}
      {heldBillsModalOpen && (
        <Modal visible={heldBillsModalOpen} transparent animationType="fade">
          <View style={[styles.modalBackdrop, { backgroundColor: colors.backdrop }]}>
            <View
              style={[
                styles.variantPickerCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderRadius: radius.xl,
                },
              ]}
            >
              <View style={styles.variantHeader}>
                <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '700' }}>
                  Parked / Held Bills ({heldBills.length})
                </Text>
                <TouchableOpacity onPress={() => setHeldBillsModalOpen(false)}>
                  <Icon name="close" size={18} color={colors.charcoal} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 280, marginVertical: 10 }}>
                {heldBills.map((hb) => (
                  <TouchableOpacity
                    key={hb.id}
                    onPress={() => {
                      resumeHeldBill(hb.id);
                      setHeldBillsModalOpen(false);
                    }}
                    style={[
                      styles.variantOptionRow,
                      { borderBottomColor: colors.borderLight },
                    ]}
                  >
                    <View>
                      <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13 }}>
                        {hb.customerName || 'Held Customer'} • {hb.timestamp}
                      </Text>
                      <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                        {hb.items.length} items • {hb.tableNo ? `Table: ${hb.tableNo}` : 'Counter'}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14 }}>
                        {activeBusiness.currencySymbol}{hb.total}
                      </Text>
                      <Badge label="Resume" variant="primary" size="sm" />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  posToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  restaurantToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderTypeTabs: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    padding: 2,
  },
  orderTypePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  orderTypePillText: {},
  tableSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  retailToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heldTrayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
  },
  searchBar: {
    flex: 1,
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
  barcodeActionBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewModeBtn: {
    width: 42,
    height: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  categoryChipText: {},
  productListContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  productCardGrid: {
    flex: 0.5,
    margin: 4,
    padding: 12,
    position: 'relative',
  },
  productCardList: {
    marginVertical: 4,
    padding: 12,
    position: 'relative',
  },
  inCartIndicatorBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    paddingHorizontal: 4,
  },
  inCartIndicatorText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  productInfoBlock: {
    flex: 1,
  },
  catStockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productCategoryLabel: {
    maxWidth: 90,
  },
  productName: {
    lineHeight: 18,
    minHeight: 36,
  },
  productSku: {},
  priceActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  productPrice: {},
  mrpCrossed: {},
  addToCartBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyProductState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyProductTitle: {},
  emptyProductSub: {},
  stickyCartBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  cartInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCounterCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCounterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  cartTotalHeading: {},
  taxIncludedNote: {},
  cartBarButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewCartPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  checkoutPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  variantPickerCard: {
    width: '100%',
    padding: 18,
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  variantOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
