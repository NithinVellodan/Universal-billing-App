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
import { ExpenseRecord, PaymentMethod } from '../../types';

export const AddExpenseScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const { activeBusiness, addExpense, goBack } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('Utilities');
  const [amount, setAmount] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');

  const categories: ExpenseRecord['category'][] = [
    'Rent',
    'Salaries',
    'Utilities',
    'Supplies',
    'Marketing',
    'Maintenance',
    'Miscellaneous',
  ];

  const payMethods: PaymentMethod[] = ['UPI', 'CASH', 'BANK_TRANSFER'];

  const handleSave = () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert('Validation Error', 'Title and amount are required.');
      return;
    }

    const newExp: ExpenseRecord = {
      id: `exp_${Date.now()}`,
      businessId: activeBusiness.id,
      title: title.trim(),
      category,
      amount: parseFloat(amount) || 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      paidTo: paidTo.trim() || 'Vendor',
      notes: notes.trim() || undefined,
    };

    addExpense(newExp);
    Alert.alert('Success', `Expense of ₹${newExp.amount} recorded.`, [
      { text: 'OK', onPress: goBack },
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Record Expense"
        subtitle="Log operational outgoing cash or bank transfer"
        onBackPress={goBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        <Card style={styles.formCard}>
          <Input
            label="Expense Description / Title *"
            placeholder="e.g. Electricity bill, Staff lunch, Sanitizer refill"
            value={title}
            onChangeText={setTitle}
          />

          <Input
            label="Amount (₹) *"
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {/* Category Selector */}
          <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
            Category
          </Text>
          <View style={styles.catGrid}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: category === c ? colors.primary : colors.cardBackground,
                    borderColor: category === c ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: category === c ? colors.white : colors.charcoal,
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Paid To (Vendor / Person)"
            placeholder="e.g. KSEB, Cleaning Agency, Landlord"
            value={paidTo}
            onChangeText={setPaidTo}
            containerStyle={{ marginTop: 12 }}
          />

          {/* Payment Method Selector */}
          <Text style={{ color: colors.charcoal, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
            Payment Method
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            {payMethods.map((pm) => (
              <TouchableOpacity
                key={pm}
                onPress={() => setPaymentMethod(pm)}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: paymentMethod === pm ? colors.primary : colors.cardBackground,
                    borderColor: paymentMethod === pm ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Text
                  style={{
                    color: paymentMethod === pm ? colors.white : colors.charcoal,
                    fontSize: 11,
                    fontWeight: '700',
                  }}
                >
                  {pm}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Additional Notes / Invoice Ref"
            placeholder="Ref # or meter number"
            value={notes}
            onChangeText={setNotes}
          />

          <Button
            title="Record & Deduct Expense"
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
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
});
