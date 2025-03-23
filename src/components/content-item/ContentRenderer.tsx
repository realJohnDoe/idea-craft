import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Content } from "@/lib/content-utils";

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
  onToggleLinkedTask,
}) => {
  const processWikilinks = (markdown: string) => {
    const regex = /\[\[(.*?)\]\]/g;
    return markdown.replace(regex, (match, content) => {
      const [title, id] = content.split("|");
      const linkId = id || content.replace(/\s+/g, "-").toLowerCase();
      return `[${title || content}](wikilink:${linkId})`;
    });
  };

  const processedContent = processWikilinks(content);

  const CustomLink = ({ href, children }) => {
    if (href.startsWith("wikilink:")) {
      const itemId = href.slice(9); // Remove 'wikilink:' prefix
      const linkedItem = allItems.find((item) => item.id === itemId);

      return (
        <a
          href={`#${itemId}`}
          className="wikilink text-blue-600 hover:underline cursor-pointer bg-blue-50 px-1 rounded"
          onClick={(e) => {
            e.preventDefault();
            onToggleLink(itemId);
          }}
        >
          [[{children}]]
        </a>
      );
    }
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
    <div onClick={handleLinkClick}>
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
