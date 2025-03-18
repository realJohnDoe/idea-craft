
import React from 'react';

const ActionStyles = () => {
  return (
    <style>
      {`
      .content-link {
        color: hsl(var(--primary));
        text-decoration: underline;
        cursor: pointer;
      }
      
      .highlight-pulse {
        animation: pulse 1.5s ease-in-out;
      }
      
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary), 0); }
        50% { box-shadow: 0 0 0 8px rgba(var(--primary), 0.2); }
      }
      
      .list-content-item:not(:last-child) {
        border-bottom: 1px solid var(--border);
      }
      
      .list-content-item:hover {
        background-color: hsl(var(--muted));
      }
      
      .content-item-tag {
        padding: 0.125rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
      }
      
      /* Enhanced styling for content type borders */
      .content-task {
        border-left: 4px solid hsl(var(--task));
      }
      
      .content-event {
        border-left: 4px solid hsl(var(--event));
      }
      
      .content-note {
        border-left: 4px solid hsl(var(--note));
      }
      
      .content-mail {
        border-left: 4px solid hsl(var(--mail));
      }
      
      /* Checkbox styling for tasks */
      input[type="checkbox"] {
        accent-color: hsl(var(--task));
      }
      `}
    </style>
  );
};

export default ActionStyles;
