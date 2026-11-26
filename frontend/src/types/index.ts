export interface GuestUser {
  id: string;
  name: string;
  email: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  preferences?: string;
  avatarUrl?: string;
}

export type RoomZone =
  | 'mesita_noche_izq'
  | 'mesita_noche_der'
  | 'armario_principal'
  | 'caja_fuerte'
  | 'escritorio'
  | 'lavabo_bano'
  | 'estante_ducha'
  | 'maletero_banco';

export interface RoomArea {
  id: RoomZone;
  name: string;
  location: 'dormitorio' | 'bano';
  description: string;
  icon: string;
}

export interface StoredItem {
  id: string;
  name: string;
  category: 'Ropa' | 'Higiene' | 'Electrónica' | 'Documentos/Valores' | 'Medicinas' | 'Otros';
  zone: RoomZone;
  notes?: string;
  photoUri?: string;
  createdAt: string;
}

export const ROOM_AREAS: RoomArea[] = [
  {
    id: 'mesita_noche_izq',
    name: 'Mesita de noche (Izquierda)',
    location: 'dormitorio',
    description: 'Junto a la cama, lado izquierdo',
    icon: 'bed-outline',
  },
  {
    id: 'mesita_noche_der',
    name: 'Mesita de noche (Derecha)',
    location: 'dormitorio',
    description: 'Junto a la cama, lado derecho',
    icon: 'bed-outline',
  },
  {
    id: 'armario_principal',
    name: 'Armario Principal / Perchas',
    location: 'dormitorio',
    description: 'Balda superior y barra con perchas',
    icon: 'shirt-outline',
  },
  {
    id: 'caja_fuerte',
    name: 'Caja Fuerte',
    location: 'dormitorio',
    description: 'Interior del armario, estante de seguridad',
    icon: 'lock-closed-outline',
  },
  {
    id: 'escritorio',
    name: 'Escritorio de Trabajo',
    location: 'dormitorio',
    description: 'Superficie de mesa y tomas de corriente',
    icon: 'laptop-outline',
  },
  {
    id: 'maletero_banco',
    name: 'Banco Maletero',
    location: 'dormitorio',
    description: 'Entrada junto al espejo',
    icon: 'briefcase-outline',
  },
  {
    id: 'lavabo_bano',
    name: 'Encimera del Lavabo',
    location: 'bano',
    description: 'Bandeja de cortesía y encimera',
    icon: 'water-outline',
  },
  {
    id: 'estante_ducha',
    name: 'Repisa de Ducha',
    location: 'bano',
    description: 'Dentro de la cabina de ducha',
    icon: 'sparkles-outline',
  },
];
