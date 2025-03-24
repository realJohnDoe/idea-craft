import React from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Content } from "@/lib/content-utils";

interface ContentRendererProps {
  content: string;
  allItems?: Content[];
  handleWikiLinkClick: (wikilinkId: string) => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  allItems = [],
  handleWikiLinkClick,
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

  const CustomLink = ({ href, children }) => {
    const navigate = useNavigate();

    if (href.startsWith("#")) {
      const itemId = href.slice(1);
      const linkedItem = allItems.find((item) => item.id === itemId);

      if (!linkedItem) {
        console.log("Invalid link:", href);
        return <span className="text-red-500">[[Invalid Link]]</span>;
      }

      return (
        <a
          className="hover:underline cursor-pointer bg-background px-1 pb-1 rounded"
          onClick={(e) => {
            e.preventDefault();
            if (linkedItem) {
              navigate(`/item/${linkedItem.id}`); // Use React Router navigation
              handleWikiLinkClick(linkedItem.id);
            }
          }}
        >
          {children}
        </a>
      );
    }

    // For external links, keep existing behavior
    return (
      <a href={href} className="text-blue-600 hover:underline">
        {children}
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
