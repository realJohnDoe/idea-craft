import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@/lib/content-utils";
import { cn } from "@/lib/utils";

interface ContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const ContentTextarea: React.FC<ContentTextareaProps> = ({
  value,
  onChange,
}) => {
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const [suggestionPosition, setSuggestionPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ["content-items"],
    queryFn: async () => {
      const { getMockData } = await import("@/lib/content-utils");
      return getMockData();
    },
  });

  const calculateSuggestionPosition = () => {
    if (!textareaRef.current || cursorPosition === null) return;

    const textarea = textareaRef.current;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lines = textBeforeCursor.split("\n");
    const currentLineText = lines[lines.length - 1];
    const currentLineLength = currentLineText.length;

    // Create a temporary span to measure text width
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.style.font = window.getComputedStyle(textarea).font;
    span.textContent = currentLineText;
    document.body.appendChild(span);

    const computedStyle = window.getComputedStyle(textarea);
    const paddingLeft = parseFloat(computedStyle.paddingLeft);
    const lineHeight =
      parseFloat(computedStyle.lineHeight) ||
      parseFloat(computedStyle.fontSize) * 1.2;
    const rect = textarea.getBoundingClientRect();

    // Position horizontally based on cursor position in current line
    const textWidth = Math.min(
      span.getBoundingClientRect().width,
      textarea.clientWidth - paddingLeft * 2
    );

    // Position vertically based on current line
    const scrollTop = textarea.scrollTop;
    const currentLineTop = (lines.length - 1) * lineHeight;
    const visibleTop = currentLineTop - scrollTop;

    document.body.removeChild(span);

    // Position the suggestion box
    const top = rect.top + visibleTop + lineHeight + window.scrollY;
    const left = rect.left + paddingLeft + textWidth + window.scrollX;

    setSuggestionPosition({ top, left });
  };

  useEffect(() => {
    if (cursorPosition === null) return;

    const textBeforeCursor = value.substring(0, cursorPosition);
    const match = textBeforeCursor.match(/\[\[([^\]]*?)$/);

    if (match) {
      const searchText = match[1];
      setSearchTerm(searchText);
      setShowSuggestions(true);
      setSelectedIndex(0);
      calculateSuggestionPosition();
    } else {
      setShowSuggestions(false);
    }
  }, [value, cursorPosition]);

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown" &&
      e.key !== "Tab" &&
      e.key !== "Enter"
    ) {
      setCursorPosition(e.currentTarget.selectionStart);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    const filteredSuggestions = allItems
      .filter(
        (item) =>
          !searchTerm ||
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Tab":
      case "Enter":
        if (filteredSuggestions.length > 0) {
          e.preventDefault();
          handleSelectSuggestion(filteredSuggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleSelectSuggestion = (item: Content) => {
    if (cursorPosition === null) return;

    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);

    const lastOpenBracketIndex = textBeforeCursor.lastIndexOf("[[");

    if (lastOpenBracketIndex !== -1) {
      const newText =
        textBeforeCursor.substring(0, lastOpenBracketIndex) +
        `[[${item.title}]]` +
        textAfterCursor;

      onChange(newText);
      setShowSuggestions(false);

      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = lastOpenBracketIndex + item.title.length + 4;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 10);
    }
  };

  const filteredSuggestions = allItems
    .filter(
      (item) =>
        !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        placeholder="Enter your content. You can link to other items using [[title of item]]"
        value={value}
        onChange={handleChange}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        onClick={() =>
          setCursorPosition(textareaRef.current?.selectionStart || null)
        }
        rows={5}
        className="resize-none"
      />

      {showSuggestions && (
        <div
          ref={suggestionBoxRef}
          className="fixed z-50 w-64 bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95"
          style={{
            top: `${suggestionPosition.top}px`,
            left: `${suggestionPosition.left}px`,
          }}
        >
          <div className="py-1 max-h-[200px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Loading suggestions...</span>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              <div>
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full text-left px-3 py-2 hover:bg-muted/50 outline-none",
                      index === selectedIndex && "bg-muted"
                    )}
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {item.content.substring(0, 40)}
                      {item.content.length > 40 ? "..." : ""}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-3 text-sm text-muted-foreground">
                No matches found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTextarea;
