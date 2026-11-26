import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import { ROOM_AREAS, RoomZone, StoredItem } from '../types';

const CATEGORIES: StoredItem['category'][] = [
  'Ropa',
  'Higiene',
  'Electrónica',
  'Documentos/Valores',
  'Medicinas',
  'Otros',
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, items, roomAreas, isLoading, addItem, removeItem, updateItemZone, refreshData } = useAuth();

  const [activeAreaFilter, setActiveAreaFilter] = useState<RoomZone | 'todas'>('todas');
  const [activeViewTab, setActiveViewTab] = useState<'habitacion' | 'bano'>('habitacion');
  
  // Modal para añadir objeto
  const [modalVisible, setModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<StoredItem['category']>('Otros');
  const [newItemZone, setNewItemZone] = useState<RoomZone>('mesita_noche_izq');
  const [newItemNotes, setNewItemNotes] = useState('');

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.brandTitle}>MÉMORA</Text>
        <Text style={styles.loadingText}>Cargando espacio del huésped...</Text>
      </View>
    );
  }

  // Si no hay usuario logueado, redirigir a Login
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.brandTitle}>MÉMORA</Text>
        <Text style={styles.loadingText}>No hay ninguna sesión activa.</Text>
        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.actionBtnText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    addItem({
      name: newItemName.trim(),
      category: newItemCategory,
      zone: newItemZone,
      notes: newItemNotes.trim(),
    });
    setNewItemName('');
    setNewItemNotes('');
    setModalVisible(false);
  };

  const filteredItems =
    activeAreaFilter === 'todas'
      ? items
      : items.filter((item) => item.zone === activeAreaFilter);

  const getAreaObj = (zoneId: RoomZone) => roomAreas.find((a) => a.id === zoneId);

  const currentAreas = roomAreas.filter((area) =>
    activeViewTab === 'habitacion' ? area.location === 'dormitorio' : area.location === 'bano'
  );

  return (
    <View style={styles.mainWrapper}>
      {/* Barra superior de navegación / Branding */}
      <header style={{ width: '100%' }}>
        <View style={styles.navbar}>
          <View style={styles.navBrand}>
            <Text style={styles.navLogo}>MÉMORA</Text>
            <Text style={styles.navTagline}>Habitación {user.roomNumber}</Text>
          </View>

          <View style={styles.navUserSection}>
            <TouchableOpacity
              style={styles.profileBadge}
              onPress={() => router.push('/profile')}
              activeOpacity={0.8}
            >
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>
                  {user.name ? user.name.charAt(0).toUpperCase() : 'H'}
                </Text>
              </View>
              <View style={styles.guestInfo}>
                <Text style={styles.guestName}>{user.name}</Text>
                {user.checkInDate || user.checkOutDate ? (
                  <Text style={styles.guestDates}>
                    {user.checkInDate} {user.checkOutDate ? `- ${user.checkOutDate}` : ''}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navAddBtn}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.navAddBtnText}>+ Guardar Objeto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </header>

      {/* Contenido principal en ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner de bienvenida y estadísticas rápidas */}
        <View style={styles.welcomeBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeHeading}>¿Dónde deseas que estén tus cosas?</Text>
            <Text style={styles.welcomeSub}>
              Indica la ubicación preferida de tus pertenencias. El servicio de habitación y limpieza
              respetará cada una de tus indicaciones en tu estancia.
            </Text>
          </View>
          <View style={styles.statCardsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{items.length}</Text>
              <Text style={styles.statLabel}>Objetos asignados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{roomAreas.length}</Text>
              <Text style={styles.statLabel}>Zonas disponibles</Text>
            </View>
          </View>
        </View>

        {/* Sección de Zonas de la Habitación con Imagen interactiva */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Plano Visual de Ubicaciones</Text>
              <Text style={styles.sectionSubtitle}>
                Selecciona la vista para ver los espacios o filtrar pertenencias
              </Text>
            </View>

            {/* Pestañas dormitorio / baño */}
            <View style={styles.tabToggleGroup}>
              <TouchableOpacity
                style={[
                  styles.tabToggleBtn,
                  activeViewTab === 'habitacion' && styles.tabToggleBtnActive,
                ]}
                onPress={() => {
                  setActiveViewTab('habitacion');
                  setActiveAreaFilter('todas');
                }}
              >
                <Text
                  style={[
                    styles.tabToggleText,
                    activeViewTab === 'habitacion' && styles.tabToggleTextActive,
                  ]}
                >
                  Dormitorio
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabToggleBtn,
                  activeViewTab === 'bano' && styles.tabToggleBtnActive,
                ]}
                onPress={() => {
                  setActiveViewTab('bano');
                  setActiveAreaFilter('todas');
                }}
              >
                <Text
                  style={[
                    styles.tabToggleText,
                    activeViewTab === 'bano' && styles.tabToggleTextActive,
                  ]}
                >
                  Cuarto de Baño
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tarjetas interactivas de zonas para la vista seleccionada */}
          <View style={styles.roomAreasGrid}>
            <TouchableOpacity
              style={[
                styles.zoneCard,
                activeAreaFilter === 'todas' && styles.zoneCardActive,
              ]}
              onPress={() => setActiveAreaFilter('todas')}
            >
              <Text style={[styles.zoneTitle, activeAreaFilter === 'todas' && styles.zoneTitleActive]}>
                📍 Todas las zonas ({activeViewTab})
              </Text>
              <Text style={styles.zoneItemsCount}>
                {items.filter((it) => {
                  const area = getAreaObj(it.zone);
                  return (
                    (activeViewTab === 'habitacion' && area?.location === 'dormitorio') ||
                    (activeViewTab === 'bano' && area?.location === 'bano')
                  );
                }).length}{' '}
                objetos
              </Text>
            </TouchableOpacity>

            {currentAreas.map((area) => {
              const count = items.filter((it) => it.zone === area.id).length;
              const isSelected = activeAreaFilter === area.id;
              return (
                <TouchableOpacity
                  key={area.id}
                  style={[styles.zoneCard, isSelected && styles.zoneCardActive]}
                  onPress={() => setActiveAreaFilter(isSelected ? 'todas' : area.id)}
                >
                  <View style={styles.zoneCardHeader}>
                    <Text style={[styles.zoneTitle, isSelected && styles.zoneTitleActive]}>
                      {area.name}
                    </Text>
                    <View
                      style={[
                        styles.badgeCount,
                        isSelected && { backgroundColor: COLORS.accent },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeCountText,
                          isSelected && { color: '#FFF' },
                        ]}
                      >
                        {count}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.zoneDesc}>{area.description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Vista previa con foto del hotel */}
          <View style={styles.roomPhotoBanner}>
            <Image
              source={
                activeViewTab === 'habitacion'
                  ? require('../../assets/images/habitacionhotel.jpg')
                  : require('../../assets/images/baño_habitacion.jpg')
              }
              style={styles.hotelPreviewImg}
              resizeMode="cover"
            />
            <View style={styles.photoOverlayBadge}>
              <Text style={styles.photoOverlayTitle}>
                Vista: {activeViewTab === 'habitacion' ? 'Dormitorio Suite' : 'Baño Privado'}
              </Text>
              <Text style={styles.photoOverlayDesc}>
                Personal de camarería sincronizado con las preferencias del cliente
              </Text>
            </View>
          </View>
        </View>

        {/* Listado y Gestión de Objetos del Huésped */}
        <View style={styles.sectionContainer}>
          <View style={styles.itemsSectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Tus Pertenencias Guardadas{' '}
                {activeAreaFilter !== 'todas'
                  ? `en "${getAreaObj(activeAreaFilter as RoomZone)?.name}"`
                  : ''}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {filteredItems.length} objeto(s) configurado(s) para tu estancia
              </Text>
            </View>

            <TouchableOpacity
              style={styles.btnAddSmall}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.btnAddSmallText}>+ Añadir otro objeto</Text>
            </TouchableOpacity>
          </View>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>No hay objetos en esta ubicación</Text>
              <Text style={styles.emptySubtitle}>
                Haz clic en "+ Añadir otro objeto" para indicar al hotel dónde quieres colocar tus cosas.
              </Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.emptyBtnText}>Configurar Primer Objeto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.itemsGrid}>
              {filteredItems.map((item) => {
                const area = getAreaObj(item.zone);
                return (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemCardTop}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{item.category}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeItem(item.id)}
                        style={styles.deleteBtn}
                        accessibilityLabel="Eliminar objeto"
                      >
                        <Text style={styles.deleteBtnText}>✕</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemName}>{item.name}</Text>

                    <View style={styles.itemZoneRow}>
                      <Text style={styles.itemZoneLabel}>Ubicación:</Text>
                      <Text style={styles.itemZoneValue}>{area ? area.name : item.zone}</Text>
                    </View>

                    {item.notes ? (
                      <View style={styles.itemNotesBox}>
                        <Text style={styles.itemNotesLabel}>Instrucciones:</Text>
                        <Text style={styles.itemNotesText}>"{item.notes}"</Text>
                      </View>
                    ) : null}

                    {/* Selector rápido para reubicar objeto */}
                    <View style={styles.reassignSection}>
                      <Text style={styles.reassignLabel}>Cambiar de sitio a:</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.reassignList}
                      >
                        {roomAreas.filter((a) => a.id !== item.zone).map((targetArea) => (
                          <TouchableOpacity
                            key={targetArea.id}
                            style={styles.reassignChip}
                            onPress={() => updateItemZone(item.id, targetArea.id)}
                          >
                            <Text style={styles.reassignChipText}>{targetArea.name}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para Guardar Nuevo Objeto */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Añadir Objeto o Pertenencia</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Especifica qué objeto tienes y dónde quieres que el personal lo coloque.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre del Objeto *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej: Medicación diaria, Joyero, Pijama..."
                placeholderTextColor={COLORS.mutedText}
                value={newItemName}
                onChangeText={setNewItemName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoría</Text>
              <View style={styles.chipsRow}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      newItemCategory === cat && styles.categoryChipActive,
                    ]}
                    onPress={() => setNewItemCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        newItemCategory === cat && styles.categoryChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>¿Dónde deseas que esté colocado? *</Text>
              <ScrollView style={{ maxHeight: 150 }}>
                {roomAreas.map((area) => (
                  <TouchableOpacity
                    key={area.id}
                    style={[
                      styles.zoneOptionItem,
                      newItemZone === area.id && styles.zoneOptionItemActive,
                    ]}
                    onPress={() => setNewItemZone(area.id)}
                  >
                    <Text
                      style={[
                        styles.zoneOptionText,
                        newItemZone === area.id && styles.zoneOptionTextActive,
                      ]}
                    >
                      {area.name} ({area.location === 'dormitorio' ? 'Habitación' : 'Baño'})
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Instrucciones especiales para el personal</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Ej: Mantener dentro del estuche, no mover del lado derecho..."
                placeholderTextColor={COLORS.mutedText}
                value={newItemNotes}
                onChangeText={setNewItemNotes}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalSubmitBtn,
                  !newItemName.trim() && { opacity: 0.5 },
                ]}
                disabled={!newItemName.trim()}
                onPress={handleCreateItem}
              >
                <Text style={styles.modalSubmitText}>Guardar Ubicación</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 4,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginVertical: 16,
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  navbar: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  navBrand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  navLogo: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.accent,
    letterSpacing: 3,
  },
  navTagline: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  navUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: COLORS.lightGray,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMiniText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  guestInfo: {
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  guestName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  guestDates: {
    fontSize: 11,
    color: COLORS.mutedText,
  },
  navAddBtn: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  navAddBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 24,
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  welcomeBanner: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 20,
  },
  welcomeHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  welcomeSub: {
    fontSize: 14,
    color: COLORS.mutedText,
    lineHeight: 20,
    maxWidth: 620,
  },
  statCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 110,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.mutedText,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  tabToggleGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    padding: 4,
    borderRadius: 10,
  },
  tabToggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabToggleBtnActive: {
    backgroundColor: COLORS.accent,
  },
  tabToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  tabToggleTextActive: {
    color: '#FFF',
  },
  roomAreasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  zoneCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    flex: 1,
    minWidth: 200,
  },
  zoneCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  zoneCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  zoneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  zoneTitleActive: {
    color: COLORS.accent,
  },
  zoneItemsCount: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 4,
  },
  badgeCount: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  zoneDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    lineHeight: 16,
  },
  roomPhotoBanner: {
    position: 'relative',
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  hotelPreviewImg: {
    width: '100%',
    height: '100%',
  },
  photoOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(74, 45, 40, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  photoOverlayTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  photoOverlayDesc: {
    color: '#F0ECE9',
    fontSize: 12,
    marginTop: 2,
  },
  itemsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnAddSmall: {
    backgroundColor: COLORS.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnAddSmallText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 400,
    lineHeight: 18,
  },
  emptyBtn: {
    marginTop: 18,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  itemCard: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    flex: 1,
    minWidth: 280,
    maxWidth: 360,
  },
  itemCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mutedText,
    textTransform: 'uppercase',
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    fontSize: 14,
    color: COLORS.mutedText,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  itemZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  itemZoneLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  itemZoneValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  itemNotesBox: {
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  itemNotesLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText,
    marginBottom: 2,
  },
  itemNotesText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: COLORS.text,
  },
  reassignSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  reassignLabel: {
    fontSize: 11,
    color: COLORS.mutedText,
    fontWeight: '600',
    marginBottom: 6,
  },
  reassignList: {
    flexDirection: 'row',
  },
  reassignChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
  },
  reassignChipText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 26,
    width: '100%',
    maxWidth: 520,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalCloseText: {
    fontSize: 18,
    color: COLORS.mutedText,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginBottom: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FAFAFA',
  },
  notesInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  categoryChipActive: {
    backgroundColor: COLORS.accent,
  },
  categoryChipText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#FFF',
  },
  zoneOptionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 6,
    backgroundColor: '#FAFAFA',
  },
  zoneOptionItemActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  zoneOptionText: {
    fontSize: 13,
    color: COLORS.text,
  },
  zoneOptionTextActive: {
    fontWeight: '700',
    color: COLORS.accent,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  modalCancelText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  modalSubmitText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
