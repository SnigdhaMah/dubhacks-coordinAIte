export type TodoType = {
  uid: string;
  feature: string;
  todo: string;
  description: string;
  notes: string;
  completed: boolean;
  type: "invite" | "book" | "generic";
};
