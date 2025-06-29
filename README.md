# Closing Time - ADHD-Friendly Task Management App

A React Native mobile application designed specifically for ADHD users to help manage café closing tasks at Nick's Café. Built with Expo and focused on accessibility, gamification, and maintaining focus.

## Features

### Core Functionality
- **30-Minute Timer**: Activates when starting a session and tracks progress
- **Task Chunking**: Break down café closing duties into manageable, trackable tasks
- **Progress Visualization**: Real-time progress bar showing completion percentage
- **Offline Storage**: All data stored locally using AsyncStorage

### ADHD-Friendly Design
- **High Contrast UI**: Clear visual hierarchy with accessible color schemes
- **Large Touch Targets**: 16pt+ fonts and generous button sizes
- **Minimal Animations**: Purposeful, non-distracting visual feedback
- **Encouraging Messaging**: Positive reinforcement throughout the experience

### Gamification Elements
- **Point System**: Earn 10 points per completed session
- **Virtual Plant**: Grows with accumulated points and achievements
- **Achievement System**: Unlock badges for various milestones
- **Streak Tracking**: Monitor consecutive days of task completion

### Focus Tools
- **Focus Mode**: Toggle motivational messages and distraction blocking
- **Breathing Reminders**: Built-in mindfulness prompts
- **Session Management**: Clear start/stop controls with visual feedback

## Task Categories

The app includes comprehensive closing tasks for Nick's Café:

1. **Salón** - Dining area cleaning and maintenance
2. **Barra** - Bar area dishwashing and surface cleaning
3. **Máquina** - Coffee machine detailed cleaning procedures
4. **Comida** - Food storage and organization
5. **Baño** - Bathroom maintenance
6. **Caja** - Cash register closing procedures
7. **Cierre** - Final security and closing steps

## Navigation Structure

- **Inicio (Home)**: Timer, progress overview, and session management
- **Tareas (Tasks)**: Complete task list with progress tracking
- **Enfoque (Focus)**: Focus tools and motivational features
- **Perfil (Profile)**: Statistics, achievements, and data management

## Technical Implementation

### Platform Support
- **Primary**: Web (React Native Web)
- **Target**: iOS and Android mobile devices
- **Offline First**: All functionality works without internet connection

### Data Persistence
- **AsyncStorage**: Local storage for user progress and preferences
- **JSON Structure**: Simple, readable data format
- **Reset Capability**: Complete data reset option for fresh starts

### Accessibility Features
- **Screen Reader Support**: Semantic markup and proper labeling
- **High Contrast**: Ensures readability for users with visual differences
- **Large Touch Targets**: Minimum 44px tap areas following accessibility guidelines
- **Clear Navigation**: Logical tab-based structure with consistent patterns

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open in your browser or scan QR code with Expo Go app

## Design Philosophy

This app is built specifically for ADHD users with these principles:

- **Simplicity Over Complexity**: Essential features only, no overwhelming options
- **Immediate Feedback**: Visual and textual confirmation of all actions
- **Progressive Disclosure**: Information revealed as needed, not all at once
- **Positive Reinforcement**: Celebration of progress, no matter how small
- **Consistency**: Predictable patterns and layouts throughout the app

## Future Enhancements

- **Notification System**: Gentle reminders and session alerts
- **Custom Task Lists**: Ability to modify or add tasks
- **Data Export**: Share progress reports and statistics
- **Sync Capabilities**: Optional cloud backup for multiple devices
- **Voice Commands**: Hands-free task completion confirmation

## Support

This app is designed to be intuitive and self-explanatory. All features include helpful explanations and the onboarding process introduces key concepts.

For ADHD users, remember:
- One task at a time
- Progress over perfection
- Celebrate small wins
- Use the timer as your anchor
- Trust the process

---

Built with ❤️ for the ADHD community and Nick's Café team.