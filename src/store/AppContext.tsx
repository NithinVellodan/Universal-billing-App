import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  BusinessConfig,
  Product,
  Customer,
  CartItem,
  Invoice,
  InvoiceTheme,
  HeldBill,
  RestaurantTable,
  KitchenOrderTicket,
  ServiceAppointment,
  ExpenseRecord,
  PurchaseRecord,
  Employee,
  Branch,
  AppNotification,
  MainTabType,
  ActiveScreenType,
  PaymentMethod,
  PaymentEntry,
} from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_INVOICES,
  INVOICE_THEMES,
  INITIAL_TABLES,
  INITIAL_KOTS,
  INITIAL_APPOINTMENTS,
  INITIAL_EXPENSES,
  INITIAL_PURCHASES,
  INITIAL_EMPLOYEES,
  INITIAL_BRANCHES,
  INITIAL_NOTIFICATIONS,
} from '../database/mockData';

interface AppContextType {
  // Business
  businesses: BusinessConfig[];
  activeBusiness: BusinessConfig;
  switchBusiness: (id: string) => void;
  updateBusiness: (updates: Partial<BusinessConfig>) => void;
  addBusiness: (business: BusinessConfig) => void;

  // Catalog
  products: Product[];
  activeBusinessProducts: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Customers
  customers: Customer[];
  activeBusinessCustomers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Cart & POS
  cart: CartItem[];
  cartCustomer: Customer | null;
  setCartCustomer: (customer: Customer | null) => void;
  cartDiscount: number;
  setCartDiscount: (disc: number) => void;
  orderType: 'RETAIL' | 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  setOrderType: (type: 'RETAIL' | 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY') => void;
  selectedTable: string | null;
  setSelectedTable: (tbl: string | null) => void;
  addToCart: (product: Product, quantity?: number, variant?: any, batch?: any) => void;
  updateCartItemQty: (itemId: string, delta: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  heldBills: HeldBill[];
  holdCurrentBill: (note?: string) => void;
  resumeHeldBill: (heldBillId: string) => void;
  cartTotals: {
    subtotal: number;
    discountTotal: number;
    cgstTotal: number;
    sgstTotal: number;
    taxTotal: number;
    roundOff: number;
    grandTotal: number;
    itemCount: number;
  };
  completeCheckout: (paymentMethod: PaymentMethod, payments?: PaymentEntry[]) => Invoice;

  // Invoices
  invoices: Invoice[];
  activeBusinessInvoices: Invoice[];
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  invoiceThemes: InvoiceTheme[];
  activeInvoiceTheme: InvoiceTheme;
  setActiveInvoiceTheme: (theme: InvoiceTheme) => void;
  cancelInvoice: (invoiceId: string) => void;

  // Restaurant module
  tables: RestaurantTable[];
  updateTableStatus: (tableId: string, status: RestaurantTable['status'], currentBillTotal?: number) => void;
  kots: KitchenOrderTicket[];
  addKot: (kot: KitchenOrderTicket) => void;
  updateKotStatus: (kotId: string, status: KitchenOrderTicket['status']) => void;

  // Service module
  appointments: ServiceAppointment[];
  addAppointment: (appointment: ServiceAppointment) => void;
  updateAppointmentStatus: (id: string, status: ServiceAppointment['status']) => void;

  // Expenses & Purchases
  expenses: ExpenseRecord[];
  activeBusinessExpenses: ExpenseRecord[];
  addExpense: (expense: ExpenseRecord) => void;
  purchases: PurchaseRecord[];
  activeBusinessPurchases: PurchaseRecord[];

  // Staff & Branches
  employees: Employee[];
  branches: Branch[];

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (notification: AppNotification) => void;

  // Navigation
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  activeScreen: ActiveScreenType;
  navigateTo: (screen: ActiveScreenType, params?: any) => void;
  goBack: () => void;
  screenParams: Record<string, any>;

  // Dashboard Metrics
  dashboardMetrics: {
    todaySales: number;
    totalRevenue: number;
    totalOrders: number;
    totalInvoices: number;
    pendingPayments: number;
    totalExpenses: number;
    netProfit: number;
  };

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Businesses
  const [businesses, setBusinesses] = useState<BusinessConfig[]>(INITIAL_BUSINESSES);
  const [activeBusinessId, setActiveBusinessId] = useState<string>(INITIAL_BUSINESSES[0].id);

  const activeBusiness = useMemo(
    () => businesses.find((b) => b.id === activeBusinessId) || businesses[0],
    [businesses, activeBusinessId]
  );

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const activeBusinessProducts = useMemo(
    () => products.filter((p) => p.businessId === activeBusiness.id),
    [products, activeBusiness.id]
  );

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const activeBusinessCustomers = useMemo(
    () => customers.filter((c) => c.businessId === activeBusiness.id),
    [customers, activeBusiness.id]
  );

  // Invoices & Themes
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const activeBusinessInvoices = useMemo(
    () => invoices.filter((i) => i.businessId === activeBusiness.id),
    [invoices, activeBusiness.id]
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(INITIAL_INVOICES[0]);
  const [invoiceThemes] = useState<InvoiceTheme[]>(INVOICE_THEMES);
  const [activeInvoiceTheme, setActiveInvoiceTheme] = useState<InvoiceTheme>(INVOICE_THEMES[0]);

  // Restaurant & KOT
  const [tables, setTables] = useState<RestaurantTable[]>(INITIAL_TABLES);
  const [kots, setKots] = useState<KitchenOrderTicket[]>(INITIAL_KOTS);

  // Service
  const [appointments, setAppointments] = useState<ServiceAppointment[]>(INITIAL_APPOINTMENTS);

  // Expenses & Purchases
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);
  const activeBusinessExpenses = useMemo(
    () => expenses.filter((e) => e.businessId === activeBusiness.id),
    [expenses, activeBusiness.id]
  );

  const [purchases] = useState<PurchaseRecord[]>(INITIAL_PURCHASES);
  const activeBusinessPurchases = useMemo(
    () => purchases.filter((p) => p.businessId === activeBusiness.id),
    [purchases, activeBusiness.id]
  );

  // Employees & Branches
  const [employees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [branches] = useState<Branch[]>(INITIAL_BRANCHES);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Cart & POS State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCustomer, setCartCustomer] = useState<Customer | null>(null);
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [orderType, setOrderType] = useState<'RETAIL' | 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('RETAIL');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [heldBills, setHeldBills] = useState<HeldBill[]>([]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [activeScreen, setActiveScreen] = useState<ActiveScreenType>('tab_home');
  const [screenStack, setScreenStack] = useState<ActiveScreenType[]>(['tab_home']);
  const [screenParams, setScreenParams] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart Calculations
  const cartTotals = useMemo(() => {
    let subtotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let taxTotal = 0;
    let itemCount = 0;

    cart.forEach((item) => {
      subtotal += item.subtotal;
      cgstTotal += item.cgstAmount;
      sgstTotal += item.sgstAmount;
      taxTotal += item.taxAmount;
      itemCount += item.quantity;
    });

    const discountTotal = cartDiscount;
    const rawTotal = Math.max(0, subtotal - discountTotal + taxTotal);
    const rounded = Math.round(rawTotal);
    const roundOff = +(rounded - rawTotal).toFixed(2);

    return {
      subtotal: +subtotal.toFixed(2),
      discountTotal: +discountTotal.toFixed(2),
      cgstTotal: +cgstTotal.toFixed(2),
      sgstTotal: +sgstTotal.toFixed(2),
      taxTotal: +taxTotal.toFixed(2),
      roundOff,
      grandTotal: rounded,
      itemCount,
    };
  }, [cart, cartDiscount]);

  // Dashboard Metrics Calculations
  const dashboardMetrics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayInvoices = activeBusinessInvoices.filter((inv) => inv.date === today && inv.status !== 'CANCELLED');
    const todaySales = todayInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

    const validInvoices = activeBusinessInvoices.filter((inv) => inv.status !== 'CANCELLED');
    const totalRevenue = validInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOrders = validInvoices.length;
    const totalInvoices = activeBusinessInvoices.length;

    const pendingPayments = validInvoices
      .filter((inv) => inv.status === 'PENDING' || inv.status === 'PARTIAL')
      .reduce((sum, inv) => sum + inv.dueAmount, 0);

    const totalExpenses = activeBusinessExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    return {
      todaySales,
      totalRevenue,
      totalOrders,
      totalInvoices,
      pendingPayments,
      totalExpenses,
      netProfit,
    };
  }, [activeBusinessInvoices, activeBusinessExpenses]);

  // Business Switcher
  const switchBusiness = (id: string) => {
    const target = businesses.find((b) => b.id === id);
    if (target) {
      setActiveBusinessId(id);
      setCart([]);
      setCartCustomer(null);
      setCartDiscount(0);
      setSelectedTable(null);
      // Auto adapt order type
      if (target.industry === 'restaurant') {
        setOrderType('DINE_IN');
      } else {
        setOrderType('RETAIL');
      }
    }
  };

  const updateBusiness = (updates: Partial<BusinessConfig>) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === activeBusiness.id ? { ...b, ...updates } : b))
    );
  };

  const addBusiness = (business: BusinessConfig) => {
    setBusinesses((prev) => [business, ...prev]);
    setActiveBusinessId(business.id);
  };

  // Product Actions
  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Customer Actions
  const addCustomer = (customer: Customer) => {
    setCustomers((prev) => [customer, ...prev]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  // Cart & POS Actions
  const addToCart = (product: Product, quantity = 1, variant?: any, batch?: any) => {
    const unitPrice = variant ? product.sellingPrice + (variant.additionalPrice || 0) : product.sellingPrice;
    const taxRate = product.taxRate || 0;
    const halfTax = taxRate / 2;

    const lineId = `${product.id}_${variant ? variant.id : 'base'}_${batch ? batch.id : 'base'}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const subtotal = +(newQty * unitPrice).toFixed(2);
        const taxAmount = +(subtotal * (taxRate / 100)).toFixed(2);
        const cgstAmount = +(taxAmount / 2).toFixed(2);
        const sgstAmount = +(taxAmount / 2).toFixed(2);
        const total = +(subtotal + taxAmount).toFixed(2);

        return prev.map((item) =>
          item.id === lineId
            ? {
                ...item,
                quantity: newQty,
                subtotal,
                taxAmount,
                cgstAmount,
                sgstAmount,
                total,
              }
            : item
        );
      } else {
        const subtotal = +(quantity * unitPrice).toFixed(2);
        const taxAmount = +(subtotal * (taxRate / 100)).toFixed(2);
        const cgstAmount = +(taxAmount / 2).toFixed(2);
        const sgstAmount = +(taxAmount / 2).toFixed(2);
        const total = +(subtotal + taxAmount).toFixed(2);

        const newItem: CartItem = {
          id: lineId,
          product,
          quantity,
          unitPrice,
          discount: 0,
          discountType: 'percentage',
          taxRate,
          cgstRate: halfTax,
          sgstRate: halfTax,
          igstRate: 0,
          cgstAmount,
          sgstAmount,
          igstAmount: 0,
          taxAmount,
          subtotal,
          total,
          selectedVariant: variant,
          selectedBatch: batch,
        };
        return [...prev, newItem];
      }
    });
  };

  const updateCartItemQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            const subtotal = +(newQty * item.unitPrice).toFixed(2);
            const taxAmount = +(subtotal * (item.taxRate / 100)).toFixed(2);
            const cgstAmount = +(taxAmount / 2).toFixed(2);
            const sgstAmount = +(taxAmount / 2).toFixed(2);
            const total = +(subtotal + taxAmount).toFixed(2);
            return {
              ...item,
              quantity: newQty,
              subtotal,
              taxAmount,
              cgstAmount,
              sgstAmount,
              total,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setCartCustomer(null);
    setSelectedTable(null);
  };

  const holdCurrentBill = (note?: string) => {
    if (cart.length === 0) return;
    const newHeld: HeldBill = {
      id: `held_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      businessId: activeBusiness.id,
      customerName: cartCustomer?.name,
      customerPhone: cartCustomer?.phone,
      tableNo: selectedTable || undefined,
      items: [...cart],
      total: cartTotals.grandTotal,
      note,
    };
    setHeldBills((prev) => [newHeld, ...prev]);
    clearCart();
    addNotification({
      id: `notif_${Date.now()}`,
      title: 'Bill Held on Hold Tray',
      message: `Bill of ${cartTotals.grandTotal} placed on hold.`,
      type: 'ALERT',
      timestamp: 'Just now',
      read: false,
    });
  };

  const resumeHeldBill = (heldBillId: string) => {
    const held = heldBills.find((h) => h.id === heldBillId);
    if (!held) return;
    setCart(held.items);
    if (held.customerName) {
      const matchCust = customers.find((c) => c.name === held.customerName);
      if (matchCust) setCartCustomer(matchCust);
    }
    if (held.tableNo) {
      setSelectedTable(held.tableNo);
    }
    setHeldBills((prev) => prev.filter((h) => h.id !== heldBillId));
  };

  const completeCheckout = (paymentMethod: PaymentMethod, customPayments?: PaymentEntry[]): Invoice => {
    const nextSeq = (activeBusiness.invoiceNumberSeq || 1000) + 1;
    const invNumber = `${activeBusiness.invoicePrefix || 'INV-'}${nextSeq}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const payments: PaymentEntry[] = customPayments || [
      {
        method: paymentMethod,
        amount: cartTotals.grandTotal,
        referenceNo: paymentMethod === 'UPI' ? `UPI-${Date.now().toString().slice(-6)}` : undefined,
      },
    ];

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      businessId: activeBusiness.id,
      invoiceNumber: invNumber,
      date: dateStr,
      time: timeStr,
      customer: cartCustomer || undefined,
      items: [...cart],
      subtotal: cartTotals.subtotal,
      discountTotal: cartTotals.discountTotal,
      deliveryCharge: 0,
      packagingCharge: 0,
      cgstTotal: cartTotals.cgstTotal,
      sgstTotal: cartTotals.sgstTotal,
      igstTotal: 0,
      taxTotal: cartTotals.taxTotal,
      roundOff: cartTotals.roundOff,
      grandTotal: cartTotals.grandTotal,
      paidAmount: cartTotals.grandTotal,
      dueAmount: 0,
      status: 'PAID',
      paymentMethod,
      payments,
      themeId: activeInvoiceTheme.id,
      tableNo: selectedTable || undefined,
      orderType,
      terms: activeBusiness.terms,
      createdBy: 'Nithin V. (Active)',
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    setSelectedInvoice(newInvoice);

    // Update seq in business
    updateBusiness({ invoiceNumberSeq: nextSeq });

    // Deduct stock
    cart.forEach((item) => {
      updateProduct(item.product.id, {
        stock: Math.max(0, item.product.stock - item.quantity),
      });
    });

    // If customer selected, increment stats
    if (cartCustomer) {
      updateCustomer(cartCustomer.id, {
        totalOrdersCount: (cartCustomer.totalOrdersCount || 0) + 1,
        totalSpent: (cartCustomer.totalSpent || 0) + cartTotals.grandTotal,
        loyaltyPoints: (cartCustomer.loyaltyPoints || 0) + Math.floor(cartTotals.grandTotal / 100),
      });
    }

    // Add notification
    addNotification({
      id: `notif_${Date.now()}`,
      title: 'Invoice Generated',
      message: `Invoice ${newInvoice.invoiceNumber} for ${activeBusiness.currencySymbol}${newInvoice.grandTotal} completed.`,
      type: 'ORDER',
      timestamp: 'Just now',
      read: false,
    });

    // Clear cart
    clearCart();

    return newInvoice;
  };

  const cancelInvoice = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'CANCELLED' } : i))
    );
  };

  // Restaurant Table actions
  const updateTableStatus = (tableId: string, status: RestaurantTable['status'], currentBillTotal?: number) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status, currentBillTotal: currentBillTotal ?? t.currentBillTotal } : t))
    );
  };

  const addKot = (kot: KitchenOrderTicket) => {
    setKots((prev) => [kot, ...prev]);
  };

  const updateKotStatus = (kotId: string, status: KitchenOrderTicket['status']) => {
    setKots((prev) =>
      prev.map((k) => (k.id === kotId ? { ...k, status } : k))
    );
  };

  // Service actions
  const addAppointment = (appointment: ServiceAppointment) => {
    setAppointments((prev) => [appointment, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: ServiceAppointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // Expense actions
  const addExpense = (expense: ExpenseRecord) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const addNotification = (notification: AppNotification) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  // Navigation handlers
  const navigateTo = (screen: ActiveScreenType, params?: any) => {
    if (params) setScreenParams((prev) => ({ ...prev, ...params }));
    setScreenStack((prev) => [...prev, screen]);
    setActiveScreen(screen);
  };

  const goBack = () => {
    if (screenStack.length > 1) {
      const nextStack = [...screenStack];
      nextStack.pop();
      const previousScreen = nextStack[nextStack.length - 1];
      setScreenStack(nextStack);
      setActiveScreen(previousScreen);
    }
  };

  const handleTabChange = (tab: MainTabType) => {
    setActiveTab(tab);
    const screenMap: Record<MainTabType, ActiveScreenType> = {
      home: 'tab_home',
      billing: 'tab_billing',
      invoices: 'tab_invoices',
      reports: 'tab_reports',
      more: 'tab_more',
    };
    const targetScreen = screenMap[tab];
    setActiveScreen(targetScreen);
    setScreenStack([targetScreen]);
  };

  const value: AppContextType = {
    businesses,
    activeBusiness,
    switchBusiness,
    updateBusiness,
    addBusiness,
    products,
    activeBusinessProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    customers,
    activeBusinessCustomers,
    addCustomer,
    updateCustomer,
    cart,
    cartCustomer,
    setCartCustomer,
    cartDiscount,
    setCartDiscount,
    orderType,
    setOrderType,
    selectedTable,
    setSelectedTable,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    clearCart,
    heldBills,
    holdCurrentBill,
    resumeHeldBill,
    cartTotals,
    completeCheckout,
    invoices,
    activeBusinessInvoices,
    selectedInvoice,
    setSelectedInvoice,
    invoiceThemes,
    activeInvoiceTheme,
    setActiveInvoiceTheme,
    cancelInvoice,
    tables,
    updateTableStatus,
    kots,
    addKot,
    updateKotStatus,
    appointments,
    addAppointment,
    updateAppointmentStatus,
    expenses,
    activeBusinessExpenses,
    addExpense,
    purchases,
    activeBusinessPurchases,
    employees,
    branches,
    notifications,
    markNotificationRead,
    addNotification,
    activeTab,
    setActiveTab: handleTabChange,
    activeScreen,
    navigateTo,
    goBack,
    screenParams,
    dashboardMetrics,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
