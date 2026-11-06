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
import { ArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import { scrollToSection } from '@/features/home/lib/scroll-to-section'
import {
  MAKNAA_HERO,
  MAKNAA_SECTION_IDS,
  MAKNAA_SITE,
} from '@/features/home/maknaa-content'

const PARTICLE_COUNT = 20

/** Deterministic pseudo-random spread, so re-renders never reshuffle. */
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  duration: `${3 + (i % 4)}s`,
  delay: `${i * 0.2}s`,
}))

export function MaknaaHero() {
  const { t } = useTranslation()

  return (
    <section className='relative flex min-h-screen items-center justify-center overflow-hidden'>
      <div className='bg-mk-bg-primary to-mk-bg-secondary absolute inset-0 bg-gradient-to-br' />
      <div
        aria-hidden='true'
        className='mk-animate-gradient-shift absolute inset-0 opacity-30'
        style={{
          background: [
            'radial-gradient(ellipse at 30% 20%, rgba(0, 240, 255, 0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 70% 60%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
          ].join(', '),
          backgroundSize: '400% 400%',
        }}
      />

      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 overflow-hidden'
      >
        {PARTICLES.map((particle) => (
          <span
            key={`${particle.left}-${particle.top}`}
            className='mk-animate-float-up bg-mk-cyan/30 absolute size-1 rounded-full'
            style={{
              left: particle.left,
              top: particle.top,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>

      <div className='relative z-10 mx-auto max-w-5xl px-6 text-center'>
        <AnimateInView animation='fade-in'>
          <p className='text-mk-cyan mb-6 text-sm font-medium tracking-widest uppercase md:text-base'>
            {MAKNAA_SITE.name}
          </p>
        </AnimateInView>

        <AnimateInView animation='fade-in' delay={150}>
          <h1 className='mb-4 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl'>
            <span className='from-mk-cyan via-mk-blue to-mk-purple bg-gradient-to-r bg-clip-text text-transparent'>
              {MAKNAA_HERO.title}
            </span>
          </h1>
        </AnimateInView>

        <AnimateInView animation='fade-in' delay={300}>
          <p className='text-mk-text-primary mb-8 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl'>
            {MAKNAA_HERO.titleLine2}
          </p>
        </AnimateInView>

        <AnimateInView animation='fade-in' delay={450}>
          <p className='text-mk-text-secondary mx-auto mb-10 max-w-2xl text-lg leading-relaxed md:text-xl'>
            {MAKNAA_HERO.subtitle}
          </p>
        </AnimateInView>

        <AnimateInView animation='fade-in' delay={600}>
          <div className='flex flex-col justify-center gap-4 sm:flex-row'>
            <Button
              type='button'
              onClick={() => scrollToSection(`#${MAKNAA_SECTION_IDS.contact}`)}
              className='from-mk-cyan to-mk-blue text-mk-bg-primary hover:shadow-mk-cyan/20 h-auto cursor-pointer rounded-full bg-gradient-to-r px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl'
            >
              {t('Get Started')}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => scrollToSection(`#${MAKNAA_SECTION_IDS.about}`)}
              className='border-mk-cyan/30 text-mk-cyan hover:bg-mk-cyan/5 h-auto cursor-pointer rounded-full border px-8 py-4 text-base font-semibold transition-all hover:-translate-y-0.5'
            >
              {t('Learn More')}
            </Button>
          </div>
        </AnimateInView>
      </div>

      <Button
        type='button'
        variant='ghost'
        size='icon'
        onClick={() => scrollToSection(`#${MAKNAA_SECTION_IDS.about}`)}
        aria-label={t('Scroll down to learn more')}
        className='mk-animate-bounce-y text-mk-text-muted hover:text-mk-cyan absolute bottom-8 left-1/2 size-auto cursor-pointer hover:bg-transparent'
      >
        <ArrowDown className='size-5' />
      </Button>
    </section>
  )
}
