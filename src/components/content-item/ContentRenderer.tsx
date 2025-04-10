import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { hasTaskAttributes, Item } from "@/lib/content-utils";
import IdeaCraftCheckbox from "../IdeaCraftCheckbox";

interface ContentRendererProps {
  content: string;
  allItems?: Item[];
  handleWikiLinkClick: (wikilinkId: string) => void;
  onTaskToggle?: (item: Item, isDone: boolean) => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  allItems = [],
  handleWikiLinkClick,
  onTaskToggle,
}) => {
  const processWikilinks = (markdown: string) => {
    // Process links in the format [[title|id]] or just [[title]]
    const regex = /\[\[(.*?)\]\]/g;
    return markdown.replace(regex, (match, content) => {
      const parts = content.split("|");
      const title = parts[0].trim();
      const id = parts[1] ? parts[1].trim() : null;

      // If we have an id, use that
      if (id) {
        return `[${title}](#${id})`;
      }

      // Try to find by title if no id is provided
      const linkedItem = allItems.find(
        (item) => item.title.toLowerCase() === title.toLowerCase()
      );

      if (linkedItem) {
        return `[${title}](#${linkedItem.id})`;
      }

      return `[${title}](#unknown)`;
    });
  };

  const processedContent = processWikilinks(content);

  const CustomLink = ({ href, children }) => {
    const navigate = useNavigate();

    if (href.startsWith("#")) {
      const itemId = href.slice(1);

      if (itemId === "unknown") {
        return <span className="text-red-500">{children}</span>;
      }

      const linkedItem = allItems.find((item) => item.id === itemId);

      if (!linkedItem) {
        return <span className="text-red-500">[[Invalid Link]]</span>;
      }

      // Render as checkable task
      if (hasTaskAttributes(linkedItem)) {
        return (
          <div className="flex border items-center bg-card w-full rounded-lg py-1 my-1 px-2">
            <IdeaCraftCheckbox
              checked={linkedItem.done !== undefined ? linkedItem.done : false}
              onToggle={(checked) => onTaskToggle?.(linkedItem, checked)}
            />
            <label
              className="cursor-pointer hover:underline inline-flex items-center"
              onClick={() => {
                navigate(`/item/${linkedItem.id}`);
                handleWikiLinkClick(linkedItem.id);
              }}
            >
              {linkedItem.title}
            </label>
          </div>
        );
      }

      // Regular link
      return (
        <span
          className="hover:underline border cursor-pointer bg-card px-1 rounded inline-flex"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/item/${linkedItem.id}`);
            handleWikiLinkClick(linkedItem.id);
          }}
        >
          {linkedItem.title}
        </span>
      );
    }

    // External link
    return (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
      </a>
    );
  };

  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <div className="my-1">{children}</div>,
          a: CustomLink,
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside ml-4 my-0" {...props}>
              {children}
            </ol>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside ml-4 my-0" {...props}>
              {children}
            </ul>
          ),
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold my-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold my-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold my-2">{children}</h3>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default ContentRenderer;
