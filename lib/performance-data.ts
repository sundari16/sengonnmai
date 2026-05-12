import type { PerformanceMetric } from '@/types'

export type CMEra = {
  cm: string
  party: string
  start_year: number
  end_year: number
}

// ── CM eras ──────────────────────────────────────────────────────

export const CM_ERAS: CMEra[] = [
  { cm: 'C. Rajagopalachari', party: 'INC', start_year: 1952, end_year: 1954 },
  { cm: 'K. Kamaraj', party: 'INC', start_year: 1954, end_year: 1963 },
  { cm: 'M. Bhaktavatsalam', party: 'INC', start_year: 1963, end_year: 1967 },
  { cm: 'C. N. Annadurai', party: 'DMK', start_year: 1967, end_year: 1969 },
  { cm: 'M. Karunanidhi', party: 'DMK', start_year: 1969, end_year: 1971 },
  { cm: 'M. Karunanidhi', party: 'DMK', start_year: 1971, end_year: 1976 },
  { cm: 'M. G. Ramachandran', party: 'AIADMK', start_year: 1977, end_year: 1987 },
  { cm: 'Janaki Ramachandran', party: 'AIADMK', start_year: 1988, end_year: 1988 },
  { cm: 'M. Karunanidhi', party: 'DMK', start_year: 1989, end_year: 1991 },
  { cm: 'J. Jayalalithaa', party: 'AIADMK', start_year: 1991, end_year: 1996 },
  { cm: 'M. Karunanidhi', party: 'DMK', start_year: 1996, end_year: 2001 },
  { cm: 'J. Jayalalithaa', party: 'AIADMK', start_year: 2001, end_year: 2006 },
  { cm: 'M. Karunanidhi', party: 'DMK', start_year: 2006, end_year: 2011 },
  { cm: 'J. Jayalalithaa', party: 'AIADMK', start_year: 2011, end_year: 2016 },
  { cm: 'E. K. Palaniswami', party: 'AIADMK', start_year: 2017, end_year: 2021 },
  { cm: 'M. K. Stalin', party: 'DMK', start_year: 2021, end_year: 2026 },
]

function cmForYear(year: number): CMEra {
  return (
    CM_ERAS.slice().reverse().find(e => e.start_year <= year) ??
    { cm: 'Unknown', party: 'Unknown', start_year: year, end_year: year }
  )
}

// ── ERA 1947–1991 ─────────────────────────────────────────────────

export const METRICS_1947_1991: PerformanceMetric[] = [
  // Literacy rate
  { id: 'lit-1951', year: 1951, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '18.7%', unit: '%', source: 'Census 1951', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'social', cm_name: 'C. Rajagopalachari', party: 'INC' },
  { id: 'lit-1961', year: 1961, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '36.4%', unit: '%', source: 'Census 1961', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'social', cm_name: 'M. Bhaktavatsalam', party: 'INC' },
  { id: 'lit-1971', year: 1971, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '39.5%', unit: '%', source: 'Census 1971', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'social', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'lit-1981', year: 1981, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '54.4%', unit: '%', source: 'Census 1981', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'social', cm_name: 'M. G. Ramachandran', party: 'AIADMK' },
  { id: 'lit-1991', year: 1991, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '62.7%', unit: '%', source: 'Census 1991', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'social', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },

  // IMR
  { id: 'imr-1971', year: 1971, metric_en: 'Infant Mortality Rate (per 1,000 live births)', metric_ta: 'குழந்தை இறப்பு விகிதம் (1,000 பிறப்புக்கு)', value: '113', unit: 'per 1000', source: 'RBI Historical Data', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'health', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'imr-1981', year: 1981, metric_en: 'Infant Mortality Rate (per 1,000 live births)', metric_ta: 'குழந்தை இறப்பு விகிதம் (1,000 பிறப்புக்கு)', value: '91', unit: 'per 1000', source: 'RBI Historical Data', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'health', cm_name: 'M. G. Ramachandran', party: 'AIADMK' },
  { id: 'imr-1991', year: 1991, metric_en: 'Infant Mortality Rate (per 1,000 live births)', metric_ta: 'குழந்தை இறப்பு விகிதம் (1,000 பிறப்புக்கு)', value: '57', unit: 'per 1000', source: 'RBI Historical Data', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'health', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },

  // GSDP
  { id: 'gsdp-1951', year: 1951, metric_en: 'GSDP (₹ crore, current prices)', metric_ta: 'மாநில உள்நாட்டு உற்பத்தி (₹ கோடி)', value: 'approx 800', unit: '₹ Cr', source: 'Planning Commission', source_url: 'https://mospi.gov.in', data_quality: 'estimated', era: '1947_1991', category: 'economy', cm_name: 'C. Rajagopalachari', party: 'INC' },
  { id: 'gsdp-1961', year: 1961, metric_en: 'GSDP (₹ crore, current prices)', metric_ta: 'மாநில உள்நாட்டு உற்பத்தி (₹ கோடி)', value: 'approx 2200', unit: '₹ Cr', source: 'Planning Commission', source_url: 'https://mospi.gov.in', data_quality: 'estimated', era: '1947_1991', category: 'economy', cm_name: 'M. Bhaktavatsalam', party: 'INC' },
  { id: 'gsdp-1971', year: 1971, metric_en: 'GSDP (₹ crore, current prices)', metric_ta: 'மாநில உள்நாட்டு உற்பத்தி (₹ கோடி)', value: '5,847', unit: '₹ Cr', source: 'RBI Historical Data', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'economy', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'gsdp-1981', year: 1981, metric_en: 'GSDP (₹ crore, current prices)', metric_ta: 'மாநில உள்நாட்டு உற்பத்தி (₹ கோடி)', value: '18,500', unit: '₹ Cr', source: 'RBI Historical Data', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'economy', cm_name: 'M. G. Ramachandran', party: 'AIADMK' },
  { id: 'gsdp-1991', year: 1991, metric_en: 'GSDP (₹ crore, current prices)', metric_ta: 'மாநில உள்நாட்டு உற்பத்தி (₹ கோடி)', value: '62,000', unit: '₹ Cr', source: 'RBI Historical Data · Planning Commission', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'economy', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },

  // School enrollment
  { id: 'enroll-1951', year: 1951, metric_en: 'School enrollment ratio', metric_ta: 'பள்ளி சேர்க்கை விகிதம்', value: '35%', unit: '%', source: 'Census data · DISE predecessor', source_url: 'https://censusindia.gov.in', data_quality: 'estimated', era: '1947_1991', category: 'education', cm_name: 'C. Rajagopalachari', party: 'INC' },
  { id: 'enroll-1961', year: 1961, metric_en: 'School enrollment ratio', metric_ta: 'பள்ளி சேர்க்கை விகிதம்', value: '54%', unit: '%', source: 'Census 1961', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'education', cm_name: 'M. Bhaktavatsalam', party: 'INC' },
  { id: 'enroll-1971', year: 1971, metric_en: 'School enrollment ratio', metric_ta: 'பள்ளி சேர்க்கை விகிதம்', value: '68%', unit: '%', source: 'Census 1971', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'education', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'enroll-1981', year: 1981, metric_en: 'School enrollment ratio', metric_ta: 'பள்ளி சேர்க்கை விகிதம்', value: '74%', unit: '%', source: 'Census 1981', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1947_1991', category: 'education', cm_name: 'M. G. Ramachandran', party: 'AIADMK' },

  // Fiscal deficit
  { id: 'fiscal-1981', year: 1981, metric_en: 'Fiscal deficit (% GSDP)', metric_ta: 'நிதி பற்றாக்குறை (GSDP %)', value: '2.8%', unit: '%', source: 'RBI State Finances', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'fiscal', cm_name: 'M. G. Ramachandran', party: 'AIADMK' },
  { id: 'fiscal-1991', year: 1991, metric_en: 'Fiscal deficit (% GSDP)', metric_ta: 'நிதி பற்றாக்குறை (GSDP %)', value: '3.6%', unit: '%', source: 'RBI State Finances', source_url: 'https://rbi.org.in', data_quality: 'available', era: '1947_1991', category: 'fiscal', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
]

// ── ERA 1991–PRESENT ─────────────────────────────────────────────

const GSDP_GROWTH: Array<[number, number]> = [
  [1992, 4.2], [1993, 5.1], [1994, 6.8], [1995, 7.2], [1996, 8.1],
  [1997, 5.4], [1998, 7.8], [1999, 6.9], [2000, 8.3], [2001, 4.1],
  [2002, 3.2], [2003, 5.8], [2004, 7.4], [2005, 9.2], [2006, 10.1],
  [2007, 11.3], [2008, 10.8], [2009, 8.2], [2010, 7.1], [2011, 12.4],
  [2012, 11.8], [2013, 8.9], [2014, 7.6], [2015, 8.2], [2016, 9.4],
  [2017, 8.8], [2018, 7.9], [2019, 8.1], [2020, 6.8], [2021, -1.2],
  [2022, 10.4], [2023, 8.6], [2024, 8.2],
]

export const METRICS_1991_PRESENT: PerformanceMetric[] = [
  ...GSDP_GROWTH.map(([year, val]) => {
    const era = cmForYear(year)
    return {
      id: `gsdp-growth-${year}`,
      year,
      metric_en: 'GSDP growth rate',
      metric_ta: 'GSDP வளர்ச்சி விகிதம்',
      value: `${val}%`,
      unit: '%',
      source: 'MOSPI · TN Directorate of Economics and Statistics',
      source_url: 'https://mospi.gov.in',
      data_quality: 'available' as const,
      era: '1991_present' as const,
      category: 'economy' as const,
      cm_name: era.cm,
      party: era.party,
    }
  }),

  // IMR — NFHS rounds
  { id: 'imr-nfhs1', year: 1993, metric_en: 'Infant Mortality Rate (NFHS-1)', metric_ta: 'குழந்தை இறப்பு விகிதம் (NFHS-1)', value: '57', unit: 'per 1000', source: 'NFHS-1 1992-93', source_url: 'https://rchiips.org/nfhs', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
  { id: 'imr-nfhs2', year: 1999, metric_en: 'Infant Mortality Rate (NFHS-2)', metric_ta: 'குழந்தை இறப்பு விகிதம் (NFHS-2)', value: '52', unit: 'per 1000', source: 'NFHS-2 1998-99', source_url: 'https://rchiips.org/nfhs', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'imr-nfhs3', year: 2006, metric_en: 'Infant Mortality Rate (NFHS-3)', metric_ta: 'குழந்தை இறப்பு விகிதம் (NFHS-3)', value: '35', unit: 'per 1000', source: 'NFHS-3 2005-06', source_url: 'https://rchiips.org/nfhs', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'imr-nfhs4', year: 2016, metric_en: 'Infant Mortality Rate (NFHS-4)', metric_ta: 'குழந்தை இறப்பு விகிதம் (NFHS-4)', value: '24', unit: 'per 1000', source: 'NFHS-4 2015-16', source_url: 'https://rchiips.org/nfhs', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
  { id: 'imr-nfhs5', year: 2021, metric_en: 'Infant Mortality Rate (NFHS-5)', metric_ta: 'குழந்தை இறப்பு விகிதம் (NFHS-5)', value: '19', unit: 'per 1000', source: 'NFHS-5 2019-21', source_url: 'https://rchiips.org/nfhs/nfhs-5.shtml', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'E. K. Palaniswami / M. K. Stalin', party: 'AIADMK / DMK' },

  // Institutional delivery
  { id: 'instdel-nfhs3', year: 2006, metric_en: 'Institutional delivery rate (NFHS-3)', metric_ta: 'மருத்துவமனை பிரசவ விகிதம் (NFHS-3)', value: '85.1%', unit: '%', source: 'NFHS-3', source_url: 'https://rchiips.org/nfhs', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'M. Karunanidhi', party: 'DMK' },
  { id: 'instdel-nfhs4', year: 2016, metric_en: 'Institutional delivery rate (NFHS-4)', metric_ta: 'மருத்துவமனை பிரசவ விகிதம் (NFHS-4)', value: '98.4%', unit: '%', source: 'NFHS-4', source_url: 'https://rchiips.org/nfhs', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
  { id: 'instdel-nfhs5', year: 2021, metric_en: 'Institutional delivery rate (NFHS-5)', metric_ta: 'மருத்துவமனை பிரசவ விகிதம் (NFHS-5)', value: '99.7%', unit: '%', source: 'NFHS-5', source_url: 'https://rchiips.org/nfhs/nfhs-5.shtml', data_quality: 'available', era: '1991_present', category: 'health', cm_name: 'E. K. Palaniswami / M. K. Stalin', party: 'AIADMK / DMK' },

  // Literacy
  { id: 'lit-2001', year: 2001, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '73.5%', unit: '%', source: 'Census 2001', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1991_present', category: 'social', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
  { id: 'lit-2011', year: 2011, metric_en: 'Literacy rate', metric_ta: 'எழுத்தறிவு விகிதம்', value: '80.1%', unit: '%', source: 'Census 2011', source_url: 'https://censusindia.gov.in', data_quality: 'available', era: '1991_present', category: 'social', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },

  // Poverty
  { id: 'poverty-1994', year: 1994, metric_en: 'Poverty headcount ratio (Tendulkar method)', metric_ta: 'வறுமை விகிதம்', value: '35.5%', unit: '%', source: 'Planning Commission (Tendulkar method)', source_url: 'https://mospi.gov.in', data_quality: 'available', era: '1991_present', category: 'social', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
  { id: 'poverty-2005', year: 2005, metric_en: 'Poverty headcount ratio (Tendulkar method)', metric_ta: 'வறுமை விகிதம்', value: '28.9%', unit: '%', source: 'Planning Commission (Tendulkar method)', source_url: 'https://mospi.gov.in', data_quality: 'available', era: '1991_present', category: 'social', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
  { id: 'poverty-2012', year: 2012, metric_en: 'Poverty headcount ratio (Tendulkar method)', metric_ta: 'வறுமை விகிதம்', value: '15.8%', unit: '%', source: 'Planning Commission — Note: post-2011 methodology changed', source_url: 'https://mospi.gov.in', data_quality: 'available', era: '1991_present', category: 'social', cm_name: 'J. Jayalalithaa', party: 'AIADMK' },
]

// ── Export helpers ────────────────────────────────────────────────

export function getMetricsByEra(era: string): PerformanceMetric[] {
  if (era === '1947_1991') return METRICS_1947_1991
  if (era === '1991_present') return METRICS_1991_PRESENT
  return [...METRICS_1947_1991, ...METRICS_1991_PRESENT]
}

export function getMetricsByCategory(cat: string): PerformanceMetric[] {
  return [...METRICS_1947_1991, ...METRICS_1991_PRESENT].filter(m => m.category === cat)
}

export function getCMEras(): CMEra[] {
  return CM_ERAS
}
