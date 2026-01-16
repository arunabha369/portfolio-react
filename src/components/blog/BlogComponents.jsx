import Image from '@/components/ui/Image';
import React from 'react';
import { CodeCopyButton } from './CodeCopyButton';
export const BlogComponents = {
  // Override default image component
  img: ({
    src,
    alt,
    ...props
  }) => <Image src={src} alt={alt} width={800} height={400} className="rounded-lg" {...props} />,
  // Custom heading with better styling
  h1: ({
    children,
    ...props
  }) => <h1 className="mb-6 text-4xl font-bold" {...props}>
      {children}
    </h1>,
  h2: ({
    children,
    ...props
  }) => <h2 className="mt-8 mb-4 text-3xl font-semibold" {...props}>
      {children}
    </h2>,
  h3: ({
    children,
    ...props
  }) => <h3 className="mt-6 mb-3 text-2xl font-medium" {...props}>
      {children}
    </h3>,
  // Custom paragraph styling
  p: ({
    children,
    ...props
  }) => <p className="text-muted-foreground mb-4 leading-7" {...props}>
      {children}
    </p>,
  // Custom list styling
  ul: ({
    children,
    ...props
  }) => <ul className="mb-4 ml-6 list-disc space-y-2" {...props}>
      {children}
    </ul>,
  ol: ({
    children,
    ...props
  }) => <ol className="mb-4 ml-6 list-decimal space-y-2" {...props}>
      {children}
    </ol>,
  li: ({
    children,
    ...props
  }) => <li className="text-muted-foreground leading-7" {...props}>
      {children}
    </li>,
  pre: ({
    children,
    ...props
  }) => {
    const getTextContent = node => {
      if (typeof node === 'string') {
        return node;
      }
      if (typeof node === 'number') {
        return String(node);
      }
      if (React.isValidElement(node) && node.props && typeof node.props === 'object') {
        return getTextContent(node.props.children);
      }
      if (Array.isArray(node)) {
        return node.map(getTextContent).join('');
      }
      return '';
    };
    const codeText = getTextContent(children);
    return <div className="group relative mb-4">
        <pre className="bg-muted/30 overflow-x-auto rounded-lg border p-4 text-sm [&>code]:bg-transparent [&>code]:p-0" {...props}>
          {children}
        </pre>
        <CodeCopyButton code={codeText} />
      </div>;
  },
  // Inline code styling (not affected by syntax highlighting)
  code: ({
    children,
    className,
    ...props
  }) => {
    // If it's part of a pre block (syntax highlighted), don't apply inline styling
    if (className?.includes('language-')) {
      return <code className={className} {...props}>
          {children}
        </code>;
    }

    // Inline code styling
    return <code className="rounded px-2 py-1 font-mono text-sm" {...props}>
        {children}
      </code>;
  },
  // Custom blockquote styling
  blockquote: ({
    children,
    ...props
  }) => <blockquote className="border-primary text-muted-foreground mb-4 border-l-4 pl-4 italic" {...props}>
      {children}
    </blockquote>
};