import { supabase } from '../../services/supabase';
import { RoomArea, GuestUser, StoredItem, RoomZone } from '../types';

/**
 * Servicios para interactuar con Supabase en tiempo real.
 * Diseñado con soporte bilingüe/resiliente (español e inglés: habitaciones/espacios/objetos o rooms/areas/items)
 */

export const RoomService = {
  // Obtener espacios/zonas de habitaciones desde Supabase
  async getRoomSpaces(roomNumber?: string): Promise<RoomArea[]> {
    try {
      // 1. Intentar tabla 'espacios' o 'espacios_habitacion' o 'room_areas'
      let { data, error } = await supabase
        .from('espacios')
        .select('*');

      if (error || !data) {
        const fallbackQuery = await supabase.from('room_areas').select('*');
        data = fallbackQuery.data;
        error = fallbackQuery.error;
      }

      if (data && data.length > 0) {
        return data.map((item: any) => ({
          id: (item.code || item.slug || item.id) as RoomZone,
          name: item.nombre || item.name || item.titulo || 'Espacio',
          location: (item.ubicacion || item.location || 'dormitorio') as 'dormitorio' | 'bano',
          description: item.descripcion || item.description || '',
          icon: item.icono || item.icon || 'cube-outline',
        }));
      }
    } catch (err) {
      console.warn('Error al recuperar espacios desde Supabase:', err);
    }
    return [];
  },

  // Obtener habitaciones registradas
  async getRooms(): Promise<any[]> {
    try {
      const { data, error } = await supabase.from('habitaciones').select('*');
      if (!error && data) return data;
    } catch (err) {
      console.warn('Error al obtener habitaciones:', err);
    }
    return [];
  },
};

export const GuestService = {
  // Iniciar sesión con email y habitación buscando en 'huespedes' / 'reservas'
  async loginGuest(email: string, roomNumber: string): Promise<GuestUser | null> {
    try {
      // Buscar en 'huespedes'
      const { data, error } = await supabase
        .from('huespedes')
        .select('*')
        .ilike('email', email.trim())
        .limit(1);

      if (!error && data && data.length > 0) {
        const g = data[0];
        return {
          id: String(g.id),
          name: g.nombre || g.name || email.split('@')[0],
          email: g.email,
          roomNumber: g.habitacion || g.numero_habitacion || roomNumber,
          checkInDate: g.check_in || g.fecha_llegada || '',
          checkOutDate: g.check_out || g.fecha_salida || '',
          preferences: g.preferencias || g.preferences || '',
        };
      }
    } catch (err) {
      console.warn('Error en loginGuest Supabase:', err);
    }

    // Si aún no está en la base de datos o falló, crear el objeto de sesión para el huésped
    return {
      id: 'guest_' + Date.now(),
      name: email.split('@')[0],
      email: email.trim(),
      roomNumber: roomNumber.trim(),
      checkInDate: '',
      checkOutDate: '',
      preferences: '',
    };
  },

  // Registrar nuevo huésped en Supabase
  async registerGuest(guest: Omit<GuestUser, 'id'>): Promise<GuestUser> {
    try {
      const { data, error } = await supabase
        .from('huespedes')
        .insert({
          nombre: guest.name,
          email: guest.email,
          habitacion: guest.roomNumber,
          check_in: guest.checkInDate || null,
          check_out: guest.checkOutDate || null,
          preferencias: guest.preferences || null,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: String(data.id),
          name: data.nombre,
          email: data.email,
          roomNumber: data.habitacion,
          checkInDate: data.check_in || '',
          checkOutDate: data.check_out || '',
          preferences: data.preferencias || '',
        };
      }
    } catch (err) {
      console.warn('Error en registerGuest Supabase:', err);
    }

    return {
      ...guest,
      id: 'guest_' + Date.now(),
    };
  },

  // Actualizar perfil de huésped
  async updateProfile(id: string, updates: Partial<GuestUser>): Promise<boolean> {
    try {
      const payload: any = {};
      if (updates.name) payload.nombre = updates.name;
      if (updates.email) payload.email = updates.email;
      if (updates.roomNumber) payload.habitacion = updates.roomNumber;
      if (updates.preferences !== undefined) payload.preferencias = updates.preferences;

      const { error } = await supabase
        .from('huespedes')
        .update(payload)
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },
};

export const BelongingService = {
  // Obtener pertenencias/objetos guardados de un huésped o habitación
  async getItems(roomNumber?: string, guestId?: string): Promise<StoredItem[]> {
    try {
      let query = supabase.from('objetos').select('*');

      if (guestId && !guestId.startsWith('guest_')) {
        query = query.eq('huesped_id', guestId);
      } else if (roomNumber) {
        query = query.eq('habitacion', roomNumber);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: any) => ({
          id: String(item.id),
          name: item.nombre || item.name || '',
          category: item.categoria || item.category || 'Otros',
          zone: (item.zona || item.espacio || item.zone) as RoomZone,
          notes: item.instrucciones || item.notas || item.notes || '',
          createdAt: item.created_at || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.warn('Error al cargar objetos desde Supabase:', err);
    }
    return [];
  },

  // Guardar nuevo objeto en Supabase
  async addItem(
    item: Omit<StoredItem, 'id' | 'createdAt'>,
    roomNumber?: string,
    guestId?: string
  ): Promise<StoredItem> {
    try {
      const { data, error } = await supabase
        .from('objetos')
        .insert({
          nombre: item.name,
          categoria: item.category,
          zona: item.zone,
          instrucciones: item.notes || null,
          habitacion: roomNumber || null,
          huesped_id: guestId && !guestId.startsWith('guest_') ? guestId : null,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: String(data.id),
          name: data.nombre,
          category: data.categoria,
          zone: data.zona as RoomZone,
          notes: data.instrucciones || '',
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      console.warn('Error al insertar objeto en Supabase:', err);
    }

    return {
      ...item,
      id: 'item_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
  },

  // Eliminar objeto
  async deleteItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('objetos').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },

  // Mover objeto a nueva zona
  async updateZone(id: string, newZone: RoomZone): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('objetos')
        .update({ zona: newZone })
        .eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
};
