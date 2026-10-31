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
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const BranchManagerScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { branches, goBack } = useApp();

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Multi-Branch Management"
        subtitle="Manage store outlets and warehouse locations"
        onBackPress={goBack}
      />

      <FlatList
        data={branches}
        keyExtractor={(b) => b.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => (
          <Card style={styles.branchCard}>
            <View style={styles.cardTop}>
              <View style={[styles.branchIcon, { backgroundColor: colors.lightCyan }]}>
                <Icon name="building" size={20} color={colors.primary} />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '700' }}>
                    {item.name}
                  </Text>
                  {item.isMain && (
                    <Badge label="HEAD OFFICE" variant="primary" size="sm" />
                  )}
                </View>

                <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 2 }}>
                  Code: {item.code} • {item.city}
                </Text>
                <Text style={{ color: colors.mutedText, fontSize: 11, marginTop: 1 }}>
                  {item.address}
                </Text>
                <Text style={{ color: colors.secondaryText, fontSize: 11, marginTop: 2 }}>
                  Phone: {item.phone}
                </Text>
              </View>

              <Badge
                label={item.active ? 'ACTIVE' : 'OFFLINE'}
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
  branchCard: {
    padding: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  branchIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
