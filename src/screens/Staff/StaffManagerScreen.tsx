import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const StaffManagerScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { employees, goBack } = useApp();

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Staff & Role Permissions"
        subtitle="Configure cashier, kitchen, and manager roles"
        onBackPress={goBack}
      />

      <FlatList
        data={employees}
        keyExtractor={(e) => e.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => (
          <Card style={styles.employeeCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 14 }}>
                  {item.name.slice(0, 2).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '700' }}>
                    {item.name}
                  </Text>
                  <Badge
                    label={item.role}
                    variant={item.role === 'ADMIN' ? 'primary' : 'cyan'}
                    size="sm"
                  />
                </View>

                <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 2 }}>
                  {item.phone} • {item.email}
                </Text>

                <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                  {item.permissions.map((p, idx) => (
                    <Badge key={idx} label={p} variant="neutral" size="sm" />
                  ))}
                </View>
              </View>

              <Badge
                label={item.active ? 'ACTIVE' : 'INACTIVE'}
                variant={item.active ? 'success' : 'neutral'}
                size="sm"
              />
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
  listContent: {
    gap: 12,
    paddingBottom: 40,
  },
  employeeCard: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
