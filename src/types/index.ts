export type AgentName = 'Alex' | 'Kai' | 'Mia' | 'Nova' | 'Rex';

export type AgentRole = 'Orchestrator' | 'Researcher' | 'Writer' | 'Planner' | 'Analyst';

export type AgentState = 'idle' | 'working' | 'waiting' | 'done';

export type TaskType = 'routine' | 'project';

export interface AgentInfo {
  name: AgentName;
  role: AgentRole;
  color: string;
  avatarColor: string;
  state: AgentState;
  progress: number;
  statusText?: string;
  location: 'desk' | 'meeting_room' | 'Alex_desk';
  taskType?: TaskType;
}

// --- Event Types ---

export type EventType =
  | 'move'
  | 'chat'
  | 'status'
  | 'file_transfer'
  | 'phase_change'
  | 'result_ready'
  | 'publish_done'
  | 'artifact'
  | 'decision_point'
  | 'routine_alert'
  | 'sound';

export interface BaseEvent {
  t: number; // Time in milliseconds from phase start
  type: EventType;
}

export interface MoveEvent extends BaseEvent {
  type: 'move';
  agent: AgentName | 'all';
  to: 'desk' | 'meeting_room' | 'Alex_desk';
}

export type ChatTag = 'normal' | 'error' | 'success' | 'insight';

export interface ChatEvent extends BaseEvent {
  type: 'chat';
  agent: AgentName;
  text: string;
  tag?: ChatTag;
}

export interface StatusEvent extends BaseEvent {
  type: 'status';
  agent: AgentName | 'all';
  state: AgentState;
  progress?: number;
  statusText?: string;
  taskType?: TaskType;
}

export interface FileTransferEvent extends BaseEvent {
  type: 'file_transfer';
  from: AgentName;
  to: AgentName;
}

export interface PhaseChangeEvent extends BaseEvent {
  type: 'phase_change';
  phase: number;
  phaseName: string;
}

export interface ResultReadyEvent extends BaseEvent {
  type: 'result_ready';
  resultType?: string;
  content?: string;
}

export interface PublishDoneEvent extends BaseEvent {
  type: 'publish_done';
}

// --- New Event Types (v5.0) ---

export type ArtifactType = 'table' | 'chart' | 'copy' | 'diagram' | 'cardnews';

export interface ArtifactEvent extends BaseEvent {
  type: 'artifact';
  agent: AgentName;
  artifactType: ArtifactType;
  title: string;
  content: string; // HTML or markdown content for rendering
}

export interface DecisionOption {
  label: string;
  description: string;
}

export interface DecisionPointEvent extends BaseEvent {
  type: 'decision_point';
  question: string;
  options: DecisionOption[];
  autoChoice: number; // index of auto-selected option
  autoReason: string;
  timeout: number; // milliseconds (e.g., 30000)
}

export interface RoutineAlertEvent extends BaseEvent {
  type: 'routine_alert';
  agent: AgentName;
  text: string;
}

export type SoundType = 'notification' | 'complete' | 'alert';

export interface SoundEvent extends BaseEvent {
  type: 'sound';
  soundType: SoundType;
}

export type ScenarioEvent =
  | MoveEvent
  | ChatEvent
  | StatusEvent
  | FileTransferEvent
  | PhaseChangeEvent
  | ResultReadyEvent
  | PublishDoneEvent
  | ArtifactEvent
  | DecisionPointEvent
  | RoutineAlertEvent
  | SoundEvent;

export interface Phase {
  id: number;
  name: string;
  duration: number; // -1 for infinite (Phase -1 routine loop)
  events: ScenarioEvent[];
}

export interface Scenario {
  phases: Phase[];
}

// --- Chat & Artifact Data ---

export interface ChatMessage {
  id: string;
  agent: AgentName;
  text: string;
  timestamp: number;
  tag?: ChatTag;
  isRoutineAlert?: boolean;
}

export interface Artifact {
  id: string;
  agent: AgentName;
  artifactType: ArtifactType;
  title: string;
  content: string;
  timestamp: number;
}

export interface DecisionState {
  question: string;
  options: DecisionOption[];
  autoChoice: number;
  autoReason: string;
  timeout: number;
  selectedIndex?: number;
}
