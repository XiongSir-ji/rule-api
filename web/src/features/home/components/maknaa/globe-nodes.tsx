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
import { useId } from 'react'

const NODES = [
  { cx: 200, cy: 130, label: 'Malaysia', color: '#00f0ff' },
  { cx: 140, cy: 170, label: 'SEA', color: '#3b82f6' },
  { cx: 60, cy: 120, label: 'Americas', color: '#8b5cf6' },
] as const

const ARCS = [
  { d: 'M 200 130 Q 170 90 140 170', stroke: 'arcGrad', dur: '2s' },
  { d: 'M 140 170 Q 100 100 60 120', stroke: 'arcGrad2', dur: '2.5s' },
  { d: 'M 60 120 Q 120 60 200 130', stroke: 'arcGrad3', dur: '3s' },
] as const

/**
 * Wireframe globe with the three compute regions, ported from the source
 * design. Purely decorative, so it is hidden from assistive technology.
 */
export function GlobeNodes() {
  const uid = useId()
  const id = (name: string) => `${name}-${uid}`

  return (
    <svg
      viewBox='0 0 280 260'
      className='h-auto w-full'
      xmlns='http://www.w3.org/2000/svg'
      role='img'
      aria-hidden='true'
      focusable='false'
    >
      <defs>
        <filter id={id('nodeGlow')}>
          <feGaussianBlur stdDeviation='4' result='coloredBlur' />
          <feMerge>
            <feMergeNode in='coloredBlur' />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
        <linearGradient id={id('arcGrad')}>
          <stop offset='0%' stopColor='#00f0ff' />
          <stop offset='100%' stopColor='#3b82f6' />
        </linearGradient>
        <linearGradient id={id('arcGrad2')}>
          <stop offset='0%' stopColor='#3b82f6' />
          <stop offset='100%' stopColor='#8b5cf6' />
        </linearGradient>
        <linearGradient id={id('arcGrad3')}>
          <stop offset='0%' stopColor='#8b5cf6' />
          <stop offset='100%' stopColor='#00f0ff' />
        </linearGradient>
      </defs>

      <circle
        cx='140'
        cy='130'
        r='100'
        fill='none'
        stroke='rgba(255,255,255,0.08)'
        strokeWidth='1'
      />
      <ellipse
        cx='140'
        cy='130'
        rx='60'
        ry='100'
        fill='none'
        stroke='rgba(255,255,255,0.04)'
        strokeWidth='1'
      />
      <ellipse
        cx='140'
        cy='130'
        rx='100'
        ry='60'
        fill='none'
        stroke='rgba(255,255,255,0.04)'
        strokeWidth='1'
      />
      <line
        x1='40'
        y1='130'
        x2='240'
        y2='130'
        stroke='rgba(255,255,255,0.04)'
        strokeWidth='1'
      />
      <line
        x1='140'
        y1='30'
        x2='140'
        y2='230'
        stroke='rgba(255,255,255,0.04)'
        strokeWidth='1'
      />

      {ARCS.map((arc) => (
        <path
          key={arc.stroke}
          d={arc.d}
          fill='none'
          stroke={`url(#${id(arc.stroke)})`}
          strokeWidth='1.5'
          strokeDasharray='6 4'
        >
          <animate
            attributeName='stroke-dashoffset'
            from='0'
            to='-20'
            dur={arc.dur}
            repeatCount='indefinite'
          />
        </path>
      ))}

      {NODES.map((node, index) => (
        <g key={node.label}>
          <circle
            cx={node.cx}
            cy={node.cy}
            r='6'
            fill={node.color}
            filter={`url(#${id('nodeGlow')})`}
          >
            <animate
              attributeName='r'
              values='6;9;6'
              dur='2s'
              begin={`${index * 0.5}s`}
              repeatCount='indefinite'
            />
          </circle>
          <circle
            cx={node.cx}
            cy={node.cy}
            r='14'
            fill='none'
            stroke={node.color}
            strokeWidth='0.5'
            opacity='0.3'
          />
          <text
            x={node.cx}
            y={node.cy + 28}
            textAnchor='middle'
            fill={node.color}
            fontSize='10'
            fontWeight='500'
            fontFamily='sans-serif'
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
