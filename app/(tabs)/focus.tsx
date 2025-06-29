import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Focus, Shield, MessageCircle, Volume2, VolumeX } from 'lucide-react-native';

const MOTIVATIONAL_MESSAGES = [
  "¡Estás haciendo un trabajo excelente! 💪",
  "Un paso a la vez, lo estás logrando 🌟",
  "Mantén el foco, ya casi terminas ✨",
  "Cada tarea completada es un logro 🎯",
  "Tu dedicación es admirable 👏",
  "¡Sigue así, vas por buen camino! 🚀",
  "Respira profundo y continúa 🧘‍♂️",
  "Eres más fuerte de lo que crees 💪",
  "El progreso es progreso, sin importar qué tan pequeño 📈",
  "¡Tu esfuerzo vale la pena! 🌈"
];

const FOCUS_TIPS = [
  {
    title: "Respira Profundo",
    tip: "Toma 3 respiraciones profundas antes de comenzar cada tarea"
  },
  {
    title: "Una Cosa a la Vez",
    tip: "Enfócate solo en la tarea actual, no pienses en las siguientes"
  },
  {
    title: "Usa el Timer",
    tip: "El timer de 30 minutos te ayuda a mantener el ritmo perfecto"
  },
  {
    title: "Celebra Pequeños Logros",
    tip: "Cada tarea completada merece un momento de reconocimiento"
  },
  {
    title: "Toma Descansos",
    tip: "Si te sientes abrumado, toma una pausa de 2-3 minutos"
  }
];

export default function FocusScreen() {
  const [focusModeActive, setFocusModeActive] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusModeActive) {
      interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
      }, 30000); // Change message every 30 seconds
    }
    return () => clearInterval(interval);
  }, [focusModeActive]);

  const toggleFocusMode = () => {
    setFocusModeActive(!focusModeActive);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Modo Enfoque</Text>
          <Text style={styles.subtitle}>Herramientas para mantener la concentración</Text>
        </View>

        <View style={styles.focusModeContainer}>
          <View style={styles.focusModeHeader}>
            <Shield size={32} color={focusModeActive ? "#10B981" : "#6B7280"} strokeWidth={2} />
            <View style={styles.focusModeInfo}>
              <Text style={styles.focusModeTitle}>
                Modo Enfoque {focusModeActive ? "Activo" : "Inactivo"}
              </Text>
              <Text style={styles.focusModeDescription}>
                {focusModeActive 
                  ? "Recibiendo mensajes motivacionales cada 30 segundos"
                  : "Activa para recibir mensajes de apoyo y motivación"
                }
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.focusButton, focusModeActive && styles.focusButtonActive]}
            onPress={toggleFocusMode}
            activeOpacity={0.8}
          >
            <Focus size={24} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.focusButtonText}>
              {focusModeActive ? "Desactivar" : "Activar"} Modo Enfoque
            </Text>
          </TouchableOpacity>
        </View>

        {focusModeActive && (
          <View style={styles.motivationContainer}>
            <MessageCircle size={24} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.motivationMessage}>
              {MOTIVATIONAL_MESSAGES[currentMessage]}
            </Text>
          </View>
        )}

        <View style={styles.settingsContainer}>
          <Text style={styles.settingsTitle}>Configuración</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setSoundEnabled(!soundEnabled)}
            activeOpacity={0.8}
          >
            <View style={styles.settingInfo}>
              {soundEnabled ? (
                <Volume2 size={24} color="#6B7280" strokeWidth={2} />
              ) : (
                <VolumeX size={24} color="#6B7280" strokeWidth={2} />
              )}
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Sonidos de Notificación</Text>
                <Text style={styles.settingDescription}>
                  {soundEnabled ? "Activado" : "Desactivado"}
                </Text>
              </View>
            </View>
            <View style={[styles.toggle, soundEnabled && styles.toggleActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Consejos para Mantener el Foco</Text>
          
          {FOCUS_TIPS.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementTitle}>Recuerda</Text>
          <Text style={styles.encouragementText}>
            Tu cerebro ADHD es único y poderoso. Estas herramientas están diseñadas 
            específicamente para ayudarte a aprovechar tus fortalezas naturales. 
            ¡Confía en el proceso y en ti mismo! 🧠✨
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  focusModeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  focusModeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  focusModeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  focusModeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  focusModeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  focusButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  focusButtonActive: {
    backgroundColor: '#10B981',
  },
  focusButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  motivationContainer: {
    backgroundColor: '#EFF6FF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  motivationMessage: {
    fontSize: 18,
    color: '#1E40AF',
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#8B5CF6',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  encouragementContainer: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 16,
    color: '#78350F',
    lineHeight: 24,
  },
});