"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleDescriptionProps {
  description: string;
  maxLines?: number;
}

export function CollapsibleDescription({
  description,
  maxLines = 3,
}: CollapsibleDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description || description.trim() === "") {
    return null;
  }

  const formattedDescription = description
    .split("\n")
    .map((line, index) => (
      <p key={index} className="whitespace-pre-wrap break-words">
        {line || "\u00A0"}
      </p>
    ));

  const shouldShowToggle = description.split("\n").length > maxLines;

  return (
    <div className="bg-gray-100 rounded-lg p-4 space-y-3">
      <div
        className={
          isExpanded
            ? "space-y-2"
            : `space-y-2 line-clamp-${maxLines} overflow-hidden`
        }
        style={
          !isExpanded
            ? {
                display: "-webkit-box",
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }
            : undefined
        }
      >
        <div className="text-sm text-gray-800">{formattedDescription}</div>
      </div>

      {shouldShowToggle && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors focus:outline-none focus:underline"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Show less" : "Show more"}
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-4 h-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
