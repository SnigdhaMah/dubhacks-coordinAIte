import React, { useState, useEffect } from "react";
import { TodoType } from "../types/todoType";

interface SpecificTodoProps {
  todo: TodoType | null;
  updateTodo: (updatedTodo: TodoType) => void;
}

export default function SpecificTodo({ todo, updateTodo }: SpecificTodoProps) {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    // Load notes from todo if they exist (you might want to add a notes field to TodoType)
    setNotes("");
  }, [todo]);

  if (!todo) {
    return (
      <div className="specific-todo-container empty">
        <div className="empty-state">
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4a5a5"
            strokeWidth="1.5"
          >
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
          <p className="empty-text">Select a task to view details</p>
        </div>
      </div>
    );
  }

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "invite":
        return "Send Invitation";
      case "book":
        return "Book Service";
      case "generic":
        return "Task";
      default:
        return "Task";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "invite":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        );
      case "book":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        );
      default:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        );
    }
  };

  return (
    <div className="specific-todo-container">
      <div className="todo-detail-header">
        <div className="todo-type-badge">
          {getTypeIcon(todo.type)}
          <span>{getTypeLabel(todo.type)}</span>
        </div>
        <h1 className="todo-detail-title">{todo.todo}</h1>
      </div>

      <div className="todo-detail-content">
        <div className="detail-section">
          <h3 className="section-title">Description</h3>
          <p className="description-text">{todo.description}</p>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Your Notes</h3>
          <textarea
            className="notes-textarea"
            placeholder="Add your notes here..."
            value={notes}
            onChange={handleNotesChange}
            rows={8}
          />
        </div>

        <div className="detail-section">
          <h3 className="section-title">Feature Category</h3>
          <div className="feature-tag">{todo.feature}</div>
        </div>
      </div>

      <div className="todo-detail-footer">
        <button
          className={`complete-button ${todo.completed ? "completed" : ""}`}
          onClick={() => updateTodo({ ...todo, completed: !todo.completed })}
        >
          {todo.completed ? (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Completed
            </>
          ) : (
            "Mark as Complete"
          )}
        </button>
      </div>
    </div>
  );
}
