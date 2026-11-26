import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Dashboard de Habitación' }} />
        <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
        <Stack.Screen name="register" options={{ title: 'Nuevo Perfil Huésped' }} />
        <Stack.Screen name="profile" options={{ title: 'Perfil de Huésped' }} />
      </Stack>
    </AuthProvider>
  );
}
