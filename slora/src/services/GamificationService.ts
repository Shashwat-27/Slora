import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc, 
  increment, 
  arrayUnion, 
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
  where
} from 'firebase/firestore';
import { firestore } from '../firebase/config';

export interface UserStats {
  uid: string;
  username: string;
  displayName: string;
  photoURL: string;
  studyHours: number;
  totalSessions: number;
  xp: number;
  level: number;
  streak: number;
  lastActive: any;
  totalBadges: number;
  totalRoomsJoined: number;
  totalRoomsCreated: number;
  totalTasksCompleted: number;
  totalResourcesShared: number;
  joinDate: any;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  iconBg: string;
  requiredValue: number;
  type: 'streak' | 'studyHours' | 'roomsJoined' | 'tasksCompleted' | 'resourcesShared' | 'sessionsCompleted';
  isSecret?: boolean;
  xpReward: number;
}

export interface UserAchievement {
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt?: any;
  name: string;
  description: string;
  iconName: string;
  iconBg: string;
  type: string;
  requiredValue: number;
  xpReward: number;
}

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  level: number;
  xp: number;
  studyHours: number;
  streak: number;
  rank?: number;
}

// Define all achievements for the app
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak-7',
    name: 'Weekly Warrior',
    description: 'Study for 7 days in a row',
    iconName: 'calendar-check',
    iconBg: 'linear-gradient(45deg, #FF9800, #FF5722)',
    requiredValue: 7,
    type: 'streak',
    xpReward: 100
  },
  {
    id: 'streak-30',
    name: 'Consistency Champion',
    description: 'Study for 30 days in a row',
    iconName: 'trophy',
    iconBg: 'linear-gradient(45deg, #FFD700, #FFA500)',
    requiredValue: 30,
    type: 'streak',
    xpReward: 500
  },
  {
    id: 'hours-10',
    name: 'Dedicated Learner',
    description: 'Study for 10 hours total',
    iconName: 'clock',
    iconBg: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
    requiredValue: 10,
    type: 'studyHours',
    xpReward: 100
  },
  {
    id: 'hours-50',
    name: 'Study Master',
    description: 'Study for 50 hours total',
    iconName: 'star',
    iconBg: 'linear-gradient(45deg, #2196F3, #03A9F4)',
    requiredValue: 50,
    type: 'studyHours',
    xpReward: 300
  },
  {
    id: 'hours-100',
    name: 'Knowledge Titan',
    description: 'Study for 100 hours total',
    iconName: 'graduation-cap',
    iconBg: 'linear-gradient(45deg, #9C27B0, #673AB7)',
    requiredValue: 100,
    type: 'studyHours',
    xpReward: 500
  },
  {
    id: 'rooms-5',
    name: 'Explorer',
    description: 'Join 5 different study rooms',
    iconName: 'compass',
    iconBg: 'linear-gradient(45deg, #3F51B5, #2196F3)',
    requiredValue: 5,
    type: 'roomsJoined',
    xpReward: 100
  },
  {
    id: 'rooms-20',
    name: 'Knowledge Seeker',
    description: 'Join 20 different study rooms',
    iconName: 'book',
    iconBg: 'linear-gradient(45deg, #4F46E5, #7C3AED)',
    requiredValue: 20,
    type: 'roomsJoined',
    xpReward: 300
  },
  {
    id: 'tasks-10',
    name: 'Task Master',
    description: 'Complete 10 study tasks',
    iconName: 'check-square',
    iconBg: 'linear-gradient(45deg, #E91E63, #F44336)',
    requiredValue: 10,
    type: 'tasksCompleted',
    xpReward: 150
  },
  {
    id: 'resources-5',
    name: 'Resource Contributor',
    description: 'Share 5 resources with others',
    iconName: 'share-alt',
    iconBg: 'linear-gradient(45deg, #00BCD4, #00ACC1)',
    requiredValue: 5,
    type: 'resourcesShared',
    xpReward: 100
  },
  {
    id: 'sessions-20',
    name: 'Study Session Pro',
    description: 'Complete 20 study sessions',
    iconName: 'users',
    iconBg: 'linear-gradient(45deg, #795548, #5D4037)',
    requiredValue: 20,
    type: 'sessionsCompleted',
    xpReward: 200
  }
];

// Calculate level based on XP
const calculateLevel = (xp: number): number => {
  // Simple algorithm: Each level requires level*100 XP
  // Level 1: 0-100 XP
  // Level 2: 101-300 XP (100 + 200)
  // Level 3: 301-600 XP (100 + 200 + 300)
  
  let level = 1;
  let xpRequired = 100;
  let totalXpRequired = xpRequired;
  
  while (xp >= totalXpRequired) {
    level++;
    xpRequired = level * 100;
    totalXpRequired += xpRequired;
  }
  
  return level;
};

// Calculate XP needed for next level
const calculateXpForNextLevel = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  
  let totalXpRequired = 0;
  for (let i = 1; i <= currentLevel; i++) {
    totalXpRequired += i * 100;
  }
  
  return totalXpRequired;
};

class GamificationService {
  // Initialize user stats
  async initializeUserStats(userId: string, displayName: string, photoURL: string): Promise<UserStats> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        const now = serverTimestamp();
        const username = displayName.toLowerCase().replace(/\s/g, '');
        
        const initialStats: UserStats = {
          uid: userId,
          username,
          displayName,
          photoURL: photoURL || '',
          studyHours: 0,
          totalSessions: 0,
          xp: 0,
          level: 1,
          streak: 0,
          lastActive: now,
          totalBadges: 0,
          totalRoomsJoined: 0,
          totalRoomsCreated: 0,
          totalTasksCompleted: 0,
          totalResourcesShared: 0,
          joinDate: now
        };
        
        await setDoc(userStatsRef, initialStats);
        
        // Initialize achievements for the user
        await this.initializeAchievements(userId);
        
        return { ...initialStats, lastActive: new Date(), joinDate: new Date() };
      }
      
      return statsDoc.data() as UserStats;
    } catch (error) {
      console.error('Error initializing user stats:', error);
      throw error;
    }
  }
  
  // Initialize achievements for a user
  private async initializeAchievements(userId: string): Promise<void> {
    try {
      const userAchievementsRef = doc(firestore, 'userAchievements', userId);
      const achievementsDoc = await getDoc(userAchievementsRef);
      
      if (!achievementsDoc.exists()) {
        const userAchievements: { [achievementId: string]: UserAchievement } = {};
        
        ACHIEVEMENTS.forEach(achievement => {
          userAchievements[achievement.id] = {
            achievementId: achievement.id,
            progress: 0,
            completed: false,
            name: achievement.name,
            description: achievement.description,
            iconName: achievement.iconName,
            iconBg: achievement.iconBg,
            type: achievement.type,
            requiredValue: achievement.requiredValue,
            xpReward: achievement.xpReward
          };
        });
        
        await setDoc(userAchievementsRef, { achievements: userAchievements });
      }
    } catch (error) {
      console.error('Error initializing achievements:', error);
      throw error;
    }
  }
  
  // Get user stats
  async getUserStats(userId: string): Promise<UserStats | null> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (statsDoc.exists()) {
        return statsDoc.data() as UserStats;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
  
  // Get user achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const userAchievementsRef = doc(firestore, 'userAchievements', userId);
      const achievementsDoc = await getDoc(userAchievementsRef);
      
      if (achievementsDoc.exists() && achievementsDoc.data().achievements) {
        const achievementsMap = achievementsDoc.data().achievements;
        return Object.values(achievementsMap) as UserAchievement[];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting user achievements:', error);
      return [];
    }
  }
  
  // Get in-progress achievements
  async getInProgressAchievements(userId: string): Promise<UserAchievement[]> {
    const achievements = await this.getUserAchievements(userId);
    return achievements
      .filter(a => !a.completed && a.progress > 0)
      .sort((a, b) => (b.progress / b.requiredValue) - (a.progress / a.requiredValue));
  }
  
  // Add XP to user
  async addXP(userId: string, xpAmount: number, reason: string): Promise<{ newXP: number, leveledUp: boolean, newLevel?: number }> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      const currentStats = statsDoc.data() as UserStats;
      const oldLevel = currentStats.level;
      const newXP = currentStats.xp + xpAmount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > oldLevel;
      
      // Update user stats
      await updateDoc(userStatsRef, {
        xp: newXP,
        level: newLevel,
        lastActive: serverTimestamp()
      });
      
      // Log XP gain
      await setDoc(doc(firestore, 'xpLogs', `${userId}_${Date.now()}`), {
        userId,
        amount: xpAmount,
        reason,
        timestamp: serverTimestamp(),
        newTotal: newXP,
        levelUp: leveledUp,
        newLevel: leveledUp ? newLevel : null
      });
      
      return {
        newXP,
        leveledUp,
        newLevel: leveledUp ? newLevel : undefined
      };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }
  
  // Record study session
  async recordStudySession(userId: string, durationMinutes: number): Promise<void> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      const currentStats = statsDoc.data() as UserStats;
      const hours = durationMinutes / 60;
      
      // Update user stats
      await updateDoc(userStatsRef, {
        studyHours: increment(hours),
        totalSessions: increment(1),
        lastActive: serverTimestamp()
      });
      
      // Add XP for studying (10 XP per hour)
      const xpEarned = Math.floor(hours * 10);
      if (xpEarned > 0) {
        await this.addXP(userId, xpEarned, 'Study session completed');
      }
      
      // Update achievements
      await this.updateAchievements(userId, {
        studyHours: currentStats.studyHours + hours,
        sessionsCompleted: currentStats.totalSessions + 1
      });
      
      // Update streak
      await this.checkAndUpdateStreak(userId);
    } catch (error) {
      console.error('Error recording study session:', error);
      throw error;
    }
  }
  
  // Check and update user streak
  async checkAndUpdateStreak(userId: string): Promise<number> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      const currentStats = statsDoc.data() as UserStats;
      const lastActive = currentStats.lastActive?.toDate() || new Date(0);
      const now = new Date();
      
      // Check if last active was yesterday
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastActiveDay = lastActive.setHours(0, 0, 0, 0);
      const yesterdayDay = yesterday.setHours(0, 0, 0, 0);
      const todayDay = now.setHours(0, 0, 0, 0);
      
      let newStreak = currentStats.streak;
      
      // If last active was yesterday, increment streak
      if (lastActiveDay === yesterdayDay) {
        newStreak += 1;
      } 
      // If last active was today, keep streak the same
      else if (lastActiveDay === todayDay) {
        // Do nothing, streak stays the same
      } 
      // Otherwise, streak breaks unless it's the same day
      else {
        newStreak = 1; // Reset to 1 for today
      }
      
      // Update streak in user stats
      await updateDoc(userStatsRef, {
        streak: newStreak,
        lastActive: serverTimestamp()
      });
      
      // Update streak achievements
      await this.updateAchievements(userId, { streak: newStreak });
      
      return newStreak;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }
  
  // Record task completion
  async recordTaskCompletion(userId: string): Promise<void> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      const currentStats = statsDoc.data() as UserStats;
      
      // Update user stats
      await updateDoc(userStatsRef, {
        totalTasksCompleted: increment(1),
        lastActive: serverTimestamp()
      });
      
      // Add XP for completing a task (5 XP per task)
      await this.addXP(userId, 5, 'Task completed');
      
      // Update achievements
      await this.updateAchievements(userId, {
        tasksCompleted: currentStats.totalTasksCompleted + 1
      });
    } catch (error) {
      console.error('Error recording task completion:', error);
      throw error;
    }
  }
  
  // Record resource sharing
  async recordResourceShared(userId: string): Promise<void> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      const currentStats = statsDoc.data() as UserStats;
      
      // Update user stats
      await updateDoc(userStatsRef, {
        totalResourcesShared: increment(1),
        lastActive: serverTimestamp()
      });
      
      // Add XP for sharing a resource (5 XP per resource)
      await this.addXP(userId, 5, 'Resource shared');
      
      // Update achievements
      await this.updateAchievements(userId, {
        resourcesShared: currentStats.totalResourcesShared + 1
      });
    } catch (error) {
      console.error('Error recording resource shared:', error);
      throw error;
    }
  }
  
  // Record room join
  async recordRoomJoined(userId: string): Promise<void> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      const currentStats = statsDoc.data() as UserStats;
      
      // Update user stats
      await updateDoc(userStatsRef, {
        totalRoomsJoined: increment(1),
        lastActive: serverTimestamp()
      });
      
      // Add XP for joining a room (3 XP per room)
      await this.addXP(userId, 3, 'Room joined');
      
      // Update achievements
      await this.updateAchievements(userId, {
        roomsJoined: currentStats.totalRoomsJoined + 1
      });
    } catch (error) {
      console.error('Error recording room joined:', error);
      throw error;
    }
  }
  
  // Record room creation
  async recordRoomCreated(userId: string): Promise<void> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        throw new Error('User stats not found');
      }
      
      // Update user stats
      await updateDoc(userStatsRef, {
        totalRoomsCreated: increment(1),
        lastActive: serverTimestamp()
      });
      
      // Add XP for creating a room (10 XP per room)
      await this.addXP(userId, 10, 'Room created');
    } catch (error) {
      console.error('Error recording room created:', error);
      throw error;
    }
  }
  
  // Update achievements based on user activity
  private async updateAchievements(
    userId: string, 
    stats: { 
      streak?: number, 
      studyHours?: number, 
      roomsJoined?: number, 
      tasksCompleted?: number, 
      resourcesShared?: number, 
      sessionsCompleted?: number 
    }
  ): Promise<string[]> {
    try {
      const userAchievementsRef = doc(firestore, 'userAchievements', userId);
      const achievementsDoc = await getDoc(userAchievementsRef);
      
      if (!achievementsDoc.exists()) {
        await this.initializeAchievements(userId);
        return [];
      }
      
      const achievementsMap = achievementsDoc.data().achievements as { [achievementId: string]: UserAchievement };
      const completedAchievements: string[] = [];
      
      // Check each achievement for progress updates
      for (const achievement of ACHIEVEMENTS) {
        if (!achievementsMap[achievement.id]) continue;
        if (achievementsMap[achievement.id].completed) continue;
        
        let progress = 0;
        
        // Update progress based on achievement type
        switch (achievement.type) {
          case 'streak':
            if (stats.streak !== undefined) {
              progress = stats.streak;
            }
            break;
          case 'studyHours':
            if (stats.studyHours !== undefined) {
              progress = stats.studyHours;
            }
            break;
          case 'roomsJoined':
            if (stats.roomsJoined !== undefined) {
              progress = stats.roomsJoined;
            }
            break;
          case 'tasksCompleted':
            if (stats.tasksCompleted !== undefined) {
              progress = stats.tasksCompleted;
            }
            break;
          case 'resourcesShared':
            if (stats.resourcesShared !== undefined) {
              progress = stats.resourcesShared;
            }
            break;
          case 'sessionsCompleted':
            if (stats.sessionsCompleted !== undefined) {
              progress = stats.sessionsCompleted;
            }
            break;
        }
        
        // If we have updated progress
        if (progress > 0) {
          achievementsMap[achievement.id].progress = progress;
          
          // Check if achievement is completed
          if (progress >= achievement.requiredValue && !achievementsMap[achievement.id].completed) {
            achievementsMap[achievement.id].completed = true;
            achievementsMap[achievement.id].completedAt = serverTimestamp();
            completedAchievements.push(achievement.id);
            
            // Award XP for completed achievement
            await this.addXP(userId, achievement.xpReward, `Achievement unlocked: ${achievement.name}`);
            
            // Update total badges count
            await updateDoc(doc(firestore, 'userStats', userId), {
              totalBadges: increment(1)
            });
          }
        }
      }
      
      // Update achievements in Firestore
      await updateDoc(userAchievementsRef, { achievements: achievementsMap });
      
      return completedAchievements;
    } catch (error) {
      console.error('Error updating achievements:', error);
      return [];
    }
  }
  
  // Get global leaderboard
  async getGlobalLeaderboard(limitCount: number = 10): Promise<LeaderboardEntry[]> {
    try {
      const leaderboardQuery = query(
        collection(firestore, 'userStats'),
        orderBy('xp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(leaderboardQuery);
      const leaderboard: LeaderboardEntry[] = [];
      
      snapshot.docs.forEach((doc, index) => {
        const userData = doc.data() as UserStats;
        leaderboard.push({
          uid: userData.uid,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          level: userData.level,
          xp: userData.xp,
          studyHours: userData.studyHours,
          streak: userData.streak,
          rank: index + 1
        });
      });
      
      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }
  
  // Get user's leaderboard rank
  async getUserRank(userId: string): Promise<number> {
    try {
      const userStatsRef = doc(firestore, 'userStats', userId);
      const statsDoc = await getDoc(userStatsRef);
      
      if (!statsDoc.exists()) {
        return 0;
      }
      
      const userXP = statsDoc.data().xp;
      
      // Count users with higher XP
      const higherXPQuery = query(
        collection(firestore, 'userStats'),
        where('xp', '>', userXP)
      );
      
      const snapshot = await getDocs(higherXPQuery);
      
      // Rank is number of users with higher XP + 1
      return snapshot.size + 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return 0;
    }
  }
  
  // Get XP needed for next level
  getXpForNextLevel(currentXp: number): number {
    return calculateXpForNextLevel(currentXp);
  }
  
  // Calculate XP progress
  calculateXpProgress(currentXp: number): number {
    const level = calculateLevel(currentXp);
    const xpForCurrentLevel = calculateXpForNextLevel(currentXp) - (level * 100);
    const totalXpForLevel = level * 100;
    
    return (xpForCurrentLevel / totalXpForLevel) * 100;
  }
}

export default new GamificationService(); 