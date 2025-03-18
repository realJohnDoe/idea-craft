
import React, { useState } from 'react';
import { Content } from '@/lib/content-utils';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

interface ContentBodyProps {
  item: Content;
  onUpdate: (updatedItem: Content) => void;
  processedContent: string;
  handleLinkClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  allItems?: Content[];
}

const ContentBody: React.FC<ContentBodyProps> = ({
  item,
  onUpdate,
  processedContent,
  handleLinkClick,
  allItems = []
}) => {
  const [expandedLinks, setExpandedLinks] = useState<string[]>([]);
  
  const toggleExpandLink = (itemId: string) => {
    setExpandedLinks(prevExpanded => 
      prevExpanded.includes(itemId)
        ? prevExpanded.filter(id => id !== itemId)
        : [...prevExpanded, itemId]
    );
  };
  
  const handleToggleTaskDone = (linkedItem: Content, isDone: boolean) => {
    const updatedItem = { 
      ...linkedItem,
      taskDone: isDone
    };
    
    // Re-generate YAML
    const { formatContentWithYaml } = require('@/lib/content-utils');
    updatedItem.yaml = formatContentWithYaml(updatedItem);
    
    onUpdate(updatedItem);
  };
  
  return (
    <div className="content-item-body">
      {item.hasTaskAttributes && (
        <div className="mb-3 flex items-center">
          <Checkbox 
            id={`task-${item.id}`}
            checked={item.taskDone} 
            onCheckedChange={(checked) => {
              const { formatContentWithYaml } = require('@/lib/content-utils');
              const updatedItem = { ...item, taskDone: !!checked };
              updatedItem.yaml = formatContentWithYaml(updatedItem);
              onUpdate(updatedItem);
            }}
            className="mr-2 data-[state=checked]:bg-task data-[state=checked]:text-white border-task"
          />
          <label 
            htmlFor={`task-${item.id}`}
            className={`text-sm ${item.taskDone ? 'line-through text-muted-foreground' : ''}`}
          >
            Mark as done
          </label>
        </div>
      )}
      
      {item.hasEventAttributes && item.eventDate && (
        <div className="mb-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <svg className="mr-1 h-4 w-4 text-event" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span className="font-medium text-event">
              {format(item.eventDate, 'PPP')}
            </span>
          </div>
          
          {item.eventLocation && (
            <div className="mt-1 ml-5 text-sm">
              <span>Location: {item.eventLocation}</span>
            </div>
          )}
        </div>
      )}
      
      {item.hasMailAttributes && (
        <div className="mb-3 text-sm">
          {item.mailFrom && (
            <div className="text-muted-foreground">
              <span className="font-medium">From:</span> {item.mailFrom}
            </div>
          )}
          
          {item.mailTo && item.mailTo.length > 0 && (
            <div className="text-muted-foreground">
              <span className="font-medium">To:</span> {item.mailTo.join(', ')}
            </div>
          )}
          
          {item.mailSubject && (
            <div className="text-muted-foreground">
              <span className="font-medium">Subject:</span> {item.mailSubject}
            </div>
          )}
        </div>
      )}
      
      <div 
        className="prose prose-sm max-w-none dark:prose-invert"
        onClick={handleLinkClick}
        dangerouslySetInnerHTML={{
          __html: processedContent.replace(
            /<span class="content-link" data-item-id="(.*?)">(.*?)<\/span>/g, 
            (_, itemId, title) => {
              const linkedItem = allItems.find(item => item.id === itemId);
              if (!linkedItem) return _;
              
              const isExpanded = expandedLinks.includes(itemId);
              
              return `
                <div class="linked-content-container my-2 border border-muted rounded-md overflow-hidden">
                  <div 
                    class="linked-content-header flex items-center justify-between p-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                    data-link-toggle="${itemId}"
                  >
                    <div class="flex items-center">
                      ${linkedItem.hasTaskAttributes ? `
                        <input 
                          type="checkbox" 
                          class="form-checkbox h-4 w-4 text-task border-task rounded mr-2" 
                          ${linkedItem.taskDone ? 'checked' : ''}
                          data-linked-task="${itemId}"
                        />
                      ` : ''}
                      <span class="${linkedItem.hasTaskAttributes && linkedItem.taskDone ? 'line-through text-muted-foreground' : 'font-medium'}">${title}</span>
                    </div>
                    <button class="text-muted-foreground">
                      ${isExpanded ? 
                        '<svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>' : 
                        '<svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>'
                      }
                    </button>
                  </div>
                  ${isExpanded ? `
                    <div class="linked-content-body p-3">
                      ${linkedItem.hasTaskAttributes ? `
                        <div class="mb-2">
                          <span class="text-xs font-medium ${linkedItem.taskDone ? 'text-green-500' : 'text-amber-500'}">
                            ${linkedItem.taskDone ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      ` : ''}
                      
                      ${linkedItem.tags && linkedItem.tags.length > 0 ? `
                        <div class="mb-2 flex flex-wrap gap-1">
                          ${linkedItem.tags.map(tag => `
                            <span class="bg-muted text-xs px-2 py-0.5 rounded-full">${tag}</span>
                          `).join('')}
                        </div>
                      ` : ''}
                      
                      <div class="text-sm">${linkedItem.content}</div>
                    </div>
                  ` : ''}
                </div>
              `;
            }
          )
        }}
      />
      
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              if (e.target.closest('[data-link-toggle]')) {
                const itemId = e.target.closest('[data-link-toggle]').getAttribute('data-link-toggle');
                const event = new CustomEvent('toggle-link', { detail: { itemId } });
                document.dispatchEvent(event);
              }
              
              if (e.target.closest('[data-linked-task]')) {
                e.stopPropagation();
                const itemId = e.target.closest('[data-linked-task]').getAttribute('data-linked-task');
                const isChecked = e.target.closest('[data-linked-task]').checked;
                const event = new CustomEvent('toggle-linked-task', { 
                  detail: { itemId, isChecked } 
                });
                document.dispatchEvent(event);
              }
            });
          `
        }}
      />
    </div>
  );
};

export default ContentBody;
