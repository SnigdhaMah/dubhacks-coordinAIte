import React from 'react';
import { TodoType } from '../types/todoType';

interface TodosProps {
  todos: TodoType[];
  onClickTodo: (todo: TodoType) => void;
}

export default function Todos({ todos, onClickTodo }: TodosProps) {
  console.log("Todos props:", { todos, onClickTodo });
  return <div>Todos Component</div>;
}
