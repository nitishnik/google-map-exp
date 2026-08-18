/** ISO 3166-1 numeric ids as used by Natural Earth / world-atlas. */
export const DEST_TO_NUMERIC: Record<string, string> = {
  pl: '616',
  it: '380',
  jp: '392',
  pt: '620',
  gr: '300',
  th: '764',
}

export const NUMERIC_TO_DEST: Record<string, string> = Object.fromEntries(
  Object.entries(DEST_TO_NUMERIC).map(([id, numeric]) => [numeric, id]),
)

export function destIdFromFeatureId(id: string | number | undefined): string | null {
  if (id == null) return null
  return NUMERIC_TO_DEST[String(id)] ?? null
}
