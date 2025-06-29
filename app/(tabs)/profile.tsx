import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Trophy, Target, Calendar, RotateCcw, Settings, Award } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserStats {
  totalPoints: number;
  sessionsCompleted: number;
  plantLevel: number;
  tasksCompleted: number;
  totalSessionTime: number;
  streak: number;
  lastSessionDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  type: 'points' | 'sessions' | 'tasks' | 'streak';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Primer Paso',
    description: 'Completa tu primera sesión',
    icon: '🌱',
    unlocked: false,
    requirement: 1,
    type: 'sessions'
  },
  {
    id: '2',
    title: 'Constancia',
    description: 'Completa 5 sesiones',
    icon: '🌿',
    unlocked: false,
    requirement: 5,
    type: 'sessions'
  },
  {
    id: '3',
    title: 'Experto',
    description: 'Completa 20 sesiones',
    icon: '🌳',
    unlocked: false,
    requirement: 20,
    type: 'sessions'
  },
  {
    id: '4',
    title: 'Coleccionista',
    description: 'Acumula 100 puntos',
    icon: '⭐',
    unlocked: false,
    requirement: 100,
    type: 'points'
  },
  {
    id: '5',
    title: 'Maestro de Tareas',
    description: 'Completa 50 tareas',
    icon: '🎯',
    unlocked: false,
    requirement: 50,
    type: 'tasks'
  },
  {
    id: '6',
    title: 'Imparable',
    description: 'Mantén una racha de 7 días',
    icon: '🔥',
    unlocked: false,
    requirement: 7,
    type: 'streak'
  }
];

export default function ProfileScreen() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    sessionsCompleted: 0,
    plantLevel: 1,
    tasksCompleted: 0,
    totalSessionTime: 0,
    streak: 0,
    lastSessionDate: '',
  });
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const stats = await AsyncStorage.getItem('userStats');
      const savedAchievements = await AsyncStorage.getItem('achievements');
      
      if (stats) {
        const parsedStats = JSON.parse(stats);
        setUserStats(parsedStats);
        
        // Update achievements based on stats
        const updatedAchievements = achievements.map(achievement => {
          const statValue = parsedStats[achievement.type === 'sessions' ? 'sessionsCompleted' : 
                                      achievement.type === 'points' ? 'totalPoints' :
                                      achievement.type === 'tasks' ? 'tasksCompleted' : 'streak'];
          return {
            ...achievement,
            unlocked: statValue >= achievement.requirement
          };
        });
        setAchievements(updatedAchievements);
      }
      
      if (savedAchievements) {
        setAchievements(JSON.parse(savedAchievements));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const resetAllData = () => {
    Alert.alert(
      'Reiniciar Datos',
      '¿Estás seguro de que quieres reiniciar todos tus datos? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['userStats', 'achievements', 'cafeTasks']);
              setUserStats({
                totalPoints: 0,
                sessionsCompleted: 0,
                plantLevel: 1,
                tasksCompleted: 0,
                totalSessionTime: 0,
                streak: 0,
                lastSessionDate: '',
              });
              setAchievements(ACHIEVEMENTS.map(a => ({ ...a, unlocked: false })));
              Alert.alert('Datos Reiniciados', 'Todos tus datos han sido reiniciados exitosamente.');
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'No se pudieron reiniciar los datos.');
            }
          },
        },
      ]
    );
  };

  const getPlantEmoji = (level: number) => {
    if (level <= 1) return '🌱';
    if (level <= 3) return '🌿';
    if (level <= 5) return '🪴';
    return '🌳';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Mi Perfil</Text>
          <Text style={styles.subtitle}>Progreso y logros</Text>
        </View>

        <View style={styles.plantContainer}>
          <Text style={styles.plantEmoji}>{getPlantEmoji(userStats.plantLevel)}</Text>
          <Text style={styles.plantLevel}>Nivel {userStats.plantLevel}</Text>
          <Text style={styles.plantDescription}>
            Tu planta crece con cada logro. ¡Sigue así!
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Trophy size={28} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.totalPoints}</Text>
            <Text style={styles.statLabel}>Puntos Totales</Text>
          </View>
          <View style={styles.statCard}>
            <Target size={28} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.sessionsCompleted}</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={28} color="#10B981" strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.streak}</Text>
            <Text style={styles.statLabel}>Días Seguidos</Text>
          </View>
          <View style={styles.statCard}>
            <Settings size={28} color="#8B5CF6" strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.tasksCompleted}</Text>
            <Text style={styles.statLabel}>Tareas</Text>
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Logros</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  achievement.unlocked && styles.achievementUnlocked
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked && styles.achievementTitleUnlocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    achievement.unlocked && styles.achievementDescriptionUnlocked
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.unlocked && (
                  <Award size={20} color="#10B981" strokeWidth={2} />
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Próximo Objetivo</Text>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Puntos para siguiente nivel de planta</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${Math.min((userStats.totalPoints % 50) / 50 * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {userStats.totalPoints % 50}/50 puntos
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetAllData}
            activeOpacity={0.8}
          >
            <RotateCcw size={20} color="#EF4444" strokeWidth={2} />
            <Text style={styles.resetButtonText}>Reiniciar Todos los Datos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerMessage}>
          <Text style={styles.footerText}>
            ¡Recuerda que cada pequeño paso cuenta! Tu progreso es evidencia 
            de tu dedicación y esfuerzo. 🌟
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
  plantContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  plantEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  plantLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  plantDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsContainer: {
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
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    opacity: 0.6,
  },
  achievementUnlocked: {
    backgroundColor: '#D1FAE5',
    opacity: 1,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
  },
  achievementTitleUnlocked: {
    color: '#1F2937',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  achievementDescriptionUnlocked: {
    color: '#6B7280',
  },
  progressContainer: {
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
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressCard: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
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
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  resetButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
  },
  footerMessage: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  footerText: {
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
  },
});