import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

export const BarcodeScannerScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const {
    activeBusinessProducts,
    activeBusiness,
    addToCart,
    goBack,
    setActiveTab,
  } = useApp();

  const [manualCode, setManualCode] = useState('');
  const [lastScannedProduct, setLastScannedProduct] = useState<any>(null);

  const handleScanCode = (barcode: string) => {
    const match = activeBusinessProducts.find(
      (p) => p.barcode === barcode || p.sku.toLowerCase() === barcode.toLowerCase()
    );
    if (match) {
      addToCart(match, 1);
      setLastScannedProduct(match);
      setManualCode('');
    } else {
      setLastScannedProduct(null);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Barcode POS Scanner"
        subtitle="Aim camera at UPC/EAN barcode or enter SKU"
        onBackPress={goBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Viewfinder Camera Simulation */}
        <View style={[styles.cameraContainer, { backgroundColor: '#181A1C', borderRadius: radius.xl }]}>
          <View style={styles.viewfinderBox}>
            {/* Corner brackets */}
            <View style={[styles.cornerTL, { borderColor: colors.primary }]} />
            <View style={[styles.cornerTR, { borderColor: colors.primary }]} />
            <View style={[styles.cornerBL, { borderColor: colors.primary }]} />
            <View style={[styles.cornerBR, { borderColor: colors.primary }]} />

            {/* Red Laser Scanning Beam */}
            <View style={[styles.laserBeam, { backgroundColor: colors.primary }]} />

            <Icon name="barcode" size={48} color="rgba(255, 255, 255, 0.4)" />
            <Text style={styles.viewfinderHint}>Align barcode within frame</Text>
          </View>
        </View>

        {/* Last Scanned Product Confirmation Card */}
        {lastScannedProduct ? (
          <Card
            variant="cyan"
            style={[styles.scannedSuccessCard, { borderRadius: radius.xl, marginTop: spacing.md }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.checkCircle, { backgroundColor: colors.success }]}>
                <Icon name="check" size={16} color={colors.white} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ color: colors.charcoal, fontWeight: '800', fontSize: 14 }}>
                  Added to Current Bill:
                </Text>
                <Text style={{ color: colors.charcoal, fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                  {lastScannedProduct.name}
                </Text>
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800', marginTop: 2 }}>
                  {activeBusiness.currencySymbol}{lastScannedProduct.sellingPrice} • Barcode: {lastScannedProduct.barcode}
                </Text>
              </View>
            </View>

            <Button
              title="Go to POS Cart & Checkout →"
              variant="primary"
              size="sm"
              onPress={() => setActiveTab('billing')}
              style={{ marginTop: 10 }}
            />
          </Card>
        ) : null}

        {/* Manual SKU / Barcode Entry */}
        <Card style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>
            MANUAL BARCODE / SKU ENTRY
          </Text>

          <View style={styles.manualRow}>
            <TextInput
              placeholder="e.g. 890123450001 or FMCG-OIL-01"
              value={manualCode}
              onChangeText={setManualCode}
              placeholderTextColor={colors.mutedText}
              style={[
                styles.manualInput,
                {
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  color: colors.charcoal,
                },
              ]}
            />
            <Button
              title="Add"
              variant="primary"
              onPress={() => handleScanCode(manualCode)}
            />
          </View>
        </Card>

        {/* Quick Simulated Barcode Test Buttons */}
        <Card style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.charcoal, fontWeight: '700', fontSize: 13, marginBottom: 8 }}>
            ONE-TAP TEST BARCODES
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 11, marginBottom: 10 }}>
            Tap any sample barcode to test real-time scanner add-to-cart:
          </Text>

          <View style={styles.sampleBarcodesList}>
            {activeBusinessProducts.slice(0, 4).map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => handleScanCode(p.barcode)}
                style={[
                  styles.sampleBarcodeRow,
                  {
                    borderBottomColor: colors.borderLight,
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.charcoal, fontWeight: '600', fontSize: 12 }}>
                    {p.name}
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                    Code: {p.barcode}
                  </Text>
                </View>
                <Badge label="+ Scan" variant="primary" size="sm" />
              </TouchableOpacity>
            ))}
          </View>
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
  cameraContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  viewfinderBox: {
    width: 220,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  laserBeam: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 2,
    opacity: 0.8,
  },
  viewfinderHint: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 8,
  },
  scannedSuccessCard: {
    padding: 14,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualRow: {
    flexDirection: 'row',
    gap: 8,
  },
  manualInput: {
    flex: 1,
    borderWidth: 1,
    height: 42,
    paddingHorizontal: 12,
  },
  sampleBarcodesList: {
    gap: 8,
  },
  sampleBarcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
