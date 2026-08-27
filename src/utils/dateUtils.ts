/**
 * Smart Date Utilities with Full Excel Serial Date Support
 */

/**
 * Converts an Excel serial date number (e.g. 46233 -> 2026-07-30) to YYYY-MM-DD
 * Excel serial date counts days since 1899-12-30 (taking into account the 1900 leap year bug).
 */
export const excelSerialToDateString = (serial: number): string | null => {
  if (isNaN(serial) || serial < 1 || serial > 2958465) return null; // Range 1900 to 9999
  
  // Excel base epoch: 1970-01-01 is serial 25569
  // 86400000 ms per day
  const utcMilliseconds = Math.round((serial - 25569) * 86400 * 1000);
  const date = new Date(utcMilliseconds);
  
  if (isNaN(date.getTime())) return null;

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Universal smart date parser.
 * Supports:
 * - Excel serial numbers: "46233", 46233, "46233.0"
 * - DD/MM/YYYY or D/M/YYYY or DD-MM-YYYY (e.g. 23/07/2026, 5/8/2026)
 * - YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-07-23)
 * - Dates with timestamps: "23/07/2026 07:02:30", "2026-07-23T14:30:00.000Z"
 * - DD.MM.YYYY: "23.07.2026"
 * - Compact YYYYMMDD: "20260723"
 */
export const parseDateString = (val?: string | number | null): string => {
  if (val === undefined || val === null) return '';
  const str = String(val).trim().replace(/^['\"`]+|['\"`]+$/g, '');
  if (!str) return '';

  // 1. Check if it's an Excel serial date number (e.g., "46233", 46233, "46233.0")
  // Typically between 10000 (1927) and 80000 (2119)
  const num = Number(str);
  if (!isNaN(num) && num >= 1000 && num <= 100000) {
    const fromSerial = excelSerialToDateString(num);
    if (fromSerial) return fromSerial;
  }

  // 2. Extract date portion if it has time attached (e.g. "23/07/2026 07:02:30" or "2026-07-23T...")
  const cleanDatePart = str.split(/[T\s]/)[0].trim();

  // 3. DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const dmyMatch = cleanDatePart.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // 4. YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  const ymdMatch = cleanDatePart.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (ymdMatch) {
    const [, year, month, day] = ymdMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // 5. YYYYMMDD (8 digits)
  const compactMatch = cleanDatePart.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    const [, year, month, day] = compactMatch;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    if (y >= 1900 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return `${year}-${month}-${day}`;
    }
  }

  return cleanDatePart;
};

/**
 * Universal display formatter: Formats any date string (or Excel serial) to DD/MM/YYYY
 */
export const formatDateDisplay = (dateStr?: string | number | null): string => {
  if (!dateStr) return '-';
  const str = String(dateStr).trim();
  if (!str) return '-';

  // If it's an Excel serial date number
  const num = Number(str);
  if (!isNaN(num) && num >= 1000 && num <= 100000) {
    const iso = excelSerialToDateString(num);
    if (iso) {
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
    }
  }

  // If it's standard YYYY-MM-DD
  const parts = str.split(/[T\s]/)[0].split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  // If already DD/MM/YYYY
  if (str.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    return str;
  }

  // Try parsing with smart parser
  const parsed = parseDateString(str);
  if (parsed && parsed.includes('-')) {
    const p = parsed.split('-');
    if (p.length === 3) {
      return `${p[2]}/${p[1]}/${p[0]}`;
    }
  }

  return str;
};
