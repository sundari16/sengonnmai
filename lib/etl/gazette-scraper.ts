// Tamil Nadu Official Gazette scraper configuration and event extraction helpers.
// Gazette is published at https://gazette.tn.gov.in — new issues Tuesday/Friday.
// This module provides types and parsing helpers; actual HTTP calls are done server-side.

import type { TimelineEvent } from '@/lib/timeline-data'
import { GAZETTE_CATEGORY_KEYWORDS } from './pipeline-config'

export type GazettePart =
  | 'Part_I'    // Acts passed by TN Legislature
  | 'Part_II'   // Ordinances, Rules
  | 'Part_III'  // Notifications (GOs, appointments)
  | 'Part_IV'   // Statutory Rules & Orders
  | 'Part_V'    // Advertisements (public notices, tenders)

export type RawGazetteEntry = {
  go_number: string        // e.g. "G.O.Ms.No.123"
  department: string       // Department name as in Gazette
  date_str: string         // "12th May 2026"
  subject_en: string       // Subject line from Gazette
  part: GazettePart
  page_ref: string
  gazette_issue_no: string
  gazette_date: string
}

export type ParsedGazetteEvent = {
  raw: RawGazetteEntry
  year: number
  month: number
  event_en: string
  category: TimelineEvent['category']
  significance: TimelineEvent['significance']
  cm: string
  source_en: string
}

// Determine category by keyword matching on subject line
export function classifyGazetteCategory(subject: string): TimelineEvent['category'] {
  const lower = subject.toLowerCase()
  for (const [cat, keywords] of Object.entries(GAZETTE_CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return cat as TimelineEvent['category']
    }
  }
  return 'policy' // default
}

// Determine significance based on GO type and subject
export function assessSignificance(entry: RawGazetteEntry): TimelineEvent['significance'] {
  const subject = entry.subject_en.toLowerCase()
  // High: Acts, ordinances, major scheme launches, CM-level orders
  if (
    entry.part === 'Part_I' ||
    entry.part === 'Part_II' ||
    subject.includes('scheme') && subject.includes('launch') ||
    subject.includes('chief minister') ||
    subject.includes('new policy') ||
    subject.includes('ordinance')
  ) {
    return 'high'
  }
  // Low: routine appointments, minor notifications, advertisements
  if (
    entry.part === 'Part_V' ||
    subject.includes('appointment of') ||
    subject.includes('transfer of') ||
    subject.includes('leave') ||
    subject.includes('tender')
  ) {
    return 'low'
  }
  return 'medium'
}

// Convert raw gazette date string to year + month
export function parseGazetteDate(dateStr: string): { year: number; month: number } {
  const MONTHS: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  }
  const lower = dateStr.toLowerCase()
  let year = 0
  let month = 1
  const yearMatch = lower.match(/(\d{4})/)
  if (yearMatch) year = parseInt(yearMatch[1], 10)
  for (const [name, num] of Object.entries(MONTHS)) {
    if (lower.includes(name)) { month = num; break }
  }
  return { year, month }
}

// Map gazette department name to our dept slug
export function mapDeptNameToSlug(gazetteDeptName: string): string {
  const lower = gazetteDeptName.toLowerCase()
  const DEPT_NAME_MAP: [string, string][] = [
    ['finance', 'finance'],
    ['health', 'health'],
    ['education', 'higher-education'],
    ['school education', 'school-education'],
    ['home', 'home'],
    ['revenue', 'revenue'],
    ['welfare', 'welfare'],
    ['agriculture', 'agriculture'],
    ['public works', 'public-works'],
    ['transport', 'transport'],
    ['energy', 'energy'],
    ['industries', 'industries'],
    ['labour', 'labour'],
    ['environment', 'environment'],
    ['rural development', 'rural-development'],
    ['housing', 'housing'],
    ['municipalities', 'municipal-administration'],
    ['fisheries', 'fisheries'],
    ['law', 'law'],
    ['planning', 'planning'],
    ['tourism', 'tourism'],
    ['information technology', 'it'],
    ['cooperation', 'cooperation'],
    ['forests', 'environment'],
    ['prison', 'prison'],
    ['personnel', 'personnel'],
  ]
  for (const [pattern, slug] of DEPT_NAME_MAP) {
    if (lower.includes(pattern)) return slug
  }
  return 'secretariat-admin' // fallback
}

// Build a ParsedGazetteEvent from a RawGazetteEntry
export function parseGazetteEntry(raw: RawGazetteEntry, currentCM: string): ParsedGazetteEvent {
  const { year, month } = parseGazetteDate(raw.date_str)
  const category = classifyGazetteCategory(raw.subject_en)
  const significance = assessSignificance(raw)
  const source_en = `TN Gazette ${raw.part.replace('_', ' ')}, Issue No.${raw.gazette_issue_no} dated ${raw.gazette_date} (${raw.go_number})`
  return {
    raw,
    year,
    month,
    event_en: raw.subject_en,
    category,
    significance,
    cm: currentCM,
    source_en,
  }
}

// Filter only events worth adding to the timeline (skip routine)
export function isTimelineWorthy(parsed: ParsedGazetteEvent): boolean {
  return parsed.significance !== 'low'
}

// Convert ParsedGazetteEvent to a TimelineEvent ready for insertion
export function toTimelineEvent(parsed: ParsedGazetteEvent): Omit<TimelineEvent, 'event_ta'> {
  return {
    year:       parsed.year,
    month:      parsed.month,
    event_en:   parsed.event_en,
    category:   parsed.category,
    significance: parsed.significance,
    cm:         parsed.cm,
    source_en:  parsed.source_en,
  }
}
