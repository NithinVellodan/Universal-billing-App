import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { useApp } from '../store/AppContext';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

// Main Tab Screens
import { DashboardScreen } from '../screens/Dashboard/DashboardScreen';
import { BillingScreen } from '../screens/Billing/BillingScreen';
import { InvoicesListScreen } from '../screens/Invoices/InvoicesListScreen';
import { ReportsScreen } from '../screens/Reports/ReportsScreen';
import { MoreScreen } from '../screens/More/MoreScreen';

// Sub-Screens & Modules
import { InvoicePreviewScreen } from '../screens/Invoices/InvoicePreviewScreen';
import { ProductManagementScreen } from '../screens/Products/ProductManagementScreen';
import { AddEditProductScreen } from '../screens/Products/AddEditProductScreen';
import { CustomerManagementScreen } from '../screens/Customers/CustomerManagementScreen';
import { AddEditCustomerScreen } from '../screens/Customers/AddEditCustomerScreen';
import { RestaurantTablesScreen } from '../screens/Restaurant/RestaurantTablesScreen';
import { RestaurantKdsScreen } from '../screens/Restaurant/RestaurantKdsScreen';
import { PharmacyBatchesScreen } from '../screens/Pharmacy/PharmacyBatchesScreen';
import { ServiceAppointmentsScreen } from '../screens/Services/ServiceAppointmentsScreen';
import { BarcodeScannerScreen } from '../screens/Barcode/BarcodeScannerScreen';
import { ExpenseManagerScreen } from '../screens/Expenses/ExpenseManagerScreen';
import { AddExpenseScreen } from '../screens/Expenses/AddExpenseScreen';
import { PurchaseManagerScreen } from '../screens/Purchases/PurchaseManagerScreen';
import { StaffManagerScreen } from '../screens/Staff/StaffManagerScreen';
import { BranchManagerScreen } from '../screens/Branches/BranchManagerScreen';
import { OnboardingScreen } from '../screens/Onboarding/OnboardingScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { NotificationsScreen } from '../screens/Notifications/NotificationsScreen';

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { activeScreen } = useApp();

  const isMainTab =
    activeScreen === 'tab_home' ||
    activeScreen === 'tab_billing' ||
    activeScreen === 'tab_invoices' ||
    activeScreen === 'tab_reports' ||
    activeScreen === 'tab_more';

  const renderScreen = () => {
    switch (activeScreen) {
      case 'tab_home':
        return <DashboardScreen />;
      case 'tab_billing':
        return <BillingScreen />;
      case 'tab_invoices':
        return <InvoicesListScreen />;
      case 'tab_reports':
        return <ReportsScreen />;
      case 'tab_more':
        return <MoreScreen />;

      // Invoice Preview
      case 'invoice_preview':
        return <InvoicePreviewScreen />;

      // Catalog & Inventory
      case 'product_management':
        return <ProductManagementScreen />;
      case 'add_edit_product':
        return <AddEditProductScreen />;

      // Customers
      case 'customer_management':
        return <CustomerManagementScreen />;
      case 'add_edit_customer':
        return <AddEditCustomerScreen />;

      // Industry Modules
      case 'restaurant_tables':
        return <RestaurantTablesScreen />;
      case 'restaurant_kds':
        return <RestaurantKdsScreen />;
      case 'pharmacy_batches':
        return <PharmacyBatchesScreen />;
      case 'service_appointments':
        return <ServiceAppointmentsScreen />;
      case 'barcode_scanner':
        return <BarcodeScannerScreen />;

      // Finance & Operations
      case 'expense_manager':
        return <ExpenseManagerScreen />;
      case 'add_expense':
        return <AddExpenseScreen />;
      case 'purchase_manager':
        return <PurchaseManagerScreen />;
      case 'staff_manager':
        return <StaffManagerScreen />;
      case 'branch_manager':
        return <BranchManagerScreen />;

      // Platform
      case 'onboarding':
        return <OnboardingScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'notifications':
        return <NotificationsScreen />;

      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={[styles.rootContainer, { backgroundColor: colors.lightBackground }]}>
      <View style={styles.screenWrapper}>{renderScreen()}</View>
      {isMainTab && <BottomNavBar />}
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
  },
});
