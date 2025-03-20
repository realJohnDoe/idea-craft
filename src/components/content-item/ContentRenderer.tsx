
import React from 'react';
import { Content } from '@/lib/content-utils';

interface ContentRendererProps {
  content: string;
  allItems?: Content[];
  expandedLinks: string[];
  handleLinkClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onToggleLink: (itemId: string) => void;
  onToggleLinkedTask: (itemId: string, isChecked: boolean) => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  allItems = [],
  expandedLinks,
  handleLinkClick,
  onToggleLink,
  onToggleLinkedTask
}) => {
  // Parse the content to find link patterns
  const parsedContent = React.useMemo(() => {
    // Regular expression to match links in the content
    const linkRegex = /<span class="content-link" data-item-id="(.*?)">(.*?)<\/span>/g;
    
    // Split content into parts: regular text and links
    const parts: Array<{ type: 'text' | 'link'; content: string; itemId?: string; title?: string }> = [];
    
    let lastIndex = 0;
    let match;
    
    // Find all links in the content
    while ((match = linkRegex.exec(content)) !== null) {
      // Add the text before the link
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      
      // Add the link
      parts.push({
        type: 'link',
        content: match[0],
        itemId: match[1],
        title: match[2]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add any remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }
    
    return parts;
  }, [content]);
  
  return (
    <div onClick={handleLinkClick}>
      {parsedContent.map((part, index) => {
        if (part.type === 'text') {
          // Render regular text
          return <span key={index} dangerouslySetInnerHTML={{ __html: part.content }} />;
        } else if (part.type === 'link' && part.itemId) {
          // Render linked content
          const linkedItem = allItems.find(item => item.id === part.itemId);
          if (!linkedItem) return <span key={index}>{part.title}</span>;
          
          const isExpanded = expandedLinks.includes(part.itemId);
          
          return (
            <div key={index} className="linked-content-container my-2 border border-muted rounded-md overflow-hidden">
              <div 
                className="linked-content-header flex items-center justify-between p-2 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLink(part.itemId!);
                }}
              >
                <div className="flex items-center">
                  {linkedItem.hasTaskAttributes && (
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-task border-task rounded mr-2" 
                      checked={linkedItem.taskDone}
                      onChange={(e) => {
                        e.stopPropagation();
                        onToggleLinkedTask(part.itemId!, e.target.checked);
                      }}
                    />
                  )}
                  <span className={linkedItem.hasTaskAttributes && linkedItem.taskDone ? 'line-through text-muted-foreground' : 'font-medium'}>
                    {part.title}
                  </span>
                </div>
                <button className="text-muted-foreground">
                  {isExpanded ? (
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                  ) : (
                    <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  )}
                </button>
              </div>
              
              {isExpanded && (
                <div className="linked-content-body p-3">
                  {linkedItem.hasTaskAttributes && (
                    <div className="mb-2">
                      <span className={`text-xs font-medium ${linkedItem.taskDone ? 'text-green-500' : 'text-amber-500'}`}>
                        {linkedItem.taskDone ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  )}
                  
                  {linkedItem.tags && linkedItem.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1">
                      {linkedItem.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-muted text-xs px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-sm">{linkedItem.content}</div>
                </div>
              )}
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};

export default ContentRenderer;
