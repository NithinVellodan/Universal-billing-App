import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Icon, IconName } from '../common/Icon';
import { Badge } from '../common/Badge';

interface BusinessSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BusinessSwitcherModal: React.FC<BusinessSwitcherModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, typography, radius, shadows, spacing } = useTheme();
  const { businesses, activeBusiness, switchBusiness, navigateTo } = useApp();

  const getIndustryIcon = (industry: string): IconName => {
    switch (industry) {
      case 'supermarket':
        return 'cart';
      case 'restaurant':
        return 'utensils';
      case 'pharmacy':
        return 'pill';
      case 'fashion':
        return 'tag';
      case 'wholesale':
        return 'truck';
      case 'services':
        return 'scissors';
      case 'electronics':
        return 'cpu';
      case 'jewellery':
        return 'gem';
      default:
        return 'building';
    }
  };

  const handleSelect = (id: string) => {
    switchBusiness(id);
    onClose();
  };

  const handleAddNewBusiness = () => {
    onClose();
    navigateTo('onboarding');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.backdrop, { backgroundColor: colors.backdrop }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderRadius: radius.xl,
                  ...shadows.lg,
                },
              ]}
            >
              {/* Modal Header */}
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.borderLight },
                ]}
              >
                <View>
                  <Text
                    style={[
                      styles.modalTitle,
                      {
                        color: colors.charcoal,
                        fontSize: typography.fontSizes.lg,
                        fontWeight: typography.fontWeights.bold,
                      },
                    ]}
                  >
                    Switch Business
                  </Text>
                  <Text
                    style={[
                      styles.modalSubtitle,
                      {
                        color: colors.secondaryText,
                        fontSize: typography.fontSizes.xs,
                      },
                    ]}
                  >
                    Select an active business entity or add a new branch
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeBtn,
                    { backgroundColor: colors.borderLight },
                  ]}
                >
                  <Icon name="close" size={18} color={colors.charcoal} />
                </TouchableOpacity>
              </View>

              {/* Business List */}
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
              >
                {businesses.map((biz) => {
                  const isSelected = biz.id === activeBusiness.id;
                  return (
                    <TouchableOpacity
                      key={biz.id}
                      activeOpacity={0.8}
                      onPress={() => handleSelect(biz.id)}
                      style={[
                        styles.bizItem,
                        {
                          backgroundColor: isSelected
                            ? colors.lightCyan
                            : colors.cardBackground,
                          borderColor: isSelected
                            ? colors.primary
                            : colors.borderLight,
                          borderRadius: radius.lg,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.iconWrapper,
                          {
                            backgroundColor: isSelected
                              ? colors.primary
                              : colors.borderLight,
                          },
                        ]}
                      >
                        <Icon
                          name={getIndustryIcon(biz.industry)}
                          size={20}
                          color={isSelected ? colors.white : colors.charcoal}
                        />
                      </View>

                      <View style={styles.bizDetails}>
                        <View style={styles.nameBadgeRow}>
                          <Text
                            style={[
                              styles.bizName,
                              {
                                color: colors.charcoal,
                                fontSize: typography.fontSizes.base,
                                fontWeight: typography.fontWeights.bold,
                              },
                            ]}
                          >
                            {biz.name}
                          </Text>
                          {isSelected && (
                            <View
                              style={[
                                styles.activePill,
                                { backgroundColor: colors.primary },
                              ]}
                            >
                              <Text style={styles.activePillText}>Active</Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.categoryLocRow}>
                          <Badge
                            label={biz.subcategory || biz.industry}
                            variant={isSelected ? 'primary' : 'neutral'}
                            size="sm"
                          />
                          <Text
                            style={[
                              styles.locText,
                              {
                                color: colors.secondaryText,
                                fontSize: typography.fontSizes.xs,
                                marginLeft: 8,
                              },
                            ]}
                          >
                            {biz.city} • GST: {biz.gstin ? 'Verified' : 'Non-GST'}
                          </Text>
                        </View>
                      </View>

                      {isSelected ? (
                        <View
                          style={[
                            styles.checkCircle,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Icon name="check" size={14} color={colors.white} />
                        </View>
                      ) : (
                        <Icon
                          name="chevron-right"
                          size={18}
                          color={colors.mutedText}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Add New Business / Onboarding Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAddNewBusiness}
                style={[
                  styles.addBizButton,
                  {
                    borderColor: colors.primary,
                    borderRadius: radius.md,
                    backgroundColor: colors.primarySoft,
                    marginTop: spacing.md,
                  },
                ]}
              >
                <Icon name="plus" size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.addBizText,
                    {
                      color: colors.primary,
                      fontSize: typography.fontSizes.base,
                      fontWeight: typography.fontWeights.semiBold,
                      marginLeft: 8,
                    },
                  ]}
                >
                  Register New Business Category
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalTitle: {
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginTop: 12,
  },
  bizItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bizDetails: {
    flex: 1,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bizName: {
    flexShrink: 1,
  },
  activePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activePillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  categoryLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locText: {},
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  addBizText: {},
});
