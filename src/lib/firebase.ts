import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Order, SiteContentSettings } from '../types';

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'main';

/**
 * Subscribe to real-time live orders from Firebase Firestore
 */
export function subscribeToFirebaseOrders(onOrdersUpdate: (orders: Order[]) => void) {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((docSnap) => {
        ordersList.push(docSnap.data() as Order);
      });
      onOrdersUpdate(ordersList);
    }, (error) => {
      console.warn('Firestore orders snapshot error:', error);
    });
  } catch (err) {
    console.warn('Failed to subscribe to Firestore orders:', err);
    return () => {};
  }
}

/**
 * Fetch all orders once from Firebase Firestore
 */
export async function getFirebaseOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const ordersList: Order[] = [];
    snapshot.forEach((docSnap) => {
      ordersList.push(docSnap.data() as Order);
    });
    return ordersList;
  } catch (err) {
    console.warn('Failed to get Firebase orders:', err);
    return [];
  }
}

/**
 * Save or update order in Firebase Firestore
 */
export async function saveOrderToFirebase(order: Order): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.orderId);
    await setDoc(orderDocRef, order, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save order to Firebase:', err);
    return false;
  }
}

/**
 * Update order in Firebase Firestore
 */
export async function updateOrderInFirebase(orderId: string, updates: Partial<Order>): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, updates as any);
    return true;
  } catch (err) {
    console.warn('Failed to update order in Firebase:', err);
    return false;
  }
}

/**
 * Delete order from Firebase Firestore
 */
export async function deleteOrderFromFirebase(orderId: string): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderDocRef);
    return true;
  } catch (err) {
    console.warn('Failed to delete order from Firebase:', err);
    return false;
  }
}

/**
 * Subscribe to real-time site settings from Firebase Firestore
 */
export function subscribeToFirebaseSettings(onSettingsUpdate: (settings: SiteContentSettings) => void) {
  try {
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    return onSnapshot(settingsDocRef, (docSnap) => {
      if (docSnap.exists()) {
        onSettingsUpdate(docSnap.data() as SiteContentSettings);
      }
    }, (error) => {
      console.warn('Firestore settings snapshot error:', error);
    });
  } catch (err) {
    console.warn('Failed to subscribe to Firestore settings:', err);
    return () => {};
  }
}

/**
 * Save site settings to Firebase Firestore
 */
export async function saveSettingsToFirebase(settings: SiteContentSettings): Promise<boolean> {
  try {
    const settingsDocRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    await setDoc(settingsDocRef, settings, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save settings to Firebase:', err);
    return false;
  }
}
