/**
 * Minimal RFC 4180 CSV read/write. Template descriptions routinely contain
 * commas and quotes, so naive split(',') corrupts them — hence a real parser
 * rather than a one-liner. Excel/Sheets/Numbers all round-trip this format.
 */

function escapeCell(value: unknown): string {
  const s = value === null || value === undefined ? '' : String(value);
  // Quote when the value contains a delimiter, quote, newline, or edge spaces.
  return /[",\r\n]|^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: (keyof T & string)[]
): string {
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((c) => escapeCell(row[c])).join(','));
  }
  // Trailing newline keeps POSIX tools and git diffs happy.
  return lines.join('\r\n') + '\r\n';
}

/**
 * Parses CSV into objects keyed by the header row. Handles quoted fields,
 * escaped quotes (""), and newlines inside quoted cells.
 */
export function parseCsv(text: string): Record<string, string>[] {
  // Strip a UTF-8 BOM — Excel adds one and it corrupts the first header name.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++; // consume the escaped pair
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\r') {
      // handled by the \n branch; CRLF and bare LF both terminate a row
    } else if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  // Final row when the file doesn't end in a newline.
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim() !== ''));
  if (!header) return [];

  return body.map((cells) => {
    const obj: Record<string, string> = {};
    header.forEach((name, i) => {
      obj[name.trim()] = (cells[i] ?? '').trim();
    });
    return obj;
  });
}
