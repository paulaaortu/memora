import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [preferences, setPreferences] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !roomNumber.trim()) {
      setError('Por favor, completa los campos obligatorios (*).');
      return;
    }
    setError('');
    register({
      name: name.trim(),
      email: email.trim(),
      roomNumber: roomNumber.trim(),
      checkInDate: checkInDate.trim(),
      checkOutDate: checkOutDate.trim(),
      preferences: preferences.trim(),
    });
    router.replace('/');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>MÉMORA</Text>
          <Text style={styles.brandSubtitle}>Creación de Perfil de Huésped</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre completo *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Laura Martínez"
            placeholderTextColor={COLORS.mutedText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="laura@ejemplo.com"
            placeholderTextColor={COLORS.mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Nº Habitación *</Text>
            <TextInput
              style={styles.input}
              value={roomNumber}
              onChangeText={setRoomNumber}
              placeholder="Ej: 402"
              placeholderTextColor={COLORS.mutedText}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Check-in</Text>
            <TextInput
              style={styles.input}
              value={checkInDate}
              onChangeText={setCheckInDate}
              placeholder="Fecha llegada"
              placeholderTextColor={COLORS.mutedText}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-out estimado</Text>
          <TextInput
            style={styles.input}
            value={checkOutDate}
            onChangeText={setCheckOutDate}
            placeholder="Fecha salida"
            placeholderTextColor={COLORS.mutedText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferencias de estancia o servicio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={preferences}
            onChangeText={setPreferences}
            placeholder="Ej: Doble juego de toallas, temperatura fresca, perchas extra..."
            placeholderTextColor={COLORS.mutedText}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Guardar Perfil y Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/login')}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Ya tengo reserva / Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.accent,
    letterSpacing: 4,
  },
  brandSubtitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: COLORS.mutedText,
    marginTop: 4,
    letterSpacing: 1,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 12,
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'web' ? 12 : 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  buttonPrimary: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 18,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.mutedText,
    fontSize: 14,
    fontWeight: '600',
  },
});
