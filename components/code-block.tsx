'use client';

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  if (!inline) {
    return (
      <div className="not-prose flex flex-col max-w-full min-w-0 overflow-hidden">
        <pre
          {...props}
          className={`text-sm w-full max-w-full overflow-x-auto dark:bg-zinc-900 p-3 sm:p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
        >
          <code className="whitespace-pre-wrap break-words text-xs sm:text-sm">{children}</code>
        </pre>
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md break-words`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
