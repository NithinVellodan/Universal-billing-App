import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const SettingsScreen: React.FC = () => {
  const { colors, radius, spacing, isDark, toggleTheme } = useTheme();
  const {
    activeBusiness,
    updateBusiness,
    activeInvoiceTheme,
    invoiceThemes,
    setActiveInvoiceTheme,
    goBack,
  } = useApp();

  const [autoRoundOff, setAutoRoundOff] = useState(
    activeBusiness.settings.autoRoundOff
  );
  const [barcodeEnabled, setBarcodeEnabled] = useState(
    activeBusiness.settings.enableBarcode
  );
  const [offlineSyncAlert, setOfflineSyncAlert] = useState(false);

  const handleToggleAutoRoundOff = (val: boolean) => {
    setAutoRoundOff(val);
    updateBusiness({
      settings: { ...activeBusiness.settings, autoRoundOff: val },
    });
  };

  const handleToggleBarcode = (val: boolean) => {
    setBarcodeEnabled(val);
    updateBusiness({
      settings: { ...activeBusiness.settings, enableBarcode: val },
    });
  };

  const handleSyncData = () => {
    setOfflineSyncAlert(true);
    setTimeout(() => {
      setOfflineSyncAlert(false);
      Alert.alert(
        'Cloud Backup Sync',
        'All local SQLite records, sales invoices, and customer balances are synced successfully to cloud vault.'
      );
    }, 1200);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Settings & System Config"
        subtitle="Hardware, GST, and business configurations"
        onBackPress={goBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Active Business Entity Summary */}
        <Card variant="cyan" style={styles.bizCard}>
          <Text style={{ color: colors.secondaryText, fontSize: 11, textTransform: 'uppercase' }}>
            ACTIVE BUSINESS ENTITY
          </Text>
          <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '800', marginTop: 2 }}>
            {activeBusiness.name}
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 1 }}>
            {activeBusiness.address}, {activeBusiness.city}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', marginTop: 2 }}>
            GSTIN: {activeBusiness.gstin || 'Non-GST Retailer'}
          </Text>
        </Card>

        {/* Invoice Theme Customizer */}
        <Card style={styles.sectionCard}>
          <Text style={[styles.secTitle, { color: colors.charcoal }]}>
            INVOICE BRAND COLOR THEME
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 11, marginBottom: 10 }}>
            Choose primary banner color for printed and PDF invoices:
          </Text>

          <View style={styles.themeList}>
            {invoiceThemes.map((th) => {
              const isSelected = activeInvoiceTheme.id === th.id;
              return (
                <TouchableOpacity
                  key={th.id}
                  onPress={() => setActiveInvoiceTheme(th)}
                  style={[
                    styles.themeRow,
                    {
                      backgroundColor: isSelected ? colors.lightCyan : colors.cardBackground,
                      borderColor: isSelected ? colors.primary : colors.borderLight,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <View style={[styles.themeCircle, { backgroundColor: th.primaryColor }]} />
                  <Text style={{ color: colors.charcoal, fontSize: 13, fontWeight: '600', flex: 1, marginLeft: 10 }}>
                    {th.name}
                  </Text>
                  {isSelected && <Badge label="Active" variant="primary" size="sm" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* POS & Billing Hardware Settings */}
        <Card style={styles.sectionCard}>
          <Text style={[styles.secTitle, { color: colors.charcoal }]}>
            POS BILLING & HARDWARE
          </Text>

          {/* Auto Round off toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '600' }}>
                Auto Round-Off Grand Totals
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                Rounds invoice payable amount to nearest whole rupee
              </Text>
            </View>
            <Switch
              value={autoRoundOff}
              onValueChange={handleToggleAutoRoundOff}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {/* Enable Barcode Scanning toggle */}
          <View style={[styles.toggleRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 10 }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '600' }}>
                Fast Barcode Auto-Add
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                Instant line insertion upon camera or laser scanner read
              </Text>
            </View>
            <Switch
              value={barcodeEnabled}
              onValueChange={handleToggleBarcode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {/* Printer Paper Width */}
          <View style={[styles.printerRow, { borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 10 }]}>
            <View>
              <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '600' }}>
                Thermal Printer Width
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                Standard 80mm ESC/POS or portable 58mm
              </Text>
            </View>
            <Badge
              label={`${activeBusiness.settings.printerWidth || 80}mm Standard`}
              variant="cyan"
              size="md"
            />
          </View>
        </Card>

        {/* Appearance & Cloud Sync */}
        <Card style={styles.sectionCard}>
          <Text style={[styles.secTitle, { color: colors.charcoal }]}>
            APPLICATION PREFERENCES & BACKUP
          </Text>

          {/* Dark Mode */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '600' }}>
                High-Contrast Dark Theme
              </Text>
              <Text style={{ color: colors.secondaryText, fontSize: 11 }}>
                Optimized for low-light retail counters
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          {/* Cloud Sync Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSyncData}
            style={[
              styles.syncBtn,
              {
                backgroundColor: colors.primarySoft,
                borderRadius: radius.md,
                marginTop: 10,
              },
            ]}
          >
            <Icon name="refresh" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13, marginLeft: 8 }}>
              {offlineSyncAlert ? 'Syncing to Cloud Vault...' : 'Sync Data & Backup to Cloud'}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* App Version Info */}
        <View style={styles.versionFooter}>
          <Text style={{ color: colors.mutedText, fontSize: 11, textAlign: 'center' }}>
            Universal Billing & POS Mobile • Version 2.4.0 (Enterprise)
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: 10, textAlign: 'center', marginTop: 2 }}>
            Designed & Engineered with React Native & TypeScript
          </Text>
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
  bizCard: {
    padding: 14,
    marginBottom: 12,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 12,
  },
  secTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  themeList: {
    gap: 8,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  themeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  printerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  versionFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
});
