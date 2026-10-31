import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../../theme';
import { Card } from '../common/Card';

interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

const DAILY_DATA: DataPoint[] = [
  { label: '09 AM', value: 4200 },
  { label: '11 AM', value: 8900 },
  { label: '01 PM', value: 14200 },
  { label: '03 PM', value: 9800 },
  { label: '05 PM', value: 18500 },
  { label: '07 PM', value: 24600 },
  { label: '09 PM', value: 16100 },
];

const WEEKLY_DATA: DataPoint[] = [
  { label: 'Mon', value: 38200 },
  { label: 'Tue', value: 44500 },
  { label: 'Wed', value: 52100 },
  { label: 'Thu', value: 48900 },
  { label: 'Fri', value: 71200 },
  { label: 'Sat', value: 92400 },
  { label: 'Sun', value: 86500 },
];

const MONTHLY_DATA: DataPoint[] = [
  { label: 'May', value: 184000 },
  { label: 'Jun', value: 215000 },
  { label: 'Jul', value: 242000 },
  { label: 'Aug', value: 228000 },
  { label: 'Sep', value: 285000 },
  { label: 'Oct', value: 320000 },
];

export const AnalyticsChart: React.FC = () => {
  const { colors, typography, radius, spacing } = useTheme();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const getData = () => {
    switch (period) {
      case 'daily':
        return DAILY_DATA;
      case 'monthly':
        return MONTHLY_DATA;
      case 'weekly':
      default:
        return WEEKLY_DATA;
    }
  };

  const data = getData();
  const maxValue = Math.max(...data.map((d) => d.value));

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - 64, 420);
  const chartHeight = 150;
  const barWidth = Math.max(14, (chartWidth / data.length) - 16);

  const totalPeriodRevenue = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card style={styles.card}>
      {/* Header & Filter Row */}
      <View style={styles.headerRow}>
        <View>
          <Text
            style={[
              styles.heading,
              {
                color: colors.charcoal,
                fontSize: typography.fontSizes.md,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            Sales Overview
          </Text>
          <Text
            style={[
              styles.totalAmount,
              {
                color: colors.primary,
                fontSize: typography.fontSizes.xl,
                fontWeight: typography.fontWeights.extraBold,
              },
            ]}
          >
            ₹{totalPeriodRevenue.toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Period Selector Tabs */}
        <View
          style={[
            styles.tabFilterGroup,
            {
              backgroundColor: colors.borderLight,
              borderRadius: radius.md,
            },
          ]}
        >
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => {
            const isSelected = period === tab;
            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.7}
                onPress={() => setPeriod(tab)}
                style={[
                  styles.filterTab,
                  isSelected && {
                    backgroundColor: colors.cardBackground,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color: isSelected ? colors.primary : colors.secondaryText,
                      fontSize: typography.fontSizes.xxs,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {tab.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* SVG Bar Chart */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Subtle grid lines */}
          <Line
            x1="0"
            y1={chartHeight - 30}
            x2={chartWidth}
            y2={chartHeight - 30}
            stroke={colors.border}
            strokeDasharray="4, 4"
            strokeWidth="1"
          />
          <Line
            x1="0"
            y1={chartHeight / 2 - 10}
            x2={chartWidth}
            y2={chartHeight / 2 - 10}
            stroke={colors.borderLight}
            strokeDasharray="4, 4"
            strokeWidth="1"
          />

          {data.map((item, index) => {
            const availableHeight = chartHeight - 45;
            const barHeight = Math.max(8, (item.value / maxValue) * availableHeight);
            const slotWidth = chartWidth / data.length;
            const x = index * slotWidth + (slotWidth - barWidth) / 2;
            const y = chartHeight - 30 - barHeight;
            const isHighest = item.value === maxValue;

            return (
              <React.Fragment key={item.label}>
                {/* Background Track */}
                <Rect
                  x={x}
                  y={10}
                  width={barWidth}
                  height={availableHeight}
                  fill={colors.borderLight}
                  rx={barWidth / 2}
                />
                {/* Active Bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isHighest ? colors.primary : colors.charcoalLight}
                  rx={barWidth / 2}
                />
                {/* X-Axis Label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight - 12}
                  fontSize="10"
                  fill={isHighest ? colors.primary : colors.secondaryText}
                  fontWeight={isHighest ? '700' : '400'}
                  textAnchor="middle"
                >
                  {item.label}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Payment Method Distribution Breakdown */}
      <View
        style={[
          styles.breakdownRow,
          {
            borderTopColor: colors.borderLight,
            paddingTop: spacing.sm,
            marginTop: spacing.xs,
          },
        ]}
      >
        <View style={styles.methodPill}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.methodLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
            UPI (62%)
          </Text>
        </View>

        <View style={styles.methodPill}>
          <View style={[styles.dot, { backgroundColor: colors.charcoal }]} />
          <Text style={[styles.methodLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
            Cash (24%)
          </Text>
        </View>

        <View style={styles.methodPill}>
          <View style={[styles.dot, { backgroundColor: colors.orangeAccent }]} />
          <Text style={[styles.methodLabel, { color: colors.secondaryText, fontSize: typography.fontSizes.xs }]}>
            Card (14%)
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  heading: {
    letterSpacing: -0.2,
  },
  totalAmount: {
    marginTop: 2,
    letterSpacing: -0.5,
  },
  tabFilterGroup: {
    flexDirection: 'row',
    padding: 3,
  },
  filterTab: {
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  filterTabText: {},
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
  },
  methodPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  methodLabel: {},
});
