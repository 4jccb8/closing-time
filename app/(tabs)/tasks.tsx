import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { CircleCheck as CheckCircle, Circle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
}

const CAFE_TASKS: Omit<Task, 'completed'>[] = [
  {
    id: '1',
    title: 'Sector Salón',
    description: 'Revisar que las mesas no queden con migas o sucias, barrer y pasar el trapo (no hace falta que quede perfecto, con quitar las manchas está bien)',
    category: 'salon',
  },
  {
    id: '2',
    title: 'Lavar y Secar Vajilla',
    description: 'Lavar y secar: platos, vasos, cubiertos y guardar en sus lugares (menos la pinza, espátula verde y la espátula rosa que pueden quedar en el cubiertero)',
    category: 'barra',
  },
  {
    id: '3',
    title: 'Limpiar la Barra',
    description: 'Limpiar la barra sacando manchas de café y migas, lavar fuente negra del horno',
    category: 'barra',
  },
  {
    id: '4',
    title: 'Limpiar la Máquina de Café',
    description: 'Cepillo primero, luego polvo delatazza (con filtro ciego presionar botón de arriba + el de costado izquierdo), limpiar rejilla y parte frontal con servilleta',
    category: 'maquina',
  },
  {
    id: '5',
    title: 'Limpiar Blem de la Cafetera',
    description: 'Limpiar el blem que está abajo de la cafetera con las cosas de limpieza (frasquito spray chico marrón)',
    category: 'maquina',
  },
  {
    id: '6',
    title: 'Guardar Comida en Tuppers',
    description: 'Tupper grande: croissant, alfajorcitos y muffins. Tupper alargado: scones de queso. Tupper restante: medialunas de manteca de un lado, multirgrano del otro',
    category: 'comida',
  },
  {
    id: '7',
    title: 'Basura y Limpieza Final Barra',
    description: 'Sacar la basura, barrer y pasar el trapo sacando las manchas del piso del sector barra (lo último)',
    category: 'barra',
  },
  {
    id: '8',
    title: 'Limpiar el Baño',
    description: 'Repasar tranquilo con lisoform el inodoro y el lavamanos, cambiar la basura, pasar el trapo',
    category: 'baño',
  },
  {
    id: '9',
    title: 'Cierre de Caja',
    description: 'Realizar el cierre de caja del día',
    category: 'caja',
  },
  {
    id: '10',
    title: 'Apagar el Aire',
    description: 'Apagar el aire acondicionado',
    category: 'cierre',
  },
  {
    id: '11',
    title: 'Poner la Alarma',
    description: 'XXXX✓ esa es la clave, tocar despacio cada botón medio pausadito, no hacerlo rápido',
    category: 'cierre',
  },
  {
    id: '12',
    title: 'Cierre Final',
    description: 'Apagar las luces, cerrar con llave y listo',
    category: 'cierre',
  },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    setCompletedCount(completed);
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('cafeTasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      } else {
        const initialTasks = CAFE_TASKS.map(task => ({ ...task, completed: false }));
        setTasks(initialTasks);
        await AsyncStorage.setItem('cafeTasks', JSON.stringify(initialTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'No se pudieron cargar las tareas');
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('cafeTasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      Alert.alert('Error', 'No se pudieron guardar las tareas');
    }
  };

  const toggleTask = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const resetTasks = async () => {
    Alert.alert(
      'Reiniciar Tareas',
      '¿Estás seguro de que quieres reiniciar todas las tareas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Reiniciar',
          style: 'destructive',
          onPress: async () => {
            const resetTasks = tasks.map(task => ({ ...task, completed: false }));
            setTasks(resetTasks);
            await saveTasks(resetTasks);
          },
        },
      ]
    );
  };

  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const getCategoryColor = (category: string) => {
    const colors = {
      salon: '#8B5CF6',
      barra: '#3B82F6',
      maquina: '#10B981',
      comida: '#F59E0B',
      baño: '#EF4444',
      caja: '#6366F1',
      cierre: '#1F2937',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const getCategoryName = (category: string) => {
    const names = {
      salon: 'Salón',
      barra: 'Barra',
      maquina: 'Máquina',
      comida: 'Comida',
      baño: 'Baño',
      caja: 'Caja',
      cierre: 'Cierre',
    };
    return names[category as keyof typeof names] || category;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas de Cierre</Text>
        <Text style={styles.subtitle}>Nick's Café</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount} de {tasks.length} tareas completadas ({Math.round(progressPercentage)}%)
          </Text>
        </View>

        {progressPercentage === 100 && (
          <View style={styles.completionBanner}>
            <Text style={styles.completionText}>🎉 ¡Excelente trabajo! Has completado todas las tareas</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.taskList} contentContainerStyle={styles.taskListContent}>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.taskCard, task.completed && styles.completedTask]}
            onPress={() => toggleTask(task.id)}
            activeOpacity={0.8}
          >
            <View style={styles.taskHeader}>
              <View style={styles.taskTitleContainer}>
                {task.completed ? (
                  <CheckCircle size={24} color="#10B981" strokeWidth={2} />
                ) : (
                  <Circle size={24} color="#9CA3AF" strokeWidth={2} />
                )}
                <Text style={[styles.taskTitle, task.completed && styles.completedTaskTitle]}>
                  {task.title}
                </Text>
              </View>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) }]}>
                <Text style={styles.categoryText}>{getCategoryName(task.category)}</Text>
              </View>
            </View>
            <Text style={[styles.taskDescription, task.completed && styles.completedTaskDescription]}>
              {task.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetTasks}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>Reiniciar Todas las Tareas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  completionBanner: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  completionText: {
    fontSize: 16,
    color: '#065F46',
    fontWeight: '600',
    textAlign: 'center',
  },
  taskList: {
    flex: 1,
  },
  taskListContent: {
    padding: 20,
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTask: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
  },
  completedTaskTitle: {
    color: '#059669',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 22,
    marginLeft: 36,
  },
  completedTaskDescription: {
    color: '#6B7280',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  resetButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});