export interface ModifiedDraft {
  session_id: string;
  user_name: string;
  session_data: {
    formFieldValue?: { label: string; value: string }[];
    [key: string]: any;
  };
  displayTitle: string;
}