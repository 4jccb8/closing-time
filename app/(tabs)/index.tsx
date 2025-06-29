import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Play, Pause, RotateCcw, Trophy, Sprout } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStats {
  totalPoints: number;
  sessionsCompleted: number;
  plantLevel: number;
}

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    sessionsCompleted: 0,
    plantLevel: 1,
  });

  useEffect(() => {
    loadUserStats();
    checkOnboarding();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const checkOnboarding = async () => {
    try {
      const hasCompleted = await AsyncStorage.getItem('hasCompletedOnboarding');
      if (!hasCompleted) {
        router.replace('/onboarding');
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('userStats');
      if (stats) {
        setUserStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const saveUserStats = async (newStats: UserStats) => {
    try {
      await AsyncStorage.setItem('userStats', JSON.stringify(newStats));
      setUserStats(newStats);
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  };

  const handleSessionComplete = async () => {
    const newStats = {
      ...userStats,
      totalPoints: userStats.totalPoints + 10,
      sessionsCompleted: userStats.sessionsCompleted + 1,
      plantLevel: Math.floor((userStats.totalPoints + 10) / 50) + 1,
    };
    await saveUserStats(newStats);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isRunning) {
      router.push('/tasks');
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(30 * 60);
    setIsRunning(false);
  };

  const getPlantEmoji = (level: number) => {
    if (level <= 1) return '🌱';
    if (level <= 3) return '🌿';
    if (level <= 5) return '🪴';
    return '🌳';
  };

  const progress = ((30 * 60 - timeLeft) / (30 * 60)) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>¡Hola! 👋</Text>
          <Text style={styles.subtitle}>Listo para cerrar Nick's Café</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>Puntos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.plantEmoji}>{getPlantEmoji(userStats.plantLevel)}</Text>
            <Text style={styles.statNumber}>Nivel {userStats.plantLevel}</Text>
            <Text style={styles.statLabel}>Tu Planta</Text>
          </View>
          <View style={styles.statCard}>
            <Sprout size={24} color="#10B981" strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>minutos restantes</Text>
          </View>
          
          {progress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}% completado</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.playButton, isRunning && styles.pauseButton]}
            onPress={toggleTimer}
            activeOpacity={0.8}
          >
            {isRunning ? (
              <Pause size={32} color="#FFFFFF" strokeWidth={2} />
            ) : (
              <Play size={32} color="#FFFFFF" strokeWidth={2} />
            )}
            <Text style={styles.playButtonText}>
              {isRunning ? 'Pausar' : 'Comenzar Sesión'}
            </Text>
          </TouchableOpacity>

          {(isRunning || timeLeft < 30 * 60) && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetTimer}
              activeOpacity={0.8}
            >
              <RotateCcw size={24} color="#6B7280" strokeWidth={2} />
              <Text style={styles.resetButtonText}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.motivationContainer}>
          <Text style={styles.motivationText}>
            {isRunning 
              ? "¡Excelente! Mantén el ritmo 💪" 
              : "¡Estás listo para una nueva sesión! 🚀"
            }
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  plantEmoji: {
    fontSize: 24,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  timerLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: '#10B981',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  pauseButton: {
    backgroundColor: '#F59E0B',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  motivationContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  motivationText: {
    fontSize: 16,
    color: '#1E40AF',
    textAlign: 'center',
    fontWeight: '500',
  },
});