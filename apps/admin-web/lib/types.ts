// Types partagés côté client.

export interface Warning {
  id: string;
  reason: string;
  moderator: string;
  createdAt: string;
}

export interface BotUser {
  id: string;
  discordId: string;
  username: string;
  guildId: string;
  createdAt: string;
  birthday: string | null;
  hasTicket: boolean;
  ticketReason: string | null;
  level: number;
  xp: number;
  nextLevel: number;
  rank: string | null;
  inGuild: boolean;
  leftAt: string | null;
  isBanned: boolean;
  bannedAt: string | null;
  banReason: string | null;
  warnings?: Warning[];
  guild?: { id: string; name: string };
}

export interface Guild {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  ticketEnabled: boolean;
  levelEnabled: boolean;
  welcomeEnabled: boolean;
  modEnabled: boolean;
  birthdayEnabled: boolean;
  users?: BotUser[];
  _count?: { users: number };
}

export interface Stats {
  totalGuilds: number;
  totalUsers: number;
  totalWarnings: number;
}

export interface SystemInfo {
  now: string;
  node: string;
  platform: string;
  hostname: string;
  uptimeSystem: number;
  uptimeProcess: number;
  cpu: { cores: number; model: string; load1: number };
  memory: { total: number; free: number; used: number; process: number };
  db: { latencyMs: number | null; sizeBytes: number | null };
  commands: { total: number; categories: Record<string, number> };
  backups: { count: number; totalSize: number; last: { name: string; size: number; mtime: string } | null } | null;
}

// ── Notes ──
export interface Note {
  id: string;
  title: string;
  content: string;
  sectionId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Section {
  id: string;
  name: string;
  position: number;
  notes: Note[];
}

// ── Planner ──
export interface Subtask {
  id: string;
  text: string;
  done: boolean;
  position: number;
  taskId: string;
}
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string | null;
  tags: string[];
  start: string | null;
  end: string | null;
  position: number;
  plannerId: string;
  columnId: string;
  subtasks: Subtask[];
}
export interface BoardColumn {
  id: string;
  name: string;
  position: number;
  plannerId: string;
}
export interface Planner {
  id: string;
  name: string;
  position: number;
  columns: BoardColumn[];
  tasks: Task[];
}
