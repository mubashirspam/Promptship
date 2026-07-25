/**
 * Renders a JSON-LD structured-data block. Used across template pages for
 * rich results (Google) and to help generative engines (ChatGPT, Perplexity,
 * AI Overviews) understand and cite the catalog.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, server-built content — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
