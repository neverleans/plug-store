import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, ShippingInfo } from '@/types';

export interface MockOrder {
  id: string;
  date: string;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  items: CartItem[];
  shipping?: ShippingInfo;
}

const ORDERS_KEY = 'ecom-orders';
const ADDR_KEY = 'ecom-addresses';
const NOTIFY_KEY = 'ecom-notify-me';

interface Ctx {
  orders: MockOrder[];
  addOrder: (o: Omit<MockOrder, 'id' | 'date' | 'status'>) => MockOrder;
  addresses: ShippingInfo[];
  saveAddress: (a: ShippingInfo) => void;
  removeAddress: (idx: number) => void;
  notifyList: string[]; // product ids
  toggleNotify: (productId: string) => boolean; // true if subscribed after toggle
  isNotifying: (productId: string) => boolean;
}

const AccountContext = createContext<Ctx | undefined>(undefined);

const read = <T,>(k: string, fb: T): T => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; }
};

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<MockOrder[]>(() => read(ORDERS_KEY, []));
  const [addresses, setAddresses] = useState<ShippingInfo[]>(() => read(ADDR_KEY, []));
  const [notifyList, setNotifyList] = useState<string[]>(() => read(NOTIFY_KEY, []));

  useEffect(() => { try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch {} }, [orders]);
  useEffect(() => { try { localStorage.setItem(ADDR_KEY, JSON.stringify(addresses)); } catch {} }, [addresses]);
  useEffect(() => { try { localStorage.setItem(NOTIFY_KEY, JSON.stringify(notifyList)); } catch {} }, [notifyList]);

  const addOrder = useCallback((o: Omit<MockOrder, 'id' | 'date' | 'status'>) => {
    const order: MockOrder = {
      ...o,
      id: 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      date: new Date().toISOString(),
      status: 'confirmed',
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, []);

  const saveAddress = useCallback((a: ShippingInfo) => {
    setAddresses((prev) => {
      const exists = prev.findIndex((x) => x.address === a.address && x.zip === a.zip);
      if (exists >= 0) {
        const next = [...prev]; next[exists] = a; return next;
      }
      return [a, ...prev].slice(0, 5);
    });
  }, []);
  const removeAddress = useCallback((i: number) => setAddresses((p) => p.filter((_, idx) => idx !== i)), []);

  const isNotifying = useCallback((id: string) => notifyList.includes(id), [notifyList]);
  const toggleNotify = useCallback((id: string) => {
    let result = false;
    setNotifyList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      result = true; return [...prev, id];
    });
    return result;
  }, []);

  return (
    <AccountContext.Provider value={{ orders, addOrder, addresses, saveAddress, removeAddress, notifyList, toggleNotify, isNotifying }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
};
