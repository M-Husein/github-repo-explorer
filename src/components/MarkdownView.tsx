import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Divider } from 'antd';
import { CodeView } from '@/components/CodeView';
import { cx } from '@/utils';

export const MarkdownView = ({
  children,
  blockquoteClass,
  iframeClass,
  linkClass,
  paragraphClass,
  tableClass,
  onMounted
}: any) => {
  useEffect(() => {
    onMounted?.();
  }, []);

  const a = ({ node, className, ...props }: any) => {
    const isExternal = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(props.href) && !props.href.startsWith(window.location.origin);
    return (
      <a
        {...props}
        className={cx(className, linkClass)}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      />
    );
  }

  const blockquote = ({ node, className, ...props }: any) => (
    <blockquote {...props} className={cx("blockquote", className, blockquoteClass)} />
  );

  const code = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeView
        language={match[1]}
        {...props}
      >
        {children}
      </CodeView>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  const headerTag = ({ node, align, level, className, ...props }: any) => {
    const As = node.tagName;
    return (
      <As
        {...props}
        className={cx(align === 'center' && 'text-center', className)}
      />
    )
  }

  const hr = () => <Divider />;

  const iframe = ({ node, className, width, height, ...props }: any) => (
    <iframe
      {...props}
      className={cx("aspect-video w-full", className, iframeClass)}
    />
  );

  
  const img = ({ node, alt, className, ...props }: any) => (
    <img
      {...props}
      alt={alt || "i"}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cx("inline-block", className)}
    />
  );

  const p = ({ node, align, className, ...props }: any) => (
    <p
      {...props}
      className={cx(align === 'center' && 'text-center', className, paragraphClass)}
    />
  );

  const table = ({ node, className, ...props }: any) => (
    <div className="table-responsive">
      <table
        {...props}
        className={cx("table", className, tableClass)}
      />
    </div>
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a,
        blockquote,
        code,
        h1: headerTag,
        h2: headerTag,
        h3: headerTag,
        h4: headerTag,
        h5: headerTag,
        h6: headerTag,
        hr,
        img,
        iframe,
        p,
        table,
      }}
    >
      {(children || '').replaceAll("any,", "div")}
    </ReactMarkdown>
  );
}
