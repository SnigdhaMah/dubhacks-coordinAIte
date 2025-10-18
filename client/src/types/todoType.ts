export type TodoType = { 
  uid: string;
  todo: string;
  completed: boolean;
  type: 'invite' | 'book' | 'generic';
};
