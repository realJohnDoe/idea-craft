import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Content } from "@/lib/content-utils";

interface ContentRendererProps {
  content: string;
  allItems?: Content[];
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
        console.log("Invalid link:", href);
        return <span className="text-red-500">[[Invalid Link]]</span>;
      }

      // Render as a checkable task if the item has task attributes
      if ("done" in linkedItem) {
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={linkedItem.done}
              onChange={(e) => {
                if (onTaskToggle) {
                  onTaskToggle(linkedItem.id, e.target.checked);
                }
              }}
            />
            <span
              className="cursor-pointer hover:underline"
              onClick={() => {
                navigate(`/item/${linkedItem.id}`);
                handleWikiLinkClick(linkedItem.id);
              }}
            >
              {linkedItem.title}
            </span>
          </div>
        );
      }

      // Render as a regular link with the item's title
      return (
        <a
          className="hover:underline cursor-pointer bg-background px-1 pb-1 rounded"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/item/${linkedItem.id}`);
            handleWikiLinkClick(linkedItem.id);
          }}
        >
          {linkedItem.title}
        </a>
      );
    }

    // For external links, keep existing behavior
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
        components={{
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
