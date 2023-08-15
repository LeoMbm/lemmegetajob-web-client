export interface CardField {
    label: string;
    type: string;
    options?: string[];
    required?: boolean;
  }
  
export interface CardCategory {
    [key: string]: CardField[];
  }
  

export interface FormData {
    [key: string]: string | number | boolean;
  }
  
export interface SubmittedCategories {
    [key: string]: boolean;
  }