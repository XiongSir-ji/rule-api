/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  /** Uppercase eyebrow line above the title. Brand copy, not translated. */
  subtitle: string
  /** Section title. Brand copy, not translated. */
  title: string
  /** Optional supporting paragraph under the title. */
  description?: string
  align?: 'center' | 'left'
  accent?: 'cyan' | 'emerald'
  className?: string
}

const ACCENT_CLASS = {
  cyan: 'text-mk-cyan',
  emerald: 'text-mk-emerald',
} as const

const ALIGN_CLASS = {
  center: 'mx-auto text-center',
  left: 'text-left',
} as const

/**
 * The eyebrow + title (+ optional description) block shared by every landing
 * section, so the spacing, casing and accent colours cannot drift apart.
 */
export function SectionHeading(props: SectionHeadingProps) {
  const align = props.align ?? 'center'
  const accent = props.accent ?? 'cyan'

  return (
    <div className={cn(ALIGN_CLASS[align], props.className)}>
      <p
        className={cn(
          'mb-3 text-sm font-medium tracking-wider uppercase',
          ACCENT_CLASS[accent]
        )}
      >
        {props.subtitle}
      </p>
      <h2
        className={cn(
          'text-3xl font-bold md:text-4xl',
          props.description && 'mb-4'
        )}
      >
        {props.title}
      </h2>
      {props.description && (
        <p
          className={cn(
            'text-mk-text-secondary',
            align === 'center' && 'mx-auto max-w-2xl'
          )}
        >
          {props.description}
        </p>
      )}
    </div>
  )
}
