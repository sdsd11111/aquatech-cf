/**
 * Utilidades para el manejo de fechas y horas forzadas a la zona horaria de Ecuador.
 * Esto evita el desfase de UTC en servidores como Vercel y locales.
 */

export const ECUADOR_TIMEZONE = 'America/Guayaquil';

/**
 * Obtiene un objeto Date que representa el "ahora" en la zona horaria de Ecuador.
 */
export function getLocalNow(): Date {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: ECUADOR_TIMEZONE }));
}

/**
 * Formatea una fecha para visualización en formato local de Ecuador.
 */
export function formatToEcuador(date: Date | string | number | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  return d.toLocaleString('es-EC', {
    timeZone: ECUADOR_TIMEZONE,
    hour12: true,
    ...options
  });
}

/**
 * Helper para mostrar solo la hora (HH:mm AM/PM) en Ecuador
 */
export function formatTimeEcuador(date: Date | string | number | null | undefined): string {
  return formatToEcuador(date, { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Helper para mostrar solo la fecha (DD/MM/YYYY) en Ecuador
 */
export function formatDateEcuador(date: Date | string | number | null | undefined): string {
  return formatToEcuador(date, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Helper para mostrar fecha larga (D de mes de YYYY) en Ecuador
 */
export function formatDateLongEcuador(date: Date | string | number | null | undefined): string {
  return formatToEcuador(date, { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Fuerza que un string de fecha (de input) sea interpretado en la zona de Ecuador (-05:00)
 */
export function forceEcuadorTZ(dtStr: string | null | undefined): string {
  if (!dtStr) return '';
  if (dtStr.includes('Z') || dtStr.includes('-0') || dtStr.includes('+')) return dtStr;
  // dtStr formato normal es YYYY-MM-DDTHH:mm, le agregamos segundos y offset
  return dtStr + ':00-05:00';
}

/**
 * Formatea una fecha para <input type="datetime-local"> en la zona de Ecuador.
 */
export function formatForDateTimeInput(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ECUADOR_TIMEZONE
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', options);
  const parts = formatter.formatToParts(d);
  const find = (type: string) => parts.find(p => p.type === type)?.value;
  
  return `${find('year')}-${find('month')}-${find('day')}T${find('hour')}:${find('minute')}`;
}

/**
 * Retorna fecha ISO en zona de Ecuador (YYYY-MM-DD)
 */
export function toEcuadorISODate(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: ECUADOR_TIMEZONE };
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(d);
  return `${parts.find(p => p.type === 'year')?.value}-${parts.find(p => p.type === 'month')?.value}-${parts.find(p => p.type === 'day')?.value}`;
}
