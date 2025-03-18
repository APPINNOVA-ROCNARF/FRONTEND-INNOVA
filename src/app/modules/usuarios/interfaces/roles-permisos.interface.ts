export interface Role {
    id: number;
    name: string;
    description: string;
    state: boolean;
    permissions: Permission[];
  }
  
export interface Permission {
    id: number;
    name: string;
    moduleId: number;
    action: string;
  }
  
export interface Module {
    id: number;
    name: string;
    permissions: Permission[];
  }
  