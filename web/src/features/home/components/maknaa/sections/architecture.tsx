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
import {
  Blocks,
  ChevronDown,
  Code,
  Server,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'

import { AnimateInView } from '@/components/animate-in-view'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  MAKNAA_ARCHITECTURE,
  MAKNAA_SECTION_IDS,
  type MaknaaTierColor,
} from '@/features/home/maknaa-content'
import { cn } from '@/lib/utils'

import { GridPattern } from '../grid-pattern'
import { SectionHeading } from '../section-heading'
import { SectionWrapper } from '../section-wrapper'

const TIER_ICONS: readonly LucideIcon[] = [Server, Code, Blocks]

const TIER_GRADIENT: Record<MaknaaTierColor, string> = {
  cyan: 'from-mk-cyan to-mk-blue',
  blue: 'from-mk-blue to-mk-purple',
  purple: 'from-mk-purple to-mk-cyan',
}

const TIER_BORDER: Record<MaknaaTierColor, string> = {
  cyan: 'border-mk-cyan/30',
  blue: 'border-mk-blue/30',
  purple: 'border-mk-purple/30',
}

/** Animated dashed link between two architecture tiers. Decorative. */
function TierConnector() {
  return (
    <div aria-hidden='true' className='flex justify-center py-2'>
      <svg width='2' height='24' className='opacity-30'>
        <line
          x1='1'
          y1='0'
          x2='1'
          y2='24'
          stroke='#00f0ff'
          strokeWidth='1'
          strokeDasharray='4 4'
        >
          <animate
            attributeName='stroke-dashoffset'
            from='0'
            to='-16'
            dur='1s'
            repeatCount='indefinite'
          />
        </line>
      </svg>
    </div>
  )
}

export function MaknaaArchitecture() {
  // Single-open accordion, matching the source design: reopening the same tier
  // collapses it rather than leaving every tier expanded at once.
  const [expandedTier, setExpandedTier] = useState<number | null>(null)

  const toggleTier = (index: number) => {
    setExpandedTier((current) => (current === index ? null : index))
  }

  return (
    <SectionWrapper
      id={MAKNAA_SECTION_IDS.architecture}
      background='secondary'
      className='relative'
    >
      <GridPattern />

      <div className='relative'>
        <AnimateInView animation='fade-up'>
          <SectionHeading
            subtitle={MAKNAA_ARCHITECTURE.subtitle}
            title={MAKNAA_ARCHITECTURE.title}
            description={MAKNAA_ARCHITECTURE.description}
            className='mb-16'
          />
        </AnimateInView>

        <div className='mx-auto max-w-3xl space-y-4'>
          {MAKNAA_ARCHITECTURE.tiers.map((tier, index) => {
            const TierIcon = TIER_ICONS[index] ?? Server
            const gradient = TIER_GRADIENT[tier.color]
            const isLast = index === MAKNAA_ARCHITECTURE.tiers.length - 1

            return (
              <AnimateInView
                key={tier.name}
                animation='fade-up'
                delay={index * 150}
              >
                <div
                  className={cn(
                    'overflow-hidden rounded-xl border transition-all',
                    TIER_BORDER[tier.color]
                  )}
                >
                  <Collapsible
                    open={expandedTier === index}
                    onOpenChange={() => toggleTier(index)}
                  >
                    <CollapsibleTrigger className='group/tier hover:bg-mk-bg-card flex w-full items-center justify-between p-6 text-left'>
                      <span className='flex items-center gap-4'>
                        <span
                          className={cn(
                            'flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br',
                            gradient
                          )}
                        >
                          <TierIcon
                            className='size-5 text-white'
                            aria-hidden='true'
                          />
                        </span>
                        <span>
                          <span className='text-mk-text-primary block text-lg font-semibold'>
                            {tier.name}
                          </span>
                          <span className='text-mk-text-muted block font-mono text-xs'>
                            {tier.nameEn}
                          </span>
                        </span>
                      </span>
                      <ChevronDown
                        className='text-mk-text-secondary size-5 shrink-0 transition-transform duration-300 group-data-[panel-open]/tier:rotate-180'
                        aria-hidden='true'
                      />
                    </CollapsibleTrigger>

                    <CollapsibleContent className='CollapsibleContent'>
                      <div className='border-t border-white/5 px-6 pt-2 pb-6'>
                        <p className='text-mk-text-secondary mb-4 text-sm leading-relaxed'>
                          {tier.details}
                        </p>
                        <ul className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                          {tier.items.map((item) => (
                            <li
                              key={item}
                              className='text-mk-text-secondary flex items-center gap-2 text-sm'
                            >
                              <span
                                className={cn(
                                  'size-1.5 shrink-0 rounded-full bg-gradient-to-r',
                                  gradient
                                )}
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {!isLast && <TierConnector />}
              </AnimateInView>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
