import React from 'react';
import { TodoType } from '../types/todoType';

interface TodosProps {
  todos: TodoType[];
  onClickTodo: (todo: string) => void;
}

export default function Todos({ todos, onClickTodo }: TodosProps) {
  return (
    <div>
      Todos Component
    </div>
  )
}
