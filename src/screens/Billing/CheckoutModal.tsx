import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Icon, IconName } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { PaymentMethod } from '../../types';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (invoice: any) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const {
    cartTotals,
    cartCustomer,
    setCartCustomer,
    activeBusinessCustomers,
    activeBusiness,
    cartDiscount,
    setCartDiscount,
    completeCheckout,
    navigateTo,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [discountInput, setDiscountInput] = useState<string>(
    cartDiscount > 0 ? String(cartDiscount) : ''
  );
  const [cashTendered, setCashTendered] = useState<string>(
    String(cartTotals.grandTotal)
  );
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentOptions: {
    id: PaymentMethod;
    label: string;
    icon: IconName;
    desc: string;
  }[] = [
    { id: 'UPI', label: 'UPI / QR', icon: 'qr-code', desc: 'Instant QR scan' },
    { id: 'CASH', label: 'Cash', icon: 'cash', desc: 'Cash at register' },
    { id: 'CARD', label: 'Card', icon: 'credit-card', desc: 'POS terminal swipe' },
    { id: 'BANK_TRANSFER', label: 'Bank', icon: 'bank', desc: 'NEFT / RTGS / IMPS' },
    { id: 'CREDIT', label: 'Store Credit', icon: 'wallet', desc: 'Ledger account' },
    { id: 'SPLIT', label: 'Split Pay', icon: 'receipt', desc: 'Multiple methods' },
  ];

  const handleApplyDiscount = () => {
    const val = parseFloat(discountInput) || 0;
    setCartDiscount(val);
  };

  const handleFinishPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedInvoice = completeCheckout(paymentMethod);
      onClose();
      onSuccess(generatedInvoice);
    }, 400);
  };

  const cashChange = Math.max(
    0,
    (parseFloat(cashTendered) || cartTotals.grandTotal) - cartTotals.grandTotal
  );

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
                styles.modalCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderTopLeftRadius: radius.xxl,
                  borderTopRightRadius: radius.xxl,
                  paddingBottom: Math.max(insets.bottom, 16),
                  maxHeight: '92%',
                  ...shadows.lg,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.dragBarContainer}>
                <View style={[styles.dragBar, { backgroundColor: colors.border }]} />
              </View>

              <View style={[styles.headerRow, { borderBottomColor: colors.borderLight }]}>
                <View>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.lg,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    Checkout & Payment
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color: colors.secondaryText,
                        fontSize: typography.fontSizes.xs,
                      },
                    ]}
                  >
                    Select customer, apply discounts, and complete payment
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeIconBtn, { backgroundColor: colors.borderLight }]}
                >
                  <Icon name="close" size={18} color={colors.charcoal} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
                {/* Customer Selector Card */}
                <View style={styles.sectionBlock}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.xs,
                        fontWeight: typography.fontWeights.bold,
                        marginBottom: 6,
                      },
                    ]}
                  >
                    BILL TO CUSTOMER
                  </Text>

                  {cartCustomer ? (
                    <View
                      style={[
                        styles.selectedCustomerCard,
                        {
                          backgroundColor: colors.lightCyan,
                          borderColor: colors.lightCyanBorder,
                          borderRadius: radius.md,
                        },
                      ]}
                    >
                      <View style={styles.custLeft}>
                        <Icon name="customer" size={20} color={colors.primary} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 14 }}>
                            {cartCustomer.name}
                          </Text>
                          <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                            {cartCustomer.phone} • {cartCustomer.city || 'Kochi'}
                          </Text>
                          {cartCustomer.loyaltyPoints > 0 && (
                            <Text style={{ color: colors.orangeAccent, fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                              ★ {cartCustomer.loyaltyPoints} Loyalty Points
                            </Text>
                          )}
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() => setCartCustomer(null)}
                        style={styles.changeCustBtn}
                      >
                        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => setCustomerModalOpen(true)}
                      style={[
                        styles.selectCustomerBtn,
                        {
                          borderColor: colors.border,
                          borderRadius: radius.md,
                          backgroundColor: colors.cardBackground,
                        },
                      ]}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name="customer" size={18} color={colors.secondaryText} />
                        <Text
                          style={{
                            color: colors.charcoal,
                            fontSize: 13,
                            marginLeft: 8,
                            fontWeight: '500',
                          }}
                        >
                          Walk-in / Select Customer
                        </Text>
                      </View>
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
                        + Choose
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Bill Discount Input */}
                <View style={styles.sectionBlock}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.xs,
                        fontWeight: typography.fontWeights.bold,
                        marginBottom: 6,
                      },
                    ]}
                  >
                    SPECIAL BILL DISCOUNT ({activeBusiness.currencySymbol})
                  </Text>

                  <View style={styles.discountRow}>
                    <TextInput
                      keyboardType="numeric"
                      placeholder="0.00"
                      value={discountInput}
                      onChangeText={setDiscountInput}
                      placeholderTextColor={colors.mutedText}
                      style={[
                        styles.discountTextInput,
                        {
                          backgroundColor: colors.cardBackground,
                          borderColor: colors.border,
                          borderRadius: radius.md,
                          color: colors.charcoal,
                        },
                      ]}
                    />
                    <TouchableOpacity
                      onPress={handleApplyDiscount}
                      style={[
                        styles.applyDiscountBtn,
                        {
                          backgroundColor: colors.primarySoft,
                          borderRadius: radius.md,
                        },
                      ]}
                    >
                      <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
                        Apply
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Payment Method Selector Grid */}
                <View style={styles.sectionBlock}>
                  <Text
                    style={[
                      styles.sectionLabel,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.xs,
                        fontWeight: typography.fontWeights.bold,
                        marginBottom: 8,
                      },
                    ]}
                  >
                    PAYMENT METHOD
                  </Text>

                  <View style={styles.paymentGrid}>
                    {paymentOptions.map((opt) => {
                      const isSelected = paymentMethod === opt.id;
                      return (
                        <TouchableOpacity
                          key={opt.id}
                          activeOpacity={0.8}
                          onPress={() => setPaymentMethod(opt.id)}
                          style={[
                            styles.paymentOptionCard,
                            {
                              backgroundColor: isSelected
                                ? colors.lightCyan
                                : colors.cardBackground,
                              borderColor: isSelected
                                ? colors.primary
                                : colors.borderLight,
                              borderRadius: radius.lg,
                            },
                          ]}
                        >
                          <Icon
                            name={opt.icon}
                            size={22}
                            color={isSelected ? colors.primary : colors.secondaryText}
                          />
                          <Text
                            style={[
                              styles.payLabel,
                              {
                                color: isSelected ? colors.primary : colors.charcoal,
                                fontSize: typography.fontSizes.xs,
                                fontWeight: isSelected ? '700' : '600',
                                marginTop: 6,
                              },
                            ]}
                          >
                            {opt.label}
                          </Text>
                          <Text
                            style={[
                              styles.payDesc,
                              {
                                color: colors.secondaryText,
                                fontSize: typography.fontSizes.xxs,
                                marginTop: 2,
                              },
                            ]}
                          >
                            {opt.desc}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Payment Method Specific Assistant View */}
                {paymentMethod === 'UPI' && (
                  <View
                    style={[
                      styles.methodAssistantCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderLight,
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <View style={styles.qrAssistantRow}>
                      <View style={[styles.qrMock, { backgroundColor: colors.lightCyan }]}>
                        <Icon name="qr-code" size={54} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1, marginLeft: 14 }}>
                        <Badge label="BHIM UPI Verified" variant="success" size="sm" />
                        <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 14, marginTop: 4 }}>
                          {activeBusiness.upiId || 'pay@universalpos'}
                        </Text>
                        <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
                          Scan using GPay, PhonePe, Paytm or any banking app
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {paymentMethod === 'CASH' && (
                  <View
                    style={[
                      styles.methodAssistantCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderLight,
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                      Cash Tendered from Customer:
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      value={cashTendered}
                      onChangeText={setCashTendered}
                      style={[
                        styles.cashInput,
                        {
                          borderColor: colors.border,
                          borderRadius: radius.md,
                          color: colors.charcoal,
                        },
                      ]}
                    />
                    <View style={styles.changeDueRow}>
                      <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                        Change Due to Customer:
                      </Text>
                      <Text style={{ color: colors.success, fontSize: 16, fontWeight: '800' }}>
                        {activeBusiness.currencySymbol}{cashChange.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}

                {paymentMethod === 'CARD' && (
                  <View
                    style={[
                      styles.methodAssistantCard,
                      {
                        backgroundColor: colors.cardBackground,
                        borderColor: colors.borderLight,
                        borderRadius: radius.lg,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="credit-card" size={24} color={colors.primary} />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13 }}>
                          Swipe / Tap Card on EDC Machine
                        </Text>
                        <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                          Visa, Mastercard, RuPay & Amex accepted
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Final Invoice Summary Card */}
                <View
                  style={[
                    styles.finalSummaryCard,
                    {
                      backgroundColor: colors.cardBackground,
                      borderColor: colors.borderLight,
                      borderRadius: radius.lg,
                      marginTop: spacing.sm,
                    },
                  ]}
                >
                  <View style={styles.sumLine}>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                      Subtotal
                    </Text>
                    <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600' }}>
                      {activeBusiness.currencySymbol}{cartTotals.subtotal.toFixed(2)}
                    </Text>
                  </View>

                  {cartTotals.discountTotal > 0 && (
                    <View style={styles.sumLine}>
                      <Text style={{ color: colors.error, fontSize: 12 }}>
                        Discount
                      </Text>
                      <Text style={{ color: colors.error, fontSize: 12, fontWeight: '600' }}>
                        -{activeBusiness.currencySymbol}{cartTotals.discountTotal.toFixed(2)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.sumLine}>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                      CGST ({activeBusiness.taxType})
                    </Text>
                    <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600' }}>
                      +{activeBusiness.currencySymbol}{cartTotals.cgstTotal.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.sumLine}>
                    <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                      SGST ({activeBusiness.taxType})
                    </Text>
                    <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600' }}>
                      +{activeBusiness.currencySymbol}{cartTotals.sgstTotal.toFixed(2)}
                    </Text>
                  </View>

                  {cartTotals.roundOff !== 0 && (
                    <View style={styles.sumLine}>
                      <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                        Round Off
                      </Text>
                      <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                        {cartTotals.roundOff > 0 ? `+${cartTotals.roundOff}` : cartTotals.roundOff}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.netPayableRow,
                      {
                        borderTopColor: colors.borderLight,
                        marginTop: 8,
                        paddingTop: 8,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '800' }}>
                      Net Payable
                    </Text>
                    <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '900' }}>
                      {activeBusiness.currencySymbol}{cartTotals.grandTotal.toLocaleString('en-IN')}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* Complete & Generate Invoice Button */}
              <View style={[styles.submitContainer, { borderTopColor: colors.borderLight }]}>
                <Button
                  title={`Complete & Generate Invoice (${activeBusiness.currencySymbol}${cartTotals.grandTotal})`}
                  variant="primary"
                  size="lg"
                  loading={isProcessing}
                  icon={<Icon name="check" size={20} color={colors.white} />}
                  onPress={handleFinishPayment}
                  fullWidth
                />
              </View>

              {/* Modal for selecting a customer */}
              {customerModalOpen && (
                <Modal visible={customerModalOpen} transparent animationType="fade">
                  <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
                    <View
                      style={[
                        styles.customerPickerCard,
                        {
                          backgroundColor: colors.cardBackground,
                          borderRadius: radius.xl,
                        },
                      ]}
                    >
                      <View style={styles.headerRow}>
                        <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '700' }}>
                          Select Registered Customer
                        </Text>
                        <TouchableOpacity onPress={() => setCustomerModalOpen(false)}>
                          <Icon name="close" size={18} color={colors.charcoal} />
                        </TouchableOpacity>
                      </View>

                      <ScrollView style={{ maxHeight: 280, marginVertical: 10 }}>
                        {activeBusinessCustomers.map((c) => (
                          <TouchableOpacity
                            key={c.id}
                            onPress={() => {
                              setCartCustomer(c);
                              setCustomerModalOpen(false);
                            }}
                            style={[
                              styles.custItemPick,
                              { borderBottomColor: colors.borderLight },
                            ]}
                          >
                            <View>
                              <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 14 }}>
                                {c.name}
                              </Text>
                              <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                                {c.phone}
                              </Text>
                            </View>
                            <Badge label={`★ ${c.loyaltyPoints}`} variant="orange" size="sm" />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>

                      <Button
                        title="+ Add New Customer"
                        variant="outline"
                        onPress={() => {
                          setCustomerModalOpen(false);
                          navigateTo('add_edit_customer');
                        }}
                        fullWidth
                      />
                    </View>
                  </View>
                </Modal>
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
  modalCard: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  dragBarContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  dragBar: {
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
  title: {},
  subtitle: {
    marginTop: 2,
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    marginVertical: 10,
  },
  sectionBlock: {
    marginBottom: 14,
  },
  sectionLabel: {
    letterSpacing: 0.5,
  },
  selectedCustomerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
  },
  custLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  changeCustBtn: {
    padding: 6,
  },
  selectCustomerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  discountRow: {
    flexDirection: 'row',
    gap: 10,
  },
  discountTextInput: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 42,
  },
  applyDiscountBtn: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentOptionCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderWidth: 1.5,
  },
  payLabel: {
    textAlign: 'center',
  },
  payDesc: {
    textAlign: 'center',
  },
  methodAssistantCard: {
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  qrAssistantRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qrMock: {
    width: 68,
    height: 68,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashInput: {
    borderWidth: 1,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
  },
  changeDueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  finalSummaryCard: {
    padding: 14,
    borderWidth: 1,
  },
  sumLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  netPayableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
  },
  submitContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  customerPickerCard: {
    width: '90%',
    padding: 18,
    alignSelf: 'center',
    marginTop: 100,
  },
  custItemPick: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
});
