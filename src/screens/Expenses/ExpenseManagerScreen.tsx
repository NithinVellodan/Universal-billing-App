import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const ExpenseManagerScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { activeBusinessExpenses, activeBusiness, navigateTo, goBack } = useApp();

  const totalExpense = activeBusinessExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Expense Tracking"
        subtitle="Operational overheads & vendor payouts"
        onBackPress={goBack}
        rightAction={
          <TouchableOpacity
            onPress={() => navigateTo('add_expense')}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Icon name="plus" size={14} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
              Record
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Total Overhead Metric Card */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Card variant="outlined" style={[styles.summaryCard, { borderColor: colors.error }]}>
          <Text style={{ color: colors.secondaryText, fontSize: 11, textTransform: 'uppercase' }}>
            TOTAL RECORDED STORE OVERHEADS
          </Text>
          <Text style={{ color: colors.error, fontSize: 24, fontWeight: '900', marginTop: 4 }}>
            {activeBusiness.currencySymbol}{totalExpense.toLocaleString('en-IN')}
          </Text>
          <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 4 }}>
            Deducted automatically from Net Profit in reports
          </Text>
        </Card>
      </View>

      <FlatList
        data={activeBusinessExpenses}
        keyExtractor={(e) => e.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => (
          <Card style={styles.expenseCard}>
            <View style={styles.expRow}>
              <View
                style={[
                  styles.expIconCircle,
                  { backgroundColor: colors.warningSoft },
                ]}
              >
                <Icon name="expense" size={18} color={colors.warning} />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
                  Paid to: {item.paidTo} • {item.date}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                  <Badge label={item.category} variant="neutral" size="sm" />
                  <Badge label={item.paymentMethod} variant="cyan" size="sm" />
                </View>
              </View>

              <Text style={{ color: colors.error, fontSize: 16, fontWeight: '800' }}>
                -{activeBusiness.currencySymbol}{item.amount.toLocaleString('en-IN')}
              </Text>
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
  summaryCard: {
    padding: 16,
  },
  listContent: {
    gap: 10,
    paddingBottom: 40,
  },
  expenseCard: {
    padding: 12,
  },
  expRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
