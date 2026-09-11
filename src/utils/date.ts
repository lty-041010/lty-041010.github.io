import dayjs from 'dayjs'

export function formatDate(d: string | Date, fmt = 'YYYY-MM-DD'): string {
  return dayjs(d).format(fmt)
}

export function formatDateCN(d: string | Date): string {
  return dayjs(d).format('YYYY 年 M 月 D 日')
}

export function getYear(d: string | Date): string {
  return dayjs(d).format('YYYY')
}