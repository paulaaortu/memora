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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !roomNumber.trim()) {
      setError('Por favor, introduce tu email y número de habitación.');
      return;
    }
    setError('');
    login(email.trim(), roomNumber.trim());
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
          <Text style={styles.brandSubtitle}>Gestión Personalizada de Habitación</Text>
        </View>

        <Text style={styles.welcomeText}>Acceso Huésped</Text>
        <Text style={styles.instructionText}>
          Ingresa tus credenciales de reserva para organizar la ubicación de tus pertenencias.
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="ejemplo@hotel.com"
            placeholderTextColor={COLORS.mutedText}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número de Habitación</Text>
          <TextInput
            style={styles.input}
            value={roomNumber}
            onChangeText={setRoomNumber}
            placeholder="Ej: 304"
            placeholderTextColor={COLORS.mutedText}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Entrar a Mi Habitación</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>¿Es tu primera estancia?</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => router.push('/register')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonSecondaryText}>Registrar Nuevo Perfil de Huésped</Text>
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
    maxWidth: 440,
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
    marginBottom: 24,
  },
  brandTitle: {
    fontSize: 28,
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
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.mutedText,
    lineHeight: 20,
    marginBottom: 20,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 12,
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
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
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: '#FAFAFA',
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: COLORS.mutedText,
  },
  buttonSecondary: {
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});
