import React, { createContext, useContext, useState, useEffect } from 'react';
import { GuestUser, StoredItem, RoomArea, RoomZone, ROOM_AREAS } from '../types';
import { RoomService, GuestService, BelongingService } from '../services/supabaseData';

interface AuthContextType {
  user: GuestUser | null;
  items: StoredItem[];
  roomAreas: RoomArea[];
  isLoading: boolean;
  login: (email: string, roomNumber: string) => Promise<boolean>;
  register: (userData: Omit<GuestUser, 'id'>) => Promise<void>;
  updateProfile: (data: Partial<GuestUser>) => Promise<void>;
  logout: () => void;
  addItem: (item: Omit<StoredItem, 'id' | 'createdAt'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItemZone: (id: string, newZone: RoomZone) => Promise<void>;
  refreshData: () => Promise<void>;
}

const STORAGE_KEY_USER = '@memora_user';
const STORAGE_KEY_ITEMS = '@memora_items';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GuestUser | null>(null);
  const [items, setItems] = useState<StoredItem[]>([]);
  const [roomAreas, setRoomAreas] = useState<RoomArea[]>(ROOM_AREAS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Carga inicial de sesión local y sincronización con Supabase
  useEffect(() => {
    const initApp = async () => {
      try {
        let loadedUser: GuestUser | null = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          const savedUser = window.localStorage.getItem(STORAGE_KEY_USER);
          if (savedUser) {
            loadedUser = JSON.parse(savedUser);
            setUser(loadedUser);
          }
        }

        // Cargar espacios de la habitación desde Supabase
        const remoteAreas = await RoomService.getRoomSpaces(loadedUser?.roomNumber);
        if (remoteAreas && remoteAreas.length > 0) {
          setRoomAreas(remoteAreas);
        }

        // Cargar objetos desde Supabase
        if (loadedUser) {
          const remoteItems = await BelongingService.getItems(loadedUser.roomNumber, loadedUser.id);
          if (remoteItems && remoteItems.length > 0) {
            setItems(remoteItems);
          } else if (typeof window !== 'undefined' && window.localStorage) {
            const savedItems = window.localStorage.getItem(STORAGE_KEY_ITEMS);
            if (savedItems) setItems(JSON.parse(savedItems));
          }
        }
      } catch (err) {
        console.warn('Error inicializando datos con Supabase:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const saveToStorage = (updatedUser: GuestUser | null, updatedItems: StoredItem[]) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (updatedUser) {
          window.localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
        } else {
          window.localStorage.removeItem(STORAGE_KEY_USER);
        }
        window.localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(updatedItems));
      }
    } catch {
      // Ignorar fallback
    }
  };

  const refreshData = async () => {
    if (!user) return;
    try {
      const [remoteAreas, remoteItems] = await Promise.all([
        RoomService.getRoomSpaces(user.roomNumber),
        BelongingService.getItems(user.roomNumber, user.id),
      ]);
      if (remoteAreas && remoteAreas.length > 0) setRoomAreas(remoteAreas);
      if (remoteItems) setItems(remoteItems);
    } catch (e) {
      console.warn('Error en refreshData:', e);
    }
  };

  const login = async (email: string, roomNumber: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const guest = await GuestService.loginGuest(email, roomNumber);
      if (guest) {
        setUser(guest);
        // Cargar pertenencias asociadas desde Supabase
        const remoteItems = await BelongingService.getItems(guest.roomNumber, guest.id);
        const currentItems = remoteItems && remoteItems.length > 0 ? remoteItems : [];
        setItems(currentItems);
        saveToStorage(guest, currentItems);
        return true;
      }
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const register = async (userData: Omit<GuestUser, 'id'>): Promise<void> => {
    setIsLoading(true);
    try {
      const newGuest = await GuestService.registerGuest(userData);
      setUser(newGuest);
      setItems([]);
      saveToStorage(newGuest, []);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<GuestUser>): Promise<void> => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    saveToStorage(updated, items);
    await GuestService.updateProfile(user.id, data);
  };

  const logout = () => {
    setUser(null);
    setItems([]);
    saveToStorage(null, []);
  };

  const addItem = async (item: Omit<StoredItem, 'id' | 'createdAt'>): Promise<void> => {
    const saved = await BelongingService.addItem(item, user?.roomNumber, user?.id);
    const updatedList = [saved, ...items];
    setItems(updatedList);
    saveToStorage(user, updatedList);
  };

  const removeItem = async (id: string): Promise<void> => {
    await BelongingService.deleteItem(id);
    const updatedList = items.filter((it) => it.id !== id);
    setItems(updatedList);
    saveToStorage(user, updatedList);
  };

  const updateItemZone = async (id: string, newZone: RoomZone): Promise<void> => {
    await BelongingService.updateZone(id, newZone);
    const updatedList = items.map((it) => (it.id === id ? { ...it, zone: newZone } : it));
    setItems(updatedList);
    saveToStorage(user, updatedList);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        items,
        roomAreas,
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        addItem,
        removeItem,
        updateItemZone,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
