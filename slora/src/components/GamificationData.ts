// Mock data for the gamification system

// User badges data
export const userBadges = [
  {
    id: 1,
    name: "Early Adopter",
    icon: "bi-rocket",
    description: "Joined during beta period",
    earned: true,
    earnedDate: "May 5, 2023"
  },
  {
    id: 2,
    name: "Room Creator",
    icon: "bi-plus-circle",
    description: "Created your first room",
    earned: true,
    earnedDate: "May 7, 2023"
  },
  {
    id: 3,
    name: "Conversation Starter",
    icon: "bi-chat-dots",
    description: "Started 10 discussions",
    earned: true,
    earnedDate: "May 15, 2023"
  },
  {
    id: 4,
    name: "Collaborator",
    icon: "bi-people",
    description: "Participated in 5 different rooms",
    earned: true,
    earnedDate: "May 20, 2023"
  },
  {
    id: 5,
    name: "Networker",
    icon: "bi-diagram-3",
    description: "Connected with 20 other users",
    earned: false
  },
  {
    id: 6,
    name: "Mentor",
    icon: "bi-mortarboard",
    description: "Helped 10 users with their questions",
    earned: false
  },
  {
    id: 7,
    name: "Power User",
    icon: "bi-lightning-charge",
    description: "Used the platform for 30 days straight",
    earned: false
  },
  {
    id: 8,
    name: "Content Creator",
    icon: "bi-file-earmark-text",
    description: "Shared 15 resources",
    earned: false
  }
];

// Leaderboard data
export const leaderboardData = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    xp: 2450,
    level: 12,
    rank: 1
  },
  {
    id: 2,
    name: "Sara Williams",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    xp: 2280,
    level: 11,
    rank: 2
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    xp: 2150,
    level: 11,
    rank: 3
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    xp: 1920,
    level: 10,
    rank: 4
  },
  {
    id: 5,
    name: "Jamal Wilson",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    xp: 1850,
    level: 9,
    rank: 5
  }
];

// Daily challenges data
export const dailyChallengesData = [
  {
    id: 1,
    title: "Active Participant",
    description: "Participate in discussions in 3 different rooms today",
    xpReward: 50,
    progress: 2,
    total: 3,
    completed: false
  },
  {
    id: 2,
    title: "Resource Sharer",
    description: "Share 2 useful resources with your communities",
    xpReward: 30,
    progress: 2,
    total: 2,
    completed: true
  },
  {
    id: 3,
    title: "Feedback Provider",
    description: "Provide feedback on at least 3 ideas shared by others",
    xpReward: 40,
    progress: 1,
    total: 3,
    completed: false
  }
];

// User gamification data
export const userGamificationData = {
  currentXP: 850,
  level: 5,
  xpForNextLevel: 1000,
  totalXPEarned: 4250,
  joinDate: "May 5, 2023",
  daysActive: 45,
  streakDays: 12,
  badges: userBadges,
  leaderboard: leaderboardData,
  dailyChallenges: dailyChallengesData
};

export default userGamificationData; 