export type BusinessIndustry =
  | 'supermarket'
  | 'restaurant'
  | 'pharmacy'
  | 'fashion'
  | 'wholesale'
  | 'services'
  | 'electronics'
  | 'jewellery';

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  branch: string;
}

export interface BusinessConfig {
  id: string;
  name: string;
  tagline?: string;
  industry: BusinessIndustry;
  subcategory: string;
  gstin?: string;
  pan?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  currencySymbol: string;
  currencyCode: string;
  logoUrl?: string;
  invoicePrefix: string;
  invoiceNumberSeq: number;
  taxType: 'GST' | 'NON_GST' | 'COMPOSITION';
  upiId?: string;
  bankDetails: BankDetails;
  terms: string[];
  settings: {
    enableBarcode: boolean;
    enableTableManagement: boolean;
    enableBatchTracking: boolean;
    enableVariants: boolean;
    enableAppointments: boolean;
    enableSerialTracking: boolean;
    enableJewelleryKarat: boolean;
    printerWidth: 58 | 80;
    autoRoundOff: boolean;
    defaultTaxRate: number;
  };
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size: L, Color: Navy"
  sku: string;
  additionalPrice: number;
  stock: number;
  barcode?: string;
}

export interface ProductBatch {
  id: string;
  batchNo: string;
  mfgDate: string;
  expiryDate: string;
  purchasePrice: number;
  mrp: number;
  sellingPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  subcategory?: string;
  brand?: string;
  unit: 'pcs' | 'kg' | 'g' | 'ltr' | 'box' | 'meter' | 'service';
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  stock: number;
  minStockAlert: number;
  taxRate: number; // percentage e.g. 5, 12, 18, 28
  hsnCode?: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  industry: BusinessIndustry;
  variants?: ProductVariant[];
  batches?: ProductBatch[];
  serialNumbers?: string[];
  warrantyMonths?: number;
  karat?: 18 | 22 | 24;
  grossWeight?: number;
  netWeight?: number;
  makingChargesPerGram?: number;
  wastagePercent?: number;
  durationMinutes?: number;
  description?: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  gstin?: string;
  billingAddress: string;
  shippingAddress?: string;
  city?: string;
  outstandingBalance: number;
  loyaltyPoints: number;
  creditLimit?: number;
  totalOrdersCount: number;
  totalSpent: number;
}

export interface CartItem {
  id: string; // unique item line id
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number; // in percent or flat amount
  discountType: 'percentage' | 'flat';
  taxRate: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  taxAmount: number;
  subtotal: number; // price * qty - discount
  total: number; // subtotal + tax
  selectedVariant?: ProductVariant;
  selectedBatch?: ProductBatch;
  serialNumber?: string;
  notes?: string;
}

export type PaymentMethod =
  | 'CASH'
  | 'UPI'
  | 'CARD'
  | 'BANK_TRANSFER'
  | 'CREDIT'
  | 'SPLIT';

export interface PaymentEntry {
  method: PaymentMethod;
  amount: number;
  referenceNo?: string;
}

export type InvoiceStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'CANCELLED';

export interface InvoiceTheme {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  headerTextColor: string;
  tableHeaderBg: string;
  badgeBg: string;
}

export interface Invoice {
  id: string;
  businessId: string;
  invoiceNumber: string;
  date: string;
  time: string;
  customer?: Customer;
  items: CartItem[];
  subtotal: number;
  discountTotal: number;
  deliveryCharge: number;
  packagingCharge: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  taxTotal: number;
  roundOff: number;
  grandTotal: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  payments: PaymentEntry[];
  themeId: string;
  tableNo?: string;
  orderType?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'RETAIL' | 'ONLINE';
  notes?: string;
  terms?: string[];
  createdBy: string;
}

export interface HeldBill {
  id: string;
  timestamp: string;
  businessId: string;
  customerName?: string;
  customerPhone?: string;
  tableNo?: string;
  items: CartItem[];
  total: number;
  note?: string;
}

// Restaurant Module Types
export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BILLED';

export interface RestaurantTable {
  id: string;
  tableNumber: string;
  section: string; // Main, AC, Patio, Rooftop
  capacity: number;
  status: TableStatus;
  guestCount?: number;
  currentBillTotal?: number;
  activeKotCount?: number;
  occupiedSince?: string;
}

export interface KitchenOrderTicket {
  id: string;
  orderNumber: string;
  tableNumber: string;
  orderType: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  items: {
    productName: string;
    quantity: number;
    notes?: string;
  }[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED';
  time: string;
  stewardName: string;
}

// Service Business Types
export interface ServiceAppointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// Expense & Purchase Types
export interface ExpenseRecord {
  id: string;
  businessId: string;
  title: string;
  category: 'Rent' | 'Salaries' | 'Utilities' | 'Supplies' | 'Marketing' | 'Maintenance' | 'Miscellaneous';
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  paidTo: string;
  notes?: string;
}

export interface PurchaseRecord {
  id: string;
  businessId: string;
  poNumber: string;
  supplierName: string;
  supplierGstin?: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  paidAmount: number;
  status: 'RECEIVED' | 'ORDERED' | 'PARTIAL';
}

// Staff & Branch
export interface Employee {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'CHEF' | 'STAFF';
  permissions: string[];
  active: boolean;
  avatar?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
  active: boolean;
}

// Notifications
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ORDER' | 'STOCK' | 'PAYMENT' | 'ALERT' | 'EXPIRY';
  timestamp: string;
  read: boolean;
  actionScreen?: string;
}

// Navigation Screens
export type MainTabType = 'home' | 'billing' | 'invoices' | 'reports' | 'more';

export type ActiveScreenType =
  | 'tab_home'
  | 'tab_billing'
  | 'tab_invoices'
  | 'tab_reports'
  | 'tab_more'
  | 'checkout'
  | 'invoice_preview'
  | 'product_management'
  | 'add_edit_product'
  | 'customer_management'
  | 'add_edit_customer'
  | 'restaurant_tables'
  | 'restaurant_kds'
  | 'pharmacy_batches'
  | 'service_appointments'
  | 'expense_manager'
  | 'add_expense'
  | 'purchase_manager'
  | 'barcode_scanner'
  | 'staff_manager'
  | 'branch_manager'
  | 'settings'
  | 'notifications'
  | 'onboarding'
  | 'login'
  | 'register';
