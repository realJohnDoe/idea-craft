
import React from 'react';

const ActionStyles = () => {
  return (
    <style>
      {`
      .content-link {
        color: #3b82f6;
        text-decoration: underline;
        cursor: pointer;
      }
      
      .highlight-pulse {
        animation: pulse 1.5s ease-in-out;
      }
      
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.2); }
      }
      
      .list-content-item:not(:last-child) {
        border-bottom: 1px solid var(--border);
      }
      
      .list-content-item:hover {
        background-color: var(--muted);
      }
      
      .content-item-tag {
        padding: 0.125rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 500;
      }
      `}
    </style>
  );
};

export default ActionStyles;
