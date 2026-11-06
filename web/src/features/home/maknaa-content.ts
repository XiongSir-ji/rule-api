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
/**
 * MAKNAA landing page copy.
 *
 * Everything here is brand/marketing content and is intentionally kept out of
 * the i18n catalog: the source site ships a single English edition, and the
 * navigation labels deliberately mirror the section headings they scroll to, so
 * translating one without the other would desynchronize the page.
 *
 * Interactive chrome — buttons, form labels, placeholders and status messages —
 * stays translatable and is written as literal `t('...')` calls in the
 * components instead.
 */

export const MAKNAA_SITE = {
  name: 'MAKNAA GROUP SDN. BHD.',
  shortName: 'MAKNAA',
  tagline: 'Boundless Compute, Connected Future',
  url: 'https://www.maknaagroup.com',
} as const

/**
 * Header logo assets copied from the source project into `web/public/maknaa`.
 * The `srcSet` mirrors the source markup so small screens never download 64px.
 */
export const MAKNAA_LOGO = {
  src: '/maknaa/header-logo-32.png',
  srcSet:
    '/maknaa/header-logo-32.png 32w, /maknaa/header-logo-48.png 48w, /maknaa/header-logo-64.png 64w',
  sizes: '32px',
} as const

/** Anchor targets rendered by the landing sections. */
export const MAKNAA_SECTION_IDS = {
  about: 'maknaa-about',
  services: 'maknaa-services',
  architecture: 'maknaa-architecture',
  gpu: 'maknaa-gpu',
  compliance: 'maknaa-compliance',
  contact: 'maknaa-contact',
} as const

export type MaknaaSectionId =
  (typeof MAKNAA_SECTION_IDS)[keyof typeof MAKNAA_SECTION_IDS]

export interface MaknaaNavItem {
  label: string
  /** In-page anchor; every entry scrolls to a section rendered on this page. */
  href: `#${MaknaaSectionId}`
}

export const MAKNAA_NAV: readonly MaknaaNavItem[] = [
  { label: 'About Us', href: `#${MAKNAA_SECTION_IDS.about}` },
  { label: 'Services', href: `#${MAKNAA_SECTION_IDS.services}` },
  { label: 'Architecture', href: `#${MAKNAA_SECTION_IDS.architecture}` },
  { label: 'GPU Compatibility', href: `#${MAKNAA_SECTION_IDS.gpu}` },
  { label: 'Compliance', href: `#${MAKNAA_SECTION_IDS.compliance}` },
  { label: 'Contact', href: `#${MAKNAA_SECTION_IDS.contact}` },
] as const

export const MAKNAA_HERO = {
  title: 'Boundless Compute',
  titleLine2: 'Connected Future',
  subtitle: 'Leading AI Heterogeneous Compute Cloud Platform in Asia-Pacific',
} as const

export const MAKNAA_ABOUT = {
  title: 'About Us',
  subtitle: 'Democratizing Compute, Bridging Regions',
  story: [
    'MAKNAA GROUP SDN. BHD. was founded to address a widespread industry challenge: the extreme imbalance in global high-end compute resource distribution, the high cost of cross-border compute scheduling, and the prohibitive expense of building private data centers for small and mid-size technology companies. Against the backdrop of explosive growth in cloud gaming, generative AI, and advanced semiconductor simulation, most overseas compute providers remain concentrated in North America and Europe. The Asia-Pacific region suffers from scarce compute nodes, high latency, and steep access barriers.',
    'Our founding team has deep expertise in intelligent IoT and server operations. Over the years, we have continuously supported Asia-Pacific technology companies with hardware integration, network optimization, and compute deployment. Driven by insight into the supply-demand gap in Asia-Pacific compute infrastructure, we established MAKNAA in Malaysia as a commercially focused compute technology company — positioned as a neutral compute hub connecting the Asia-Pacific to the rest of the world.',
  ],
  vision:
    'Unlike traditional large-scale compute providers that rely on heavy-asset, locality-bound data center models, MAKNAA adopts a "Distributed Cross-Border Node" business architecture. We prioritize establishing connectivity between Malaysia, Southeast Asia, and the Americas, delivering low-barrier, highly reliable, and compliant GPU compute services to companies in biopharmaceuticals, integrated circuits, and robotics R&D.',
  stats: [
    { value: '3', suffix: '', label: 'Global Compute Nodes' },
    { value: '99.9', suffix: '%', label: 'Service Availability' },
    { value: '8', suffix: '+', label: 'Compatible GPU Models' },
    { value: 'PB', suffix: '-Scale', label: 'Data Processing Capacity' },
  ],
} as const

export type MaknaaServiceIcon = 'Cpu' | 'Brain' | 'Zap' | 'Database'

export interface MaknaaService {
  icon: MaknaaServiceIcon
  title: string
  description: string
  features: readonly string[]
}

export const MAKNAA_SERVICES = {
  title: 'Our Services',
  subtitle: 'Full-Stack AI Compute Infrastructure',
  items: [
    {
      icon: 'Cpu',
      title: 'GPU Compute Leasing',
      description:
        'Logically merge multi-node GPU resources under a unified interface for scheduling and management. Full support for NVIDIA H20, A10, A800, B300, RTX 4090/5090, and all data-center-grade compute cards.',
      features: [
        'Unified Heterogeneous GPU Management',
        'Memory-Hour Billing',
        'Hardware Health Monitoring',
      ],
    },
    {
      icon: 'Brain',
      title: 'Large Model Training',
      description:
        'Distributed parallel training, model fine-tuning, and incremental iterative training. Natively adapted for DeepSeek and Llama open-source multimodal large models, with built-in CUDA acceleration toolkit.',
      features: [
        'Distributed Parallel Training',
        'Training Progress Monitoring',
        'Automated Resource Allocation',
      ],
    },
    {
      icon: 'Zap',
      title: 'Model Inference Service',
      description:
        'API-based inference, standalone container deployment, and private isolated node inference. Dynamic batching, model quantization compression, and inference engine acceleration.',
      features: [
        'High-Concurrency API Calls',
        'Model Quantization Compression',
        'Intelligent Queue Scheduling',
      ],
    },
    {
      icon: 'Database',
      title: 'PB-Scale Data Processing',
      description:
        'Batch processing for images, audio, video, and structured data. AI-assisted annotation, noise removal, data sharding, compression, and transcoding.',
      features: [
        'Multi-Format Support',
        'Intelligent Annotation',
        'Distributed Sharding',
      ],
    },
  ],
} as const satisfies {
  title: string
  subtitle: string
  items: readonly MaknaaService[]
}

export type MaknaaTierColor = 'cyan' | 'blue' | 'purple'

export interface MaknaaTier {
  name: string
  nameEn: string
  color: MaknaaTierColor
  items: readonly string[]
  details: string
}

export const MAKNAA_ARCHITECTURE = {
  title: 'System Architecture',
  subtitle: 'End-Edge-Cloud Full-Stack Closed-Loop Architecture',
  description:
    'Our platform follows industry-standard architecture, divided into Infrastructure Layer, Platform Service Layer, and Application Ecosystem Layer. Each layer is independently scalable and loosely coupled, supporting modular iteration.',
  tiers: [
    {
      name: 'Infrastructure Layer',
      nameEn: 'Infrastructure Layer',
      color: 'cyan',
      items: [
        'Global Compute Pooling',
        'Hardware Health Monitoring',
        'Disaster Recovery',
        'Auto Load Balancing',
      ],
      details:
        'The Malaysia hub serves as the central control node. Southeast Asian relay nodes handle low-latency cross-border data forwarding, while distributed nodes in the Americas carry out offshore model training tasks.',
    },
    {
      name: 'Platform Service Layer',
      nameEn: 'Platform Layer',
      color: 'blue',
      items: [
        'PB-Scale Data Processing Module',
        'Large Model Training Module',
        'Model Inference Module',
        'Heterogeneous Compute Management Module',
      ],
      details:
        'Natively adapted for DeepSeek and Llama open-source multimodal large models, integrated with NVIDIA CUDA acceleration libraries and GPU parallel computing toolkit.',
    },
    {
      name: 'Application Ecosystem Layer',
      nameEn: 'Application Layer',
      color: 'purple',
      items: [
        'Biopharmaceutical AI Compute',
        'Integrated Circuit Simulation',
        'Embodied Robotics R&D',
        'Cloud Video Rendering',
      ],
      details:
        'Deeply integrated with high-end manufacturing industries, providing scenario-specific compute services for companies in biopharmaceuticals, integrated circuits, and robotics R&D.',
    },
  ],
} as const satisfies {
  title: string
  subtitle: string
  description: string
  tiers: readonly MaknaaTier[]
}

export const MAKNAA_GPU = {
  title: 'GPU Compatibility',
  subtitle: 'Full Data-Center-Grade Compute Card Support',
  description:
    'Natively compatible with NVIDIA CUDA 11.8 and 12.2 stable releases. Also supports NVIDIA Container Toolkit and GPU virtualization scheduling toolkit.',
  productPageUrl: 'https://www.nvidia.com/en-us/data-center/products/',
  cards: [
    {
      name: 'NVIDIA B300',
      category: 'Data Center',
      memory: '192GB HBM3e',
      badge: 'Latest',
    },
    {
      name: 'NVIDIA B200',
      category: 'Data Center',
      memory: '192GB HBM3e',
      badge: 'Latest',
    },
    {
      name: 'NVIDIA H200',
      category: 'Data Center',
      memory: '141GB HBM3e',
      badge: 'Mainstay',
    },
    {
      name: 'NVIDIA H100',
      category: 'Data Center',
      memory: '80GB HBM3',
      badge: '',
    },
    {
      name: 'NVIDIA A100',
      category: 'Data Center',
      memory: '80GB HBM2e',
      badge: '',
    },
    {
      name: 'RTX 5090',
      category: 'Workstation',
      memory: '32GB GDDR7',
      badge: 'Enterprise',
    },
    {
      name: 'RTX 4090',
      category: 'Workstation',
      memory: '24GB GDDR6X',
      badge: '',
    },
    {
      name: 'RTX Pro 6000',
      category: 'Workstation',
      memory: '48GB GDDR6',
      badge: '',
    },
  ],
} as const

export type MaknaaComplianceIcon = 'Shield' | 'Lock' | 'Globe'

export const MAKNAA_COMPLIANCE = {
  title: 'Compliance',
  subtitle: 'Lawful Operations, Secure & Compliant',
  items: [
    {
      icon: 'Shield',
      title: 'Information Security Standards',
      description:
        'All compute nodes, data center equipment, and data processing workflows strictly comply with Malaysian information security regulations and the Personal Data Protection Act.',
    },
    {
      icon: 'Lock',
      title: 'Hardware Usage Compliance',
      description:
        'All GPU servers are used exclusively for our own compute cloud platform operations. There is no hardware resale, unauthorized leasing, or any form of illegal redistribution.',
    },
    {
      icon: 'Globe',
      title: 'International Trade Compliance',
      description:
        'We hold valid international trade operating qualifications. All hardware imports/exports and cross-border compute transfers strictly adhere to international trade regulations.',
    },
  ],
} as const satisfies {
  title: string
  subtitle: string
  items: readonly {
    icon: MaknaaComplianceIcon
    title: string
    description: string
  }[]
}

export const MAKNAA_CONTACT = {
  title: 'Contact Us',
  subtitle: 'Get Your Custom Compute Solution',
  info: {
    address:
      '11, Lorong Setia Bistari 4, Bukit Damansara, 50490 Kuala Lumpur, Malaysia',
    email: 'official@maknaagroup.com',
    phone: '+60 103629168',
  },
  responseNote:
    'Our team will respond to your inquiry within 24 hours with a tailored compute solution.',
} as const

/**
 * Inquiry form endpoint — a third-party form backend, same as the source site.
 *
 * Visitor details (name, company, email, phone, message) are POSTed straight to
 * it from the browser, so a deployment that does not own this account must
 * override it via `VITE_MAKNAA_INQUIRY_ENDPOINT`. An empty override disables
 * submission instead of leaking inquiries to someone else's inbox.
 */
export const MAKNAA_INQUIRY_ENDPOINT =
  (import.meta.env.VITE_MAKNAA_INQUIRY_ENDPOINT as string | undefined) ??
  'https://formspree.io/f/mnpaaewe'

export const MAKNAA_FOOTER = {
  description:
    'MAKNAA GROUP SDN. BHD. — A leading AI heterogeneous compute cloud platform in Asia-Pacific, headquartered in Malaysia with compute nodes connecting the world.',
  serviceNames: [
    'GPU Compute Leasing',
    'Large Model Training',
    'Model Inference',
    'Data Processing',
  ],
  copyright: '© 2026 MAKNAA GROUP SDN. BHD. All Rights Reserved.',
  businessScope:
    'Business Scope: Computer Equipment Installation | IT Services | Data Processing | International Trade',
} as const
