// Client Messages

interface ClientMessageBase {
  type: string;
  ts: number; 
  thought_signature?: string;
}


interface FrameMessage extends ClientMessageBase {
  type: "frame" | "scene" | "question";
  imageBase64: string; 
  width: number;
  height: number;
}

interface QuestionMessage extends ClientMessageBase {
  type: "question";
  text: string;
}

interface ControlMessage extends ClientMessageBase {
  type: "control";
  mode?: "auto" | "beginner" | "expert";
  enableOverlays?: boolean;
  enableVoice?: boolean;
}

interface PingMessage extends ClientMessageBase {
  type: "ping";
  pingId: string;
}

// Server Messages
interface ServerMessageBase {
  type: string;
  serverTs: number;
}


// Sent Through Web Socket
interface TokenMessage extends ServerMessageBase {
  type: "token";
  text: string;
  thought_signature: string;
}
interface ThoughtMessage extends ServerMessageBase {
  type: "thought";
  text: string;

}


interface SectionMessage extends ServerMessageBase {
  type: "section";
  title: string;
}
interface ThoughtMessage extends ServerMessageBase {
  type: "thought";
  text: string;

}


interface OverlayMessage extends ServerMessageBase {
  type: "overlay";
  overlays: Array<{
    id: string;
    shape: "box" | "arrow" | "circle";
    x: number;
    y: number;
    w?: number;
    h?: number;
    label?: string;
  }>;
}

// Debug 
interface MetaMessage extends ServerMessageBase {
  type: "meta";
  latencyMs?: number;
  model?: string;
  message: string;
  confidence?: number;
}


// Track Latency
interface PongMessage extends ServerMessageBase {
  type: "pong";
  pingId: string;
}


interface ErrorMessage extends ServerMessageBase {
  type: "error";
  message: string;
  recoverable: boolean;
}



type ClientMessage =
  | FrameMessage
  | QuestionMessage
  | ControlMessage
  | PingMessage;

type ServerMessage =
  | TokenMessage
  | SectionMessage
  | OverlayMessage
  | MetaMessage
  | PongMessage
  | ErrorMessage
  | ThoughtMessage;
