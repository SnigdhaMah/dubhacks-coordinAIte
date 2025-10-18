import React from 'react';
import { TodoType } from '../types/todoType';

interface SpecificTodoProps {
  todo: TodoType | null;
  updateTodo: (updatedTodo: TodoType) => void;
}

export default function SpecificTodo({ todo, updateTodo }: SpecificTodoProps) {
  console.log("SpecificTodo props:", { todo, updateTodo });
  return (
    <div>
      Specific Todo Component
    </div>
  )
}
