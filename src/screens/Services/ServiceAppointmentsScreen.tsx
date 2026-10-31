import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { useTheme } from '../../theme';
import { useApp } from '../../store/AppContext';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ServiceAppointment } from '../../types';

export const ServiceAppointmentsScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    activeBusinessProducts,
    addToCart,
    setActiveTab,
    goBack,
  } = useApp();

  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [staffName, setStaffName] = useState('Senior Stylist');
  const [slotTime, setSlotTime] = useState('02:00 PM');
  const [price, setPrice] = useState('1800');

  const handleCreateBooking = () => {
    if (!custName || !serviceName) return;
    const newApt: ServiceAppointment = {
      id: `apt_${Date.now()}`,
      customerName: custName,
      customerPhone: custPhone || '+91 98470 11223',
      serviceName,
      staffName,
      date: 'Today',
      time: slotTime,
      durationMinutes: 60,
      price: parseFloat(price) || 1800,
      status: 'SCHEDULED',
    };
    addAppointment(newApt);
    setBookingModalOpen(false);
    setCustName('');
    setCustPhone('');
  };

  const handleBillAppointment = (apt: ServiceAppointment) => {
    const matchProd = activeBusinessProducts.find(
      (p) => p.name.toLowerCase().includes(apt.serviceName.toLowerCase())
    );
    if (matchProd) {
      addToCart(matchProd, 1);
    }
    updateAppointmentStatus(apt.id, 'COMPLETED');
    setActiveTab('billing');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.lightBackground }]}>
      <Header
        showBack
        title="Service Appointments"
        subtitle="Manage slots, staff scheduling & client bills"
        onBackPress={goBack}
        rightAction={
          <TouchableOpacity
            onPress={() => setBookingModalOpen(true)}
            style={[styles.addSlotBtn, { backgroundColor: colors.primary }]}
          >
            <Icon name="plus" size={14} color={colors.white} />
            <Text style={{ color: colors.white, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
              Book
            </Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]}
      >
        <View style={styles.aptsList}>
          {appointments.map((apt) => (
            <Card key={apt.id} style={styles.aptCard}>
              <View style={styles.aptHeaderRow}>
                <View style={styles.timeBadgeContainer}>
                  <Text style={[styles.timeText, { color: colors.primary }]}>
                    {apt.time}
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 10 }}>
                    {apt.durationMinutes} mins
                  </Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '700' }}>
                    {apt.customerName}
                  </Text>
                  <Text style={{ color: colors.secondaryText, fontSize: 12, marginTop: 1 }}>
                    {apt.customerPhone}
                  </Text>
                  <Text style={{ color: colors.charcoal, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
                    {apt.serviceName}
                  </Text>
                  <Text style={{ color: colors.mutedText, fontSize: 11, marginTop: 1 }}>
                    Staff: {apt.staffName}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Badge
                    label={apt.status}
                    variant={apt.status === 'COMPLETED' ? 'success' : 'primary'}
                    size="sm"
                  />
                  <Text style={{ color: colors.charcoal, fontSize: 15, fontWeight: '800', marginTop: 8 }}>
                    ₹{apt.price}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View
                style={[
                  styles.aptActionsRow,
                  {
                    borderTopColor: colors.borderLight,
                    paddingTop: 10,
                    marginTop: 10,
                  },
                ]}
              >
                {apt.status === 'SCHEDULED' && (
                  <TouchableOpacity
                    onPress={() => updateAppointmentStatus(apt.id, 'IN_PROGRESS')}
                    style={[styles.statusBtn, { backgroundColor: colors.lightCyan }]}
                  >
                    <Text style={{ color: colors.charcoal, fontSize: 11, fontWeight: '700' }}>
                      Start Session ▶
                    </Text>
                  </TouchableOpacity>
                )}

                {apt.status !== 'COMPLETED' && (
                  <TouchableOpacity
                    onPress={() => handleBillAppointment(apt)}
                    style={[styles.statusBtn, { backgroundColor: colors.primarySoft }]}
                  >
                    <Icon name="billing" size={14} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', marginLeft: 4 }}>
                      Generate Bill & Pay →
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      {/* New Booking Modal */}
      {bookingModalOpen && (
        <Modal visible={bookingModalOpen} transparent animationType="fade">
          <View style={[styles.modalBackdrop, { backgroundColor: colors.backdrop }]}>
            <View style={[styles.bookingCard, { backgroundColor: colors.cardBackground, borderRadius: radius.xl }]}>
              <View style={styles.modalHeader}>
                <Text style={{ color: colors.charcoal, fontSize: 16, fontWeight: '800' }}>
                  Book New Appointment
                </Text>
                <TouchableOpacity onPress={() => setBookingModalOpen(false)}>
                  <Icon name="close" size={18} color={colors.charcoal} />
                </TouchableOpacity>
              </View>

              <View style={{ gap: 10, marginVertical: 12 }}>
                <TextInput
                  placeholder="Customer Name"
                  value={custName}
                  onChangeText={setCustName}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { borderColor: colors.border, color: colors.charcoal }]}
                />
                <TextInput
                  placeholder="Customer Phone"
                  value={custPhone}
                  onChangeText={setCustPhone}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { borderColor: colors.border, color: colors.charcoal }]}
                />
                <TextInput
                  placeholder="Service Name (e.g. Hair Spa, Facial)"
                  value={serviceName}
                  onChangeText={setServiceName}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { borderColor: colors.border, color: colors.charcoal }]}
                />
                <TextInput
                  placeholder="Staff / Stylist Name"
                  value={staffName}
                  onChangeText={setStaffName}
                  placeholderTextColor={colors.mutedText}
                  style={[styles.input, { borderColor: colors.border, color: colors.charcoal }]}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput
                    placeholder="Slot Time"
                    value={slotTime}
                    onChangeText={setSlotTime}
                    placeholderTextColor={colors.mutedText}
                    style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.charcoal }]}
                  />
                  <TextInput
                    placeholder="Price (₹)"
                    value={price}
                    onChangeText={setPrice}
                    placeholderTextColor={colors.mutedText}
                    style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.charcoal }]}
                  />
                </View>
              </View>

              <Button title="Confirm Appointment" variant="primary" onPress={handleCreateBooking} fullWidth />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  addSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  aptsList: {
    gap: 12,
  },
  aptCard: {
    padding: 14,
  },
  aptHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timeBadgeContainer: {
    alignItems: 'center',
    width: 65,
    backgroundColor: '#FFEAEB',
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  aptActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
  },
  statusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bookingCard: {
    width: '100%',
    padding: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});
