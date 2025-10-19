export type TodoType = {
  uid: string;
  feature: string;
  todo: string;
  completed: boolean;
  type: "invite" | "book" | "generic";
};
