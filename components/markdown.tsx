import Link from "next/link";
import Image from "next/image";
import React, { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Streamdown } from "streamdown";

import remarkGfm from "remark-gfm";
import { CodeBlock } from "./code-block";
import { convertToPublicIPFS } from "@/lib/utils/ipfs";

const components: Partial<Components> = {
  pre: ({ children }) => <>{children}</>,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-disc list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },

  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  img: ({ node, src, alt, ...props }) => {
    if (!src) return null;

    // Convert IPFS/Arweave URLs to public gateways
    const convertedSrc = convertToPublicIPFS(src) || src;

    return (
      <span className="relative inline-block max-w-full my-2">
        <img
          src={convertedSrc}
          alt={alt || ""}
          className="rounded-lg max-w-full h-auto"
          loading="lazy"
          onError={(e) => {
            // Hide broken images gracefully
            e.currentTarget.style.display = "none";
          }}
          {...props}
        />
      </span>
    );
  },
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <Streamdown
      remarkPlugins={remarkPlugins}
      components={components}
      className="w-full "
    >
      {children}
    </Streamdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
