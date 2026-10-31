import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

interface CartModalProps {
  visible: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  visible,
  onClose,
  onProceedToCheckout,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const {
    cart,
    updateCartItemQty,
    clearCart,
    holdCurrentBill,
    cartTotals,
    cartCustomer,
    activeBusiness,
    selectedTable,
    orderType,
  } = useApp();

  const handleHoldBill = () => {
    holdCurrentBill('Held from Cart modal');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheetContainer,
                {
                  backgroundColor: colors.cardBackground,
                  borderTopLeftRadius: radius.xxl,
                  borderTopRightRadius: radius.xxl,
                  paddingBottom: Math.max(insets.bottom, 16),
                  maxHeight: '90%',
                  ...shadows.lg,
                },
              ]}
            >
              {/* Sheet Drag Pill */}
              <View style={styles.pillContainer}>
                <View
                  style={[
                    styles.dragPill,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              {/* Sheet Header */}
              <View
                style={[
                  styles.headerRow,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <View>
                  <View style={styles.titleBadgeRow}>
                    <Text
                      style={[
                        styles.sheetTitle,
                        {
                          color: colors.charcoal,
                          fontSize: typography.fontSizes.lg,
                          fontWeight: typography.fontWeights.bold,
                        },
                      ]}
                    >
                      Current Order Cart
                    </Text>
                    <Badge
                      label={`${cartTotals.itemCount} items`}
                      variant="primary"
                      size="sm"
                    />
                  </View>

                  <Text
                    style={[
                      styles.sheetSubtitle,
                      {
                        color: colors.secondaryText,
                        fontSize: typography.fontSizes.xs,
                      },
                    ]}
                  >
                    {orderType} • {selectedTable ? `Table: ${selectedTable}` : 'Counter Bill'}
                    {cartCustomer ? ` • ${cartCustomer.name}` : ''}
                  </Text>
                </View>

                {cart.length > 0 && (
                  <TouchableOpacity
                    onPress={clearCart}
                    style={styles.clearBtn}
                  >
                    <Icon name="trash" size={16} color={colors.error} />
                    <Text
                      style={[
                        styles.clearText,
                        {
                          color: colors.error,
                          fontSize: typography.fontSizes.xs,
                          fontWeight: '600',
                          marginLeft: 4,
                        },
                      ]}
                    >
                      Clear
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Cart Items List */}
              <ScrollView
                style={styles.itemList}
                showsVerticalScrollIndicator={false}
              >
                {cart.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Icon name="cart" size={48} color={colors.mutedText} />
                    <Text
                      style={[
                        styles.emptyText,
                        {
                          color: colors.secondaryText,
                          fontSize: typography.fontSizes.base,
                          marginTop: 12,
                        },
                      ]}
                    >
                      No products added to cart yet
                    </Text>
                    <Text
                      style={[
                        styles.emptySubtext,
                        {
                          color: colors.mutedText,
                          fontSize: typography.fontSizes.xs,
                          marginTop: 4,
                        },
                      ]}
                    >
                      Tap products from the POS catalog or scan barcode
                    </Text>
                  </View>
                ) : (
                  cart.map((item) => (
                    <View
                      key={item.id}
                      style={[
                        styles.cartItemRow,
                        { borderBottomColor: colors.borderLight },
                      ]}
                    >
                      {/* Item Details */}
                      <View style={styles.itemInfo}>
                        <Text
                          style={[
                            styles.itemName,
                            {
                              color: colors.charcoal,
                              fontSize: typography.fontSizes.base,
                              fontWeight: typography.fontWeights.semiBold,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.product.name}
                        </Text>

                        {item.selectedVariant && (
                          <Text
                            style={[
                              styles.variantBadgeText,
                              {
                                color: colors.primary,
                                fontSize: typography.fontSizes.xs,
                              },
                            ]}
                          >
                            {item.selectedVariant.name}
                          </Text>
                        )}

                        {item.selectedBatch && (
                          <Text
                            style={[
                              styles.batchText,
                              {
                                color: colors.secondaryText,
                                fontSize: typography.fontSizes.xxs,
                              },
                            ]}
                          >
                            Batch: {item.selectedBatch.batchNo} (Exp: {item.selectedBatch.expiryDate})
                          </Text>
                        )}

                        <View style={styles.priceTaxRow}>
                          <Text
                            style={[
                              styles.unitPrice,
                              {
                                color: colors.secondaryText,
                                fontSize: typography.fontSizes.xs,
                              },
                            ]}
                          >
                            {activeBusiness.currencySymbol}{item.unitPrice} × {item.quantity}
                          </Text>
                          <Badge
                            label={`GST ${item.taxRate}%`}
                            variant="cyan"
                            size="sm"
                          />
                        </View>
                      </View>

                      {/* Quantity Controls & Line Total */}
                      <View style={styles.itemRightGroup}>
                        <Text
                          style={[
                            styles.lineTotal,
                            {
                              color: colors.charcoal,
                              fontSize: typography.fontSizes.base,
                              fontWeight: typography.fontWeights.extraBold,
                            },
                          ]}
                        >
                          {activeBusiness.currencySymbol}{item.total.toLocaleString('en-IN')}
                        </Text>

                        <View
                          style={[
                            styles.qtyControlGroup,
                            {
                              backgroundColor: colors.borderLight,
                              borderRadius: radius.md,
                            },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => updateCartItemQty(item.id, -1)}
                            style={styles.qtyBtn}
                          >
                            <Icon name="minus" size={14} color={colors.charcoal} />
                          </TouchableOpacity>

                          <Text
                            style={[
                              styles.qtyText,
                              {
                                color: colors.charcoal,
                                fontSize: typography.fontSizes.base,
                                fontWeight: typography.fontWeights.bold,
                              },
                            ]}
                          >
                            {item.quantity}
                          </Text>

                          <TouchableOpacity
                            onPress={() => updateCartItemQty(item.id, 1)}
                            style={styles.qtyBtn}
                          >
                            <Icon name="plus" size={14} color={colors.charcoal} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Cart Footer Calculations & Checkout Button */}
              {cart.length > 0 && (
                <View
                  style={[
                    styles.footerContainer,
                    {
                      borderTopColor: colors.borderLight,
                      paddingTop: spacing.md,
                    },
                  ]}
                >
                  {/* Calculation Breakdown */}
                  <View style={styles.calcRow}>
                    <Text style={[styles.calcLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                      Subtotal (Taxable)
                    </Text>
                    <Text style={[styles.calcVal, { color: colors.charcoal, fontSize: typography.fontSizes.sm, fontWeight: '600' }]}>
                      {activeBusiness.currencySymbol}{cartTotals.subtotal.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.calcRow}>
                    <Text style={[styles.calcLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                      Taxes (CGST + SGST)
                    </Text>
                    <Text style={[styles.calcVal, { color: colors.charcoal, fontSize: typography.fontSizes.sm, fontWeight: '600' }]}>
                      +{activeBusiness.currencySymbol}{cartTotals.taxTotal.toFixed(2)}
                    </Text>
                  </View>

                  {cartTotals.roundOff !== 0 && (
                    <View style={styles.calcRow}>
                      <Text style={[styles.calcLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
                        Round Off
                      </Text>
                      <Text style={[styles.calcVal, { color: colors.secondaryText, fontSize: typography.fontSizes.sm }]}>
                        {cartTotals.roundOff > 0 ? `+${cartTotals.roundOff}` : cartTotals.roundOff}
                      </Text>
                    </View>
                  )}

                  {/* Grand Total */}
                  <View style={[styles.grandTotalRow, { marginVertical: spacing.sm }]}>
                    <Text
                      style={[
                        styles.grandTotalLabel,
                        {
                          color: colors.charcoal,
                          fontSize: typography.fontSizes.md,
                          fontWeight: typography.fontWeights.bold,
                        },
                      ]}
                    >
                      Payable Amount
                    </Text>
                    <Text
                      style={[
                        styles.grandTotalVal,
                        {
                          color: colors.primary,
                          fontSize: typography.fontSizes.xxl,
                          fontWeight: typography.fontWeights.extraBold,
                        },
                      ]}
                    >
                      {activeBusiness.currencySymbol}{cartTotals.grandTotal.toLocaleString('en-IN')}
                    </Text>
                  </View>

                  {/* Action Buttons: Hold Bill & Proceed to Payment */}
                  <View style={styles.actionButtonsRow}>
                    <Button
                      title="Hold Bill"
                      variant="outline"
                      size="md"
                      icon={<Icon name="clock" size={16} color={colors.primary} />}
                      onPress={handleHoldBill}
                      style={{ flex: 1, marginRight: 10 }}
                    />

                    <Button
                      title={`Pay ${activeBusiness.currencySymbol}${cartTotals.grandTotal}`}
                      variant="primary"
                      size="md"
                      icon={<Icon name="credit-card" size={18} color={colors.white} />}
                      onPress={onProceedToCheckout}
                      style={{ flex: 2 }}
                    />
                  </View>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pillContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragPill: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {},
  sheetSubtitle: {
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  clearText: {},
  itemList: {
    marginVertical: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontWeight: '700',
  },
  emptySubtext: {
    textAlign: 'center',
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {},
  variantBadgeText: {
    marginTop: 2,
    fontWeight: '600',
  },
  batchText: {
    marginTop: 1,
  },
  priceTaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  unitPrice: {},
  itemRightGroup: {
    alignItems: 'flex-end',
  },
  lineTotal: {
    marginBottom: 6,
  },
  qtyControlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    paddingHorizontal: 8,
  },
  footerContainer: {
    borderTopWidth: 1,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calcLabel: {},
  calcVal: {},
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grandTotalLabel: {},
  grandTotalVal: {},
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
});
