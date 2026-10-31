import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';

export const InvoicePreviewScreen: React.FC = () => {
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const {
    selectedInvoice,
    activeBusiness,
    invoiceThemes,
    activeInvoiceTheme,
    setActiveInvoiceTheme,
    cancelInvoice,
    goBack,
  } = useApp();

  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [printSuccessAlert, setPrintSuccessAlert] = useState<string | null>(null);

  const invoice = selectedInvoice;

  if (!invoice) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
        <Header showBack title="Invoice Preview" onBackPress={goBack} />
        <View style={styles.notFoundCenter}>
          <Icon name="receipt" size={48} color={colors.mutedText} />
          <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '700', marginTop: 12 }}>
            No invoice selected
          </Text>
          <Button title="Go Back" variant="outline" onPress={goBack} style={{ marginTop: 16 }} />
        </View>
      </View>
    );
  }

  const currentTheme =
    invoiceThemes.find((t) => t.id === invoice.themeId) || activeInvoiceTheme;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Tax Invoice ${invoice.invoiceNumber} from ${activeBusiness.name} for ${activeBusiness.currencySymbol}${invoice.grandTotal}.\nPayment Status: ${invoice.status}`,
        title: `Invoice ${invoice.invoiceNumber}`,
      });
    } catch {
      // share canceled or error
    }
  };

  const handleWhatsApp = () => {
    setPrintSuccessAlert(`WhatsApp message generated for invoice ${invoice.invoiceNumber}`);
    setTimeout(() => setPrintSuccessAlert(null), 3000);
  };

  const handlePrint = () => {
    setPrintSuccessAlert(`Printing to thermal printer (80mm width) – Invoice ${invoice.invoiceNumber}`);
    setTimeout(() => setPrintSuccessAlert(null), 3000);
  };

  const handleDownloadPDF = () => {
    setPrintSuccessAlert(`Exported PDF: ${invoice.invoiceNumber}.pdf saved to device`);
    setTimeout(() => setPrintSuccessAlert(null), 3000);
  };

  const handleCancelBill = () => {
    cancelInvoice(invoice.id);
    setPrintSuccessAlert(`Invoice ${invoice.invoiceNumber} has been voided/cancelled.`);
    setTimeout(() => setPrintSuccessAlert(null), 3000);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Tax Invoice"
        subtitle={invoice.invoiceNumber}
        onBackPress={goBack}
        rightAction={
          <TouchableOpacity
            onPress={() => setThemeSelectorOpen(!themeSelectorOpen)}
            style={[
              styles.themeToggleBtn,
              {
                backgroundColor: currentTheme.primaryColor,
              },
            ]}
          >
            <Icon name="tag" size={14} color="#FFFFFF" />
            <Text style={styles.themeToggleText}>Theme</Text>
          </TouchableOpacity>
        }
      />

      {/* Temporary Alert Banner */}
      {printSuccessAlert && (
        <View style={[styles.alertBanner, { backgroundColor: colors.successSoft }]}>
          <Icon name="check-circle" size={16} color={colors.success} />
          <Text style={[styles.alertBannerText, { color: colors.success }]}>
            {printSuccessAlert}
          </Text>
        </View>
      )}

      {/* Theme Picker Dropdown if toggled */}
      {themeSelectorOpen && (
        <View
          style={[
            styles.themePaletteDropdown,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.borderLight,
              ...shadows.md,
            },
          ]}
        >
          <Text
            style={[
              styles.themePaletteTitle,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.xs,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            SELECT INVOICE COLOR THEME
          </Text>

          <View style={styles.themeSwatchesRow}>
            {invoiceThemes.map((th) => (
              <TouchableOpacity
                key={th.id}
                onPress={() => {
                  setActiveInvoiceTheme(th);
                  setThemeSelectorOpen(false);
                }}
                style={[
                  styles.themeSwatch,
                  {
                    backgroundColor: th.primaryColor,
                    borderColor:
                      currentTheme.id === th.id ? colors.charcoal : 'transparent',
                    borderWidth: currentTheme.id === th.id ? 2.5 : 0,
                  },
                ]}
              >
                {currentTheme.id === th.id && (
                  <Icon name="check" size={12} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Authentic Red Invoice Document Card */}
        <View
          style={[
            styles.invoiceSheet,
            {
              backgroundColor: colors.cardBackground,
              borderRadius: radius.xl,
              ...shadows.lg,
            },
          ]}
        >
          {/* Top Brand Header (Primary Red or active theme color) */}
          <View
            style={[
              styles.redHeaderBand,
              {
                backgroundColor: currentTheme.primaryColor,
                borderTopLeftRadius: radius.xl,
                borderTopRightRadius: radius.xl,
              },
            ]}
          >
            <View style={styles.businessHeaderLeft}>
              <View style={styles.logoBadgeContainer}>
                <Text style={styles.logoInitials}>
                  {activeBusiness.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.headerBusinessName} numberOfLines={1}>
                  {activeBusiness.name}
                </Text>
                <Text style={styles.headerTagline}>
                  {activeBusiness.tagline || activeBusiness.subcategory}
                </Text>
                <Text style={styles.headerAddress}>
                  {activeBusiness.address}, {activeBusiness.city}
                </Text>
                {activeBusiness.gstin && (
                  <Text style={styles.headerGstin}>
                    GSTIN: {activeBusiness.gstin}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.invoiceTitleBadgeBlock}>
              <Text style={styles.taxInvoiceHeading}>TAX INVOICE</Text>
              <View style={styles.invoiceStatusBadge}>
                <Text style={styles.invoiceStatusBadgeText}>
                  {invoice.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Invoice Meta Row: Date, Invoice No, Billed To */}
          <View style={[styles.invoiceMetaSection, { borderBottomColor: colors.borderLight }]}>
            <View style={styles.metaCol}>
              <Text style={[styles.metaLabel, { color: colors.secondaryText }]}>
                Invoice No:
              </Text>
              <Text style={[styles.metaVal, { color: colors.charcoal }]}>
                {invoice.invoiceNumber}
              </Text>

              <Text style={[styles.metaLabel, { color: colors.secondaryText, marginTop: 8 }]}>
                Date & Time:
              </Text>
              <Text style={[styles.metaVal, { color: colors.charcoal }]}>
                {invoice.date} {invoice.time}
              </Text>
            </View>

            <View style={styles.metaColRight}>
              <Text style={[styles.metaLabel, { color: colors.secondaryText }]}>
                Billed To:
              </Text>
              <Text style={[styles.metaVal, { color: colors.charcoal, fontWeight: '700' }]}>
                {invoice.customer?.name || 'Walk-in Retail Customer'}
              </Text>
              {invoice.customer?.phone && (
                <Text style={[styles.metaValSub, { color: colors.secondaryText }]}>
                  Phone: {invoice.customer.phone}
                </Text>
              )}
              {invoice.customer?.gstin && (
                <Text style={[styles.metaValSub, { color: colors.secondaryText }]}>
                  Customer GST: {invoice.customer.gstin}
                </Text>
              )}
              {invoice.tableNo && (
                <Text style={[styles.metaValSub, { color: currentTheme.primaryColor, fontWeight: '600' }]}>
                  Dine-In Table: {invoice.tableNo}
                </Text>
              )}
            </View>
          </View>

          {/* Items Table Header */}
          <View
            style={[
              styles.tableHeaderRow,
              {
                backgroundColor: currentTheme.tableHeaderBg,
              },
            ]}
          >
            <Text style={[styles.thItem, { color: currentTheme.primaryColor }]}>ITEM</Text>
            <Text style={[styles.thQty, { color: currentTheme.primaryColor }]}>QTY</Text>
            <Text style={[styles.thRate, { color: currentTheme.primaryColor }]}>RATE</Text>
            <Text style={[styles.thTax, { color: currentTheme.primaryColor }]}>TAX%</Text>
            <Text style={[styles.thTotal, { color: currentTheme.primaryColor }]}>TOTAL</Text>
          </View>

          {/* Items Rows */}
          {invoice.items.map((it, idx) => (
            <View
              key={it.id || idx}
              style={[
                styles.tableRow,
                {
                  borderBottomColor: colors.borderLight,
                  backgroundColor: idx % 2 === 0 ? 'transparent' : colors.lightBackground,
                },
              ]}
            >
              <View style={styles.tdItem}>
                <Text style={[styles.rowItemName, { color: colors.charcoal }]} numberOfLines={2}>
                  {it.product.name}
                </Text>
                {it.selectedVariant && (
                  <Text style={[styles.rowItemSub, { color: currentTheme.primaryColor }]}>
                    {it.selectedVariant.name}
                  </Text>
                )}
                {it.selectedBatch && (
                  <Text style={[styles.rowItemSub, { color: colors.secondaryText }]}>
                    B: {it.selectedBatch.batchNo}
                  </Text>
                )}
              </View>
              <Text style={[styles.tdQty, { color: colors.charcoal }]}>{it.quantity}</Text>
              <Text style={[styles.tdRate, { color: colors.charcoal }]}>
                {it.unitPrice.toFixed(2)}
              </Text>
              <Text style={[styles.tdTax, { color: colors.secondaryText }]}>
                {it.taxRate}%
              </Text>
              <Text style={[styles.tdTotal, { color: colors.charcoal, fontWeight: '700' }]}>
                {it.total.toFixed(2)}
              </Text>
            </View>
          ))}

          {/* Calculations & Taxes Summary */}
          <View style={[styles.summaryBlock, { borderBottomColor: colors.borderLight }]}>
            <View style={styles.sumRow}>
              <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>Subtotal</Text>
              <Text style={[styles.sumValue, { color: colors.charcoal }]}>
                {activeBusiness.currencySymbol}{invoice.subtotal.toFixed(2)}
              </Text>
            </View>

            {invoice.discountTotal > 0 && (
              <View style={styles.sumRow}>
                <Text style={[styles.sumLabel, { color: colors.error }]}>Discount</Text>
                <Text style={[styles.sumValue, { color: colors.error }]}>
                  -{activeBusiness.currencySymbol}{invoice.discountTotal.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.sumRow}>
              <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>
                CGST (Central Tax)
              </Text>
              <Text style={[styles.sumValue, { color: colors.charcoal }]}>
                +{activeBusiness.currencySymbol}{invoice.cgstTotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.sumRow}>
              <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>
                SGST (State Tax)
              </Text>
              <Text style={[styles.sumValue, { color: colors.charcoal }]}>
                +{activeBusiness.currencySymbol}{invoice.sgstTotal.toFixed(2)}
              </Text>
            </View>

            {invoice.roundOff !== 0 && (
              <View style={styles.sumRow}>
                <Text style={[styles.sumLabel, { color: colors.secondaryText }]}>Round Off</Text>
                <Text style={[styles.sumValue, { color: colors.secondaryText }]}>
                  {invoice.roundOff > 0 ? `+${invoice.roundOff}` : invoice.roundOff}
                </Text>
              </View>
            )}

            {/* Total Grand Banner */}
            <View
              style={[
                styles.grandTotalBanner,
                {
                  backgroundColor: currentTheme.tableHeaderBg,
                  borderRadius: radius.md,
                },
              ]}
            >
              <Text
                style={[
                  styles.grandTotalBannerLabel,
                  { color: currentTheme.primaryColor },
                ]}
              >
                GRAND TOTAL
              </Text>
              <Text
                style={[
                  styles.grandTotalBannerVal,
                  { color: currentTheme.primaryColor },
                ]}
              >
                {activeBusiness.currencySymbol}{invoice.grandTotal.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Payment & UPI QR Code Section */}
          <View style={[styles.upiBankSection, { borderBottomColor: colors.borderLight }]}>
            <View style={styles.upiQrBox}>
              <View
                style={[
                  styles.qrPlaceholder,
                  { borderColor: currentTheme.primaryColor },
                ]}
              >
                <Icon name="qr-code" size={54} color={currentTheme.primaryColor} />
              </View>
              <Text style={[styles.scanQrText, { color: colors.secondaryText }]}>
                Scan & Pay via UPI
              </Text>
              <Text style={[styles.upiIdText, { color: colors.charcoal }]}>
                {activeBusiness.upiId || 'pay@universalpos'}
              </Text>
            </View>

            <View style={styles.bankDetailsBox}>
              <Text
                style={[
                  styles.bankTitle,
                  { color: colors.charcoal, fontWeight: '700' },
                ]}
              >
                Bank Transfer Details:
              </Text>
              <Text style={[styles.bankLine, { color: colors.secondaryText }]}>
                Bank: {activeBusiness.bankDetails.bankName}
              </Text>
              <Text style={[styles.bankLine, { color: colors.secondaryText }]}>
                A/C: {activeBusiness.bankDetails.accountNumber}
              </Text>
              <Text style={[styles.bankLine, { color: colors.secondaryText }]}>
                IFSC: {activeBusiness.bankDetails.ifsc}
              </Text>
              <Text style={[styles.bankLine, { color: colors.secondaryText }]}>
                Payment Mode: {invoice.paymentMethod}
              </Text>
            </View>
          </View>

          {/* Terms & Conditions & Signatory */}
          <View style={styles.termsAndSignatureSection}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text
                style={[
                  styles.termsHeading,
                  { color: colors.charcoal, fontWeight: '700' },
                ]}
              >
                Terms & Conditions:
              </Text>
              {activeBusiness.terms.slice(0, 2).map((term, i) => (
                <Text
                  key={i}
                  style={[styles.termBullet, { color: colors.mutedText }]}
                >
                  • {term}
                </Text>
              ))}
            </View>

            <View style={styles.signatoryBox}>
              <View style={[styles.signatureLine, { borderColor: colors.secondaryText }]} />
              <Text style={[styles.signatoryLabel, { color: colors.secondaryText }]}>
                Authorized Signatory
              </Text>
              <Text style={[styles.bizNameSmall, { color: colors.charcoal }]}>
                For {activeBusiness.name}
              </Text>
            </View>
          </View>
        </View>

        {/* Invoice Action Buttons Bar */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePrint}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.cardBackground, borderColor: colors.borderLight },
            ]}
          >
            <Icon name="printer" size={18} color={currentTheme.primaryColor} />
            <Text style={[styles.actionBtnText, { color: colors.charcoal }]}>Print</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDownloadPDF}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.cardBackground, borderColor: colors.borderLight },
            ]}
          >
            <Icon name="download" size={18} color={colors.info} />
            <Text style={[styles.actionBtnText, { color: colors.charcoal }]}>PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleWhatsApp}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.cardBackground, borderColor: colors.borderLight },
            ]}
          >
            <Icon name="whatsapp" size={18} color={colors.success} />
            <Text style={[styles.actionBtnText, { color: colors.charcoal }]}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleShare}
            style={[
              styles.actionBtn,
              { backgroundColor: colors.cardBackground, borderColor: colors.borderLight },
            ]}
          >
            <Icon name="share" size={18} color={colors.charcoal} />
            <Text style={[styles.actionBtnText, { color: colors.charcoal }]}>Share</Text>
          </TouchableOpacity>

          {invoice.status !== 'CANCELLED' && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancelBill}
              style={[
                styles.actionBtn,
                { backgroundColor: colors.cardBackground, borderColor: colors.borderLight },
              ]}
            >
              <Icon name="close" size={18} color={colors.error} />
              <Text style={[styles.actionBtnText, { color: colors.error }]}>Void</Text>
            </TouchableOpacity>
          )}
        </View>
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
  notFoundCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  themeToggleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  alertBannerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  themePaletteDropdown: {
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  themePaletteTitle: {
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  themeSwatchesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  themeSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoiceSheet: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  redHeaderBand: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  businessHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadgeContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInitials: {
    color: '#ED172C',
    fontSize: 18,
    fontWeight: '900',
  },
  headerBusinessName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerTagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 1,
  },
  headerAddress: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 10,
    marginTop: 2,
  },
  headerGstin: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  invoiceTitleBadgeBlock: {
    alignItems: 'flex-end',
  },
  taxInvoiceHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  invoiceStatusBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 6,
  },
  invoiceStatusBadgeText: {
    color: '#ED172C',
    fontSize: 10,
    fontWeight: '800',
  },
  invoiceMetaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  metaCol: {
    flex: 1,
  },
  metaColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metaLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  metaValSub: {
    fontSize: 11,
    marginTop: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  thItem: {
    flex: 2.2,
    fontSize: 10,
    fontWeight: '800',
  },
  thQty: {
    flex: 0.8,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
  },
  thRate: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
  },
  thTax: {
    flex: 0.9,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
  },
  thTotal: {
    flex: 1.2,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  tdItem: {
    flex: 2.2,
  },
  rowItemName: {
    fontSize: 11,
    fontWeight: '600',
  },
  rowItemSub: {
    fontSize: 9,
    marginTop: 1,
  },
  tdQty: {
    flex: 0.8,
    fontSize: 11,
    textAlign: 'center',
  },
  tdRate: {
    flex: 1,
    fontSize: 11,
    textAlign: 'right',
  },
  tdTax: {
    flex: 0.9,
    fontSize: 10,
    textAlign: 'right',
  },
  tdTotal: {
    flex: 1.2,
    fontSize: 11,
    textAlign: 'right',
  },
  summaryBlock: {
    padding: 14,
    borderBottomWidth: 1,
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sumLabel: {
    fontSize: 11,
  },
  sumValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  grandTotalBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  grandTotalBannerLabel: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  grandTotalBannerVal: {
    fontSize: 18,
    fontWeight: '900',
  },
  upiBankSection: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
  },
  upiQrBox: {
    alignItems: 'center',
    width: 110,
  },
  qrPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanQrText: {
    fontSize: 9,
    marginTop: 4,
  },
  upiIdText: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  bankDetailsBox: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  bankTitle: {
    fontSize: 11,
    marginBottom: 2,
  },
  bankLine: {
    fontSize: 10,
    marginTop: 1,
  },
  termsAndSignatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  termsHeading: {
    fontSize: 10,
    marginBottom: 2,
  },
  termBullet: {
    fontSize: 9,
    lineHeight: 13,
  },
  signatoryBox: {
    alignItems: 'center',
    width: 120,
    justifyContent: 'flex-end',
  },
  signatureLine: {
    width: 100,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  signatoryLabel: {
    fontSize: 9,
  },
  bizNameSmall: {
    fontSize: 9,
    fontWeight: '700',
    marginTop: 1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
});
