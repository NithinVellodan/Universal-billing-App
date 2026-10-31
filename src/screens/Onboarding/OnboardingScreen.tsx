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
import { Icon, IconName } from '../../components/common/Icon';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { BusinessIndustry, BusinessConfig } from '../../types';

export const OnboardingScreen: React.FC = () => {
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const { addBusiness, goBack } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedIndustry, setSelectedIndustry] = useState<BusinessIndustry>('supermarket');
  const [businessName, setBusinessName] = useState('');
  const [tagline, setTagline] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Kochi');
  const [phone, setPhone] = useState('+91 98470 00000');
  const [email, setEmail] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('INV-2026-');
  const [printerWidth, setPrinterWidth] = useState<58 | 80>(80);

  const industryCategories: {
    id: BusinessIndustry;
    name: string;
    description: string;
    icon: IconName;
    color: string;
  }[] = [
    {
      id: 'supermarket',
      name: 'Supermarket / Hypermarket',
      description: 'Barcode POS, FMCG, bulk products & weighing scale',
      icon: 'cart',
      color: '#16A36A',
    },
    {
      id: 'restaurant',
      name: 'Restaurant / Cafe / Hotel',
      description: 'Tables floor plan, KOT tickets, Kitchen display & Dine-in',
      icon: 'utensils',
      color: '#EA580C',
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy / Medical Store',
      description: 'Medicines, batch numbers, expiry dates & Schedule H',
      icon: 'pill',
      color: '#2563EB',
    },
    {
      id: 'fashion',
      name: 'Fashion / Textile Store',
      description: 'Sizes (XS-XXL), color variants, barcodes & exchanges',
      icon: 'tag',
      color: '#9333EA',
    },
    {
      id: 'wholesale',
      name: 'Wholesale & Distribution',
      description: 'B2B bulk pricing, credit ledgers, purchase orders',
      icon: 'truck',
      color: '#D97706',
    },
    {
      id: 'services',
      name: 'Salon, Spa & Services',
      description: 'Appointments, staff assignments, session durations',
      icon: 'scissors',
      color: '#EC4899',
    },
    {
      id: 'electronics',
      name: 'Electronics & Mobiles',
      description: 'Serial numbers, IMEI tracking, warranty & repair logs',
      icon: 'cpu',
      color: '#0D9488',
    },
    {
      id: 'jewellery',
      name: 'Jewellery & Gold Retail',
      description: 'Karat purity (22K/24K), gram weights, hallmark, making charges',
      icon: 'gem',
      color: '#B45309',
    },
  ];

  const handleFinishOnboarding = () => {
    if (!businessName.trim()) {
      Alert.alert('Required Field', 'Please provide a registered business name.');
      return;
    }

    const newBiz: BusinessConfig = {
      id: `biz_${Date.now()}`,
      name: businessName.trim(),
      tagline: tagline.trim() || undefined,
      industry: selectedIndustry,
      subcategory: `${selectedIndustry.toUpperCase()} Retail`,
      gstin: gstin.trim() || undefined,
      address: address.trim() || 'Central Commercial Plaza',
      city: city.trim() || 'Kochi',
      state: 'Kerala',
      pincode: '682016',
      phone: phone.trim(),
      email: email.trim() || 'contact@business.com',
      currencySymbol: '₹',
      currencyCode: 'INR',
      invoicePrefix: invoicePrefix.trim() || 'INV-2026-',
      invoiceNumberSeq: 100,
      taxType: gstin.trim() ? 'GST' : 'NON_GST',
      upiId: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}@okaxis`,
      bankDetails: {
        accountName: businessName.trim(),
        accountNumber: '921020088991245',
        ifsc: 'UTIB0001423',
        bankName: 'Axis Bank Ltd',
        branch: `${city} Branch`,
      },
      terms: [
        'Goods once sold cannot be returned without original cash bill.',
        'All disputes are subject to local jurisdiction.',
      ],
      settings: {
        enableBarcode: true,
        enableTableManagement: selectedIndustry === 'restaurant',
        enableBatchTracking: selectedIndustry === 'pharmacy',
        enableVariants: selectedIndustry === 'fashion',
        enableAppointments: selectedIndustry === 'services',
        enableSerialTracking: selectedIndustry === 'electronics',
        enableJewelleryKarat: selectedIndustry === 'jewellery',
        printerWidth,
        autoRoundOff: true,
        defaultTaxRate: 5,
      },
    };

    addBusiness(newBiz);
    Alert.alert(
      'Onboarding Complete! 🎉',
      `Welcome to Universal Billing POS! Your business "${newBiz.name}" is now live and active.`,
      [{ text: 'Start Billing', onPress: goBack }]
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Business Setup & Category"
        subtitle={`Step ${step} of 2 • Universal POS Onboarding`}
        onBackPress={goBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        {/* Step 1: Select Industry Category Cards */}
        {step === 1 && (
          <View>
            <Text
              style={[
                styles.stepTitle,
                {
                  color: colors.charcoal,
                  fontSize: typography.fontSizes.md,
                  fontWeight: typography.fontWeights.bold,
                  marginBottom: 4,
                },
              ]}
            >
              Select Your Business Industry
            </Text>
            <Text
              style={[
                styles.stepSubtitle,
                {
                  color: colors.secondaryText,
                  fontSize: typography.fontSizes.xs,
                  marginBottom: 16,
                },
              ]}
            >
              The application workflow and dashboard will dynamically adapt to this choice.
            </Text>

            <View style={styles.industryCardsGrid}>
              {industryCategories.map((cat) => {
                const isSelected = selectedIndustry === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    activeOpacity={0.8}
                    onPress={() => setSelectedIndustry(cat.id)}
                    style={[
                      styles.industryCard,
                      {
                        backgroundColor: isSelected ? colors.lightCyan : colors.cardBackground,
                        borderColor: isSelected ? colors.primary : colors.borderLight,
                        borderWidth: isSelected ? 2 : 1,
                        borderRadius: radius.xl,
                        ...shadows.sm,
                      },
                    ]}
                  >
                    <View style={[styles.iconSquare, { backgroundColor: cat.color }]}>
                      <Icon name={cat.icon} size={22} color="#FFFFFF" />
                    </View>

                    <Text
                      style={[
                        styles.catName,
                        {
                          color: colors.charcoal,
                          fontSize: typography.fontSizes.sm,
                          fontWeight: typography.fontWeights.bold,
                          marginTop: 10,
                        },
                      ]}
                    >
                      {cat.name}
                    </Text>

                    <Text
                      style={[
                        styles.catDesc,
                        {
                          color: colors.secondaryText,
                          fontSize: typography.fontSizes.xxs,
                          marginTop: 4,
                        },
                      ]}
                    >
                      {cat.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Next: Configure Business Details →"
              variant="primary"
              size="lg"
              onPress={() => setStep(2)}
              style={{ marginTop: 20 }}
              fullWidth
            />
          </View>
        )}

        {/* Step 2: Configure Business Particulars */}
        {step === 2 && (
          <Card style={styles.formCard}>
            <Text
              style={[
                styles.stepTitle,
                {
                  color: colors.charcoal,
                  fontSize: typography.fontSizes.md,
                  fontWeight: typography.fontWeights.bold,
                  marginBottom: 12,
                },
              ]}
            >
              Business Particulars & Invoice Setup
            </Text>

            <Input
              label="Business Trade Name *"
              placeholder="e.g. Royal Fresh Supermarket, Taj Bistro"
              value={businessName}
              onChangeText={setBusinessName}
            />

            <Input
              label="Tagline / Slogan"
              placeholder="e.g. Quality Groceries at Low Prices"
              value={tagline}
              onChangeText={setTagline}
            />

            <Input
              label="GSTIN Number (Optional for Non-GST)"
              placeholder="32AABCG1234F1Z9"
              autoCapitalize="characters"
              value={gstin}
              onChangeText={setGstin}
            />

            <Input
              label="Store Address & Street"
              placeholder="Shop No. 4, Commercial Complex, MG Road"
              value={address}
              onChangeText={setAddress}
            />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Input
                  label="City"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            <Input
              label="Business Email"
              placeholder="billing@business.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Input
              label="Invoice Number Prefix"
              placeholder="e.g. GM-2026-"
              value={invoicePrefix}
              onChangeText={setInvoicePrefix}
            />

            {/* Thermal Printer Width */}
            <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              Default Thermal Printer Paper Size
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              {[80, 58].map((w) => (
                <TouchableOpacity
                  key={w}
                  onPress={() => setPrinterWidth(w as any)}
                  style={[
                    styles.printerPill,
                    {
                      backgroundColor: printerWidth === w ? colors.primary : colors.cardBackground,
                      borderColor: printerWidth === w ? colors.primary : colors.border,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: printerWidth === w ? colors.white : colors.charcoal,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {w}mm (POS Standard)
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button
                title="← Back"
                variant="outline"
                onPress={() => setStep(1)}
                style={{ flex: 1 }}
              />
              <Button
                title="Complete Setup ✓"
                variant="primary"
                onPress={handleFinishOnboarding}
                style={{ flex: 2 }}
              />
            </View>
          </Card>
        )}
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
  stepTitle: {},
  stepSubtitle: {},
  industryCardsGrid: {
    gap: 12,
  },
  industryCard: {
    padding: 16,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catName: {},
  catDesc: {},
  formCard: {
    padding: 18,
  },
  printerPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
});
