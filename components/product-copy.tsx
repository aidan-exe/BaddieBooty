export function ProductCopy({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) {
  if (!html.trim()) return null;
  return (
    <div
      className={`product-copy text-sm leading-6 text-muted ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
