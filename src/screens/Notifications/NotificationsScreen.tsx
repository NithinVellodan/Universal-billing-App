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
import { Card } from '../../components/common/Card';

export const NotificationsScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { notifications, markNotificationRead, goBack } = useApp();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return { name: 'receipt' as const, color: colors.primary, bg: colors.primarySoft };
      case 'STOCK':
        return { name: 'alert-circle' as const, color: colors.warning, bg: colors.warningSoft };
      case 'EXPIRY':
        return { name: 'pill' as const, color: colors.error, bg: colors.errorSoft };
      default:
        return { name: 'bell' as const, color: colors.info, bg: colors.infoSoft };
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Activity Notifications"
        subtitle="Sales, inventory alerts & synchronization logs"
        onBackPress={goBack}
      />

      <FlatList
        data={notifications}
        keyExtractor={(n) => n.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.listContent, { padding: spacing.lg }]}
        renderItem={({ item }) => {
          const iconConf = getNotifIcon(item.type);

          return (
            <Card
              style={[
                styles.notifCard,
                {
                  backgroundColor: item.read
                    ? colors.cardBackground
                    : colors.lightCyan,
                  borderColor: item.read ? colors.borderLight : colors.lightCyanBorder,
                },
              ]}
              onPress={() => markNotificationRead(item.id)}
            >
              <View style={styles.notifRow}>
                <View style={[styles.notifIcon, { backgroundColor: iconConf.bg }]}>
                  <Icon name={iconConf.name} size={18} color={iconConf.color} />
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: colors.charcoal, fontSize: 14, fontWeight: '700' }}>
                      {item.title}
                    </Text>
                    <Text style={{ color: colors.mutedText, fontSize: 10 }}>
                      {item.timestamp}
                    </Text>
                  </View>

                  <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 3 }}>
                    {item.message}
                  </Text>
                </View>
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  listContent: {
    gap: 10,
    paddingBottom: 40,
  },
  notifCard: {
    padding: 12,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
