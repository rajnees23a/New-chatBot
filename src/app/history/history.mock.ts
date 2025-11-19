/**
 * Mock data and utilities for History Component
 * This file contains field sequences, conversation stage logic, and mock data
 */

/**
 * Field sequence for conversation stages
 * This class provides utilities for managing conversation flow and field sequences
 */
export class HistoryComponentMockData {
  
  /**
   * Get the field sequence for determining conversation stages
   * @returns Array of field labels in conversation order
   */
  static getFieldSequence(): string[] {
    return [
      'Your idea title',        // Stage 0
      'Problem statement',      // Stage 1
      'Objective',             // Stage 2
      'Key results',           // Stage 3
      'Key features',          // Stage 4
      'Urgency',               // Stage 5
      'Areas involved',        // Stage 6
      'Destination 2027 alignment', // Stage 7
      'Risks',                 // Stage 8
      'KPIs',                  // Stage 9
      'Data needed',           // Stage 10
      'Impact',                // Stage 11
      'Implementation considerations', // Stage 12
      'Dependencies',          // Stage 13
      'Key dates',             // Stage 14
      'Timelines',             // Stage 15
      'Business sponsor',      // Stage 16
      'Budget details',        // Stage 17
      'Stakeholders',          // Stage 18
      'Out of scope',          // Stage 19
      'Business case impacts', // Stage 20
      'Portfolio alignment',   // Stage 21
      'IT sponsor',            // Stage 22
      'Additional attachments', // Stage 23
      'Additional comments'    // Stage 24
    ];
  }

  /**
   * Get conversation stage based on filled fields
   * @param fields - Array of form fields
   * @param adaText - Text representing unfilled fields
   * @returns Conversation stage number
   */
  static determineConversationStage(fields: any[], adaText: string): number {
    const fieldSequence = this.getFieldSequence();
    
    // Find the last filled field that's not "ADA couldn't fill this field"
    let lastFilledIndex = -1;
    for (let i = 0; i < fieldSequence.length; i++) {
      const field = fields.find(f => f.label === fieldSequence[i]);
      if (field && field.value && field.value.trim() !== '' && field.value !== adaText) {
        lastFilledIndex = i;
      }
    }

    // Return conversation stage to continue from next logical field
    return lastFilledIndex + 1;
  }

  /**
   * Get field name by stage index
   * @param stageIndex - The stage index
   * @returns Field name for the given stage, or null if invalid index
   */
  static getFieldNameByStage(stageIndex: number): string | null {
    const fieldSequence = this.getFieldSequence();
    return stageIndex >= 0 && stageIndex < fieldSequence.length ? fieldSequence[stageIndex] : null;
  }

  /**
   * Get total number of conversation stages
   * @returns Total number of stages
   */
  static getTotalStages(): number {
    return this.getFieldSequence().length;
  }

  /**
   * Get bot response messages for different interaction types
   */
  static getBotMessages() {
    return {
      DROPDOWN_PREFIX: "Please select from: ",
      BUTTON_OPTIONS_PREFIX: "Available options: ",
      MAPPING_BUTTON_PREFIX: "Please specify: ",
      CONVERSATION_COMPLETE: "Your business idea is now complete! All sections have been filled out.",
      FORM_SUBMITTED_SUCCESS: "Form submitted successfully!",
      SCROLL_ERROR: "Unable to scroll to bottom:",
      TOOLTIP_ERROR: "Unable to initialize tooltips:",
      SESSION_STORAGE_ERROR: "Unable to update session storage:"
    };
  }

  /**
   * Get dropdown and selection options for various fields
   */
  static getFieldOptions() {
    return {
      AREAS_INVOLVED: ['Customer Service', 'IT Department', 'Marketing', 'Operations', 'Finance', 'Legal'],
      DESTINATION_ALIGNMENT: ['Digital Transformation', 'Customer Experience Excellence', 'Operational Efficiency', 'Innovation Leadership'],
      BUSINESS_ALIGNMENT: ['High alignment', 'Medium alignment', 'Strategic initiative', 'Other']
    };
  }

  /**
   * Get field labels and identifiers
   */
  static getFieldLabels() {
    return {
      ADDITIONAL_COMMENTS: 'Additional comments'
    };
  }
}

export const mockDraftData = {
  comingFrom: 'draft',
  sessionDataDraft: {
    chatHistory: [
      { text: 'Hello', sender: 'user', isFile: false },
      { text: 'Hi', sender: 'bot', isFile: false }
    ],
    formFieldValue: Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: i === 23 ? 'file.pdf' : '',
      valid: false,
      editing: false,
      image: '',
      completed: false
    }))
  },
  sessionDataId: 'mock-session-id',
  sessionDataUserName: 'mock-user'
};

export const mockRequestData = {
  comingFrom: 'request',
  chatData: {
    chatHistory: [
      { text: 'User message', sender: 'user', isFile: false },
      { text: 'Bot reply', sender: 'bot', isFile: false }
    ],
    formFieldValue: Array.from({ length: 25 }, (_, i) => ({
      label: `Field ${i}`,
      value: '',
      valid: false,
      editing: false,
      image: '',
      completed: false
    }))
  },
  session_id: 'mock-request-session-id',
  user_name: 'mock-request-user'
};

export const mockApiResponse = {
  BIC: { 'Your idea title': 'Test Title' },
  bot_message: 'Bot says hello',
  button: ['Yes', 'No'],
  drop_down: false
};

export const mockFile = new File(['dummy content'], 'file.pdf', { type: 'application/pdf' });