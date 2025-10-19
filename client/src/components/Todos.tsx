import React from 'react';
import { TodoType } from "../types/todoType";

interface TodosProps {
  todos: TodoType[];
  onClickTodo: (todo: TodoType) => void;
  updateTodo: (updatedTodo: TodoType) => void;
}

export default function Todos({ todos, onClickTodo, updateTodo }: TodosProps) {
  const handleCheckboxClick = (e: React.MouseEvent, todo: TodoType) => {
    e.stopPropagation(); // Prevent the todo-item onClick from firing
    updateTodo({
      ...todo,
      completed: !todo.completed,
    });
  };

  return (
    <div className="todos-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Your Tasks</h2>
      </div>

      <div className="todos-list">
        {todos.length === 0 ? (
          <p className="empty-message">No tasks yet</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.uid}
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              onClick={() => onClickTodo(todo)}
            >
              <div
                className="todo-checkbox"
                onClick={(e) => handleCheckboxClick(e, todo)}
              >
                {todo.completed && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8L6 11L13 4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="todo-text">{todo.todo}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}