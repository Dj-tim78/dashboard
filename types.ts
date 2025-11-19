
export enum ContainerStatus {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  EXITED = 'EXITED',
  ERROR = 'ERROR',
}

export type RestartPolicy = 'no' | 'always' | 'on-failure' | 'unless-stopped';

export type HealthStatus = 'healthy' | 'unhealthy' | 'starting' | 'none';

export interface Volume {
  mountPath: string;
  hostPath: string;
  mode: string;
}

export interface Container {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  health: HealthStatus; // Added health status
  created: string; // Added created timestamp
  uptime: string;
  port: string;
  cpu: number; // Percentage
  cpuLimit: number; // Added CPU Limit
  memory: number; // MB
  memoryLimit: number; // Added Memory Limit
  logs: string[];
  envVars: Record<string, string>;
  volumes: Volume[];
  restartPolicy: RestartPolicy;
}

export interface DockerImage {
  id: string;
  repository: string;
  tag: string;
  size: string;
  created: string;
}

export interface DockerVolume {
  name: string;
  driver: string;
  mountpoint: string;
  created: string;
  status: 'in-use' | 'available';
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'viewer';
  avatar: string;
  password?: string; // Added for mock auth
  created: string;
}

export interface MetricPoint {
  time: string;
  value: number;
  value2?: number; // Added for memory or secondary metrics
}

export interface AIAnalysisResult {
  summary: string;
  suggestedFix: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type SortField = 'name' | 'cpu' | 'memory' | 'uptime';
export type SortDirection = 'asc' | 'desc';