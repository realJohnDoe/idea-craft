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
  onTaskToggle?: (taskId: string, isDone: boolean) => void; // New prop for task toggling
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  allItems = [],
  handleWikiLinkClick,
  onTaskToggle, // Optional callback for task toggling
}) => {
  const processWikilinks = (markdown: string) => {
    const regex = /\[\[(.*?)\]\]/g;
    return markdown.replace(regex, (match, content) => {
      const [title, id] = content.split("|");
      const linkId = id || content.replace(/\s+/g, "-").toLowerCase();
      return `[${title || content}](#${linkId})`;
    });
  };
  const processedContent = processWikilinks(content);

  const CustomLink = ({ href }) => {
    const navigate = useNavigate();

    if (href.startsWith("#")) {
      const itemId = href.slice(1);
      const linkedItem = allItems.find((item) => item.id === itemId);

      if (!linkedItem) {
        return <span className="text-red-500">[[Invalid Link]]</span>;
      }

      // Render as checkable task
      if (hasTaskAttributes(linkedItem)) {
        return (
          <span className="inline-flex border items-center bg-card w-full rounded-lg p-2">
            <IdeaCraftCheckbox
              checked={linkedItem.done}
              onToggle={(checked) => onTaskToggle?.(linkedItem.id, checked)}
            />
            <span
              className="cursor-pointer hover:underline inline-flex items-center"
              onClick={() => {
                navigate(`/item/${linkedItem.id}`);
                handleWikiLinkClick(linkedItem.id);
              }}
            >
              {linkedItem.title}
            </span>
          </span>
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
        {href}
      </a>
    );
  };

  const CustomList = ({ ordered, children }: any) => {
    const ListTag = ordered ? "ol" : "ul";
    return <ListTag className="list-inside ml-4 my-2">{children}</ListTag>;
  };

  const CustomListItem = ({ children }: any) => {
    return <li className="list-disc my-1">{children}</li>;
  };

  return (
    <div>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => <div className="my-2">{children}</div>,
          a: CustomLink,
          ul: CustomList,
          li: CustomListItem,
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
