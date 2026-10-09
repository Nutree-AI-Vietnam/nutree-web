interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders schema.org data as a JSON-LD script tag. The script body has to be raw JSON, which
 * React would escape as a text child, so it goes through dangerouslySetInnerHTML; escaping `<`
 * stops a value containing `</script>` from closing the tag early.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
