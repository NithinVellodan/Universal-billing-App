import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Customer } from '../../types';

export const AddEditCustomerScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const { activeBusiness, addCustomer, goBack } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Customer name is required');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Customer phone number is required');
      return;
    }

    const newCust: Customer = {
      id: `cust_${Date.now()}`,
      businessId: activeBusiness.id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      gstin: gstin.trim() || undefined,
      billingAddress: billingAddress.trim() || `${activeBusiness.city}, Kerala`,
      outstandingBalance: 0,
      loyaltyPoints: 50, // Welcome bonus points
      totalOrdersCount: 0,
      totalSpent: 0,
    };

    addCustomer(newCust);
    Alert.alert('Success', `Customer ${newCust.name} added successfully!`, [
      { text: 'OK', onPress: goBack },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Register New Customer"
        subtitle="Add customer contact, GST & ledger info"
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
            CUSTOMER PARTICULARS
          </Text>

          <Input
            label="Full Name *"
            placeholder="e.g. Ramesh Kumar, Priya Menon"
            value={name}
            onChangeText={setName}
          />

          <Input
            label="Mobile Number *"
            placeholder="+91 98470 12345"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Input
            label="Email Address"
            placeholder="client@gmail.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="GSTIN (For B2B Tax Invoicing)"
            placeholder="32AAAAA0000A1Z5"
            autoCapitalize="characters"
            value={gstin}
            onChangeText={setGstin}
          />

          <Input
            label="Billing & Delivery Address"
            placeholder="Door / Flat No, Street, Locality, Pincode"
            multiline
            numberOfLines={3}
            value={billingAddress}
            onChangeText={setBillingAddress}
          />

          <Button
            title="Save & Register Customer"
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
});
