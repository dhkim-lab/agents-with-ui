import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  AgentInfo,
  AgentName,
  ChatMessage,
  Scenario,
  ScenarioEvent,
  FileTransferEvent,
  Artifact,
  DecisionState,
} from '../types';
import { playSound } from '../engine/audioManager';

const INITIAL_AGENTS: Record<AgentName, AgentInfo> = {
  Alex: { name: 'Alex', role: 'Orchestrator', color: 'bg-blue-500', avatarColor: 'blue', state: 'idle', progress: 0, location: 'desk' },
  Kai: { name: 'Kai', role: 'Researcher', color: 'bg-yellow-500', avatarColor: 'yellow', state: 'idle', progress: 0, location: 'desk' },
  Mia: { name: 'Mia', role: 'Writer', color: 'bg-green-500', avatarColor: 'green', state: 'idle', progress: 0, location: 'desk' },
  Nova: { name: 'Nova', role: 'Planner', color: 'bg-purple-500', avatarColor: 'purple', state: 'idle', progress: 0, location: 'desk' },
  Rex: { name: 'Rex', role: 'Analyst', color: 'bg-red-500', avatarColor: 'red', state: 'idle', progress: 0, location: 'desk' },
};

export function useDemoEngine(scenario: Scenario) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState(-1); // Start at Phase -1 (routine)
  const [phaseName, setPhaseName] = useState("Daily Routine");
  const [isPublishDone, setIsPublishDone] = useState(false);

  // Timers
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [totalElapsedTimeMs, setTotalElapsedTimeMs] = useState(0);
  const [usedTokens, setUsedTokens] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>(0);
  const totalTimeRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(0);

  // State
  const [agents, setAgents] = useState<Record<AgentName, AgentInfo>>(INITIAL_AGENTS);
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([]);
  const [activeTransfers, setActiveTransfers] = useState<(FileTransferEvent & { id: string })[]>([]);
  const [isResultReady, setIsResultReady] = useState(false);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeDecision, setActiveDecision] = useState<DecisionState | null>(null);
  const [isDecisionPending, setIsDecisionPending] = useState(false);

  // Track executed events to avoid firing twice
  const executedEventIndices = useRef<Set<string>>(new Set()); // key: `${phaseId}-${eventIdx}`

  // Is routine phase (Phase -1)
  const isRoutinePhase = currentPhaseId === -1;

  const addChatLog = useCallback((agent: AgentName, text: string, tag?: string, isRoutineAlert?: boolean) => {
    setChatLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      agent,
      text,
      timestamp: Date.now(),
      tag: tag as ChatMessage['tag'],
      isRoutineAlert,
    }]);
  }, []);

  const startDemo = () => {
    // Transition from Phase -1 routine to Phase 0 (project intake)
    setCurrentPhaseId(0);
    setPhaseName("프로젝트 수주");
    setIsPlaying(true);
    setElapsedTimeMs(0);
    setTotalElapsedTimeMs(0);
    totalTimeRef.current = 0;
    lastFrameRef.current = 0;
    setUsedTokens(0);
    setArtifacts([]);
    setIsResultReady(false);
    setIsPublishDone(false);
    setActiveDecision(null);
    setIsDecisionPending(false);
    executedEventIndices.current = new Set();
    startTimeRef.current = null;
  };

  const startRoutine = useCallback(() => {
    // Start Phase -1 routine loop
    setCurrentPhaseId(-1);
    setPhaseName("Daily Routine");
    setIsPlaying(true);
    setElapsedTimeMs(0);
    setChatLogs([]);
    setAgents(INITIAL_AGENTS);
    executedEventIndices.current = new Set();
    startTimeRef.current = null;
  }, []);

  const resolveDecision = useCallback((selectedIndex: number, reason?: string) => {
    if (!activeDecision) return;

    const chosenOption = activeDecision.options[selectedIndex];
    // Log the decision
    addChatLog('Alex', `방향 확인: "${chosenOption.label}"${reason ? ` — ${reason}` : ''}`, 'success');

    setActiveDecision(null);
    setIsDecisionPending(false);
  }, [activeDecision, addChatLog]);

  const processEvent = useCallback((event: ScenarioEvent) => {
    switch (event.type) {
      case 'chat':
        addChatLog(event.agent, event.text, event.tag);
        setUsedTokens(prev => prev + 124);
        break;

      case 'move':
        setAgents(prev => {
          const next = { ...prev };
          if (event.agent === 'all') {
            (Object.keys(next) as AgentName[]).forEach(name => {
              next[name] = { ...next[name], location: event.to };
            });
          } else {
            next[event.agent] = { ...next[event.agent], location: event.to };
          }
          return next;
        });
        break;

      case 'status':
        setAgents(prev => {
          const next = { ...prev };
          if (event.agent === 'all') {
            (Object.keys(next) as AgentName[]).forEach(name => {
              next[name] = {
                ...next[name],
                state: event.state,
                ...(event.progress !== undefined && { progress: event.progress }),
                ...(event.statusText !== undefined && { statusText: event.statusText }),
                ...(event.taskType !== undefined && { taskType: event.taskType }),
              };
            });
          } else {
            next[event.agent] = {
              ...next[event.agent],
              state: event.state,
              ...(event.progress !== undefined && { progress: event.progress }),
              ...(event.statusText !== undefined && { statusText: event.statusText }),
              ...(event.taskType !== undefined && { taskType: event.taskType }),
            };
          }
          return next;
        });
        break;

      case 'file_transfer':
        setActiveTransfers(prev => [...prev, { ...event, id: Math.random().toString() }]);
        setTimeout(() => {
          setActiveTransfers(prev => prev.slice(1));
        }, 1500);
        break;

      case 'phase_change':
        if (currentPhaseId !== event.phase) {
          setCurrentPhaseId(event.phase);
          setPhaseName(event.phaseName);
          setElapsedTimeMs(0);
          executedEventIndices.current = new Set();
          startTimeRef.current = performance.now();
        }
        break;

      case 'result_ready':
        setIsResultReady(true);
        setUsedTokens(prev => prev + 1850);
        break;

      case 'publish_done':
        setIsPublishDone(true);
        setIsPlaying(false);
        break;

      // --- New v5.0 event types ---

      case 'artifact':
        setArtifacts(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          agent: event.agent,
          artifactType: event.artifactType,
          title: event.title,
          content: event.content,
          timestamp: Date.now(),
        }]);
        setUsedTokens(prev => prev + 500);
        break;

      case 'decision_point':
        setActiveDecision({
          question: event.question,
          options: event.options,
          autoChoice: event.autoChoice,
          autoReason: event.autoReason,
          timeout: event.timeout,
        });
        setIsDecisionPending(true);
        break;

      case 'routine_alert':
        addChatLog(event.agent, event.text, undefined, true);
        break;

      case 'sound':
        playSound(event.soundType);
        break;
    }
  }, [currentPhaseId, addChatLog]);

  // Main animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
        lastFrameRef.current = now;
      }

      // Pause time tracking during decision
      if (isDecisionPending) {
        startTimeRef.current = now - elapsedTimeMs;
        lastFrameRef.current = now;
        animationFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = now - startTimeRef.current;
      const frameDelta = now - lastFrameRef.current;
      lastFrameRef.current = now;

      setElapsedTimeMs(delta);
      totalTimeRef.current += frameDelta;
      setTotalElapsedTimeMs(totalTimeRef.current);

      const currentPhase = scenario.phases.find(p => p.id === currentPhaseId);

      if (currentPhase) {
        // Fire events by timestamp
        currentPhase.events.forEach((event, idx) => {
          const eventKey = `${currentPhaseId}-${idx}`;
          if (delta >= event.t && !executedEventIndices.current.has(eventKey)) {
            executedEventIndices.current.add(eventKey);
            processEvent(event);
          }
        });

        // Phase auto-advance (skip for infinite phases like -1)
        if (currentPhase.duration > 0 && delta >= currentPhase.duration) {
          const nextPhase = scenario.phases.find(p => p.id === currentPhaseId + 1);
          if (nextPhase) {
            setCurrentPhaseId(nextPhase.id);
            setPhaseName(nextPhase.name || `Phase ${nextPhase.id}`);
            startTimeRef.current = now;
            setElapsedTimeMs(0);
            executedEventIndices.current = new Set();
          } else {
            setIsPlaying(false);
          }
        }

        // Loop routine events for Phase -1
        if (currentPhase.duration === -1 && currentPhase.events.length > 0) {
          const maxT = Math.max(...currentPhase.events.map(e => e.t));
          const loopDuration = maxT + 5000; // 5s gap between loops
          if (delta >= loopDuration) {
            // Reset for next loop
            startTimeRef.current = now;
            setElapsedTimeMs(0);
            executedEventIndices.current = new Set();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentPhaseId, scenario, isDecisionPending, elapsedTimeMs, processEvent]);

  const reset = () => {
    setIsPlaying(false);
    setCurrentPhaseId(-1);
    setPhaseName("Daily Routine");
    setElapsedTimeMs(0);
    setTotalElapsedTimeMs(0);
    totalTimeRef.current = 0;
    lastFrameRef.current = 0;
    setUsedTokens(0);
    setChatLogs([]);
    setAgents(INITIAL_AGENTS);
    setIsResultReady(false);
    setIsPublishDone(false);
    setArtifacts([]);
    setActiveDecision(null);
    setIsDecisionPending(false);
    startTimeRef.current = null;
    executedEventIndices.current = new Set();
  };

  return {
    isPlaying,
    isRoutinePhase,
    currentPhaseId,
    phaseName,
    elapsedTimeMs,
    totalElapsedTimeMs,
    usedTokens,
    agents,
    chatLogs,
    activeTransfers,
    isResultReady,
    isPublishDone,
    artifacts,
    activeDecision,
    isDecisionPending,
    startDemo,
    startRoutine,
    resolveDecision,
    reset,
  };
}
