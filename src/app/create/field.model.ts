
export interface Field {
  label: string;
  value: string;
  valid: boolean;
  editing: boolean;
  image: string;
  completed: boolean;
  tooltip?: string;
}


export interface ChatMessage {
  text?: string | { question: string; guidelines?: string[] };
  followingText?: { question: string; hints: string[] };
  sender: 'user' | 'bot';
  staticBotMessage?: boolean;
  isFile?: boolean;
  fileName?: string;
  fileUrl?: string;
  button?: any;
  mappingButton?: any;
  dropdown?: any;
  fieldName?: string;
  // Add any other optional properties you use
}

export interface SessionData {
  session_id: string;
  user_name: string;
  user_message: string;
  edit_field: string;
  confirmation: string;
}
