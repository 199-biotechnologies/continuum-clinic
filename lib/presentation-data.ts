// Continuum Clinic Introduction Presentation Data
// 25-slide pitch deck showcasing our dual model: Clinic + Research

export interface Slide {
  id: number
  type: 'title' | 'content' | 'split' | 'quote' | 'stats' | 'image' | 'closing'
  title?: string
  subtitle?: string
  content?: string[]
  quote?: string
  author?: string
  stats?: { value: string; label: string }[]
  image?: string
  layout?: 'center' | 'left' | 'right'
}

export const presentationSlides: Slide[] = [
  // OPENING
  {
    id: 1,
    type: 'title',
    title: 'The Continuum Clinic',
    subtitle: "World's First Veterinary Longevity Centre",
    layout: 'center'
  },
  {
    id: 2,
    type: 'quote',
    quote: "We take care of humanity's best companions. Not to ride the wave of longevity — but because we truly care.",
    author: 'Our Mission'
  },
  {
    id: 3,
    type: 'content',
    title: 'The Challenge',
    content: [
      'Our pets age 7 times faster than we do',
      'Average dog lifespan: just 10-13 years',
      'Cancer, arthritis, cognitive decline steal their youth',
      'Current veterinary medicine treats symptoms, not root causes',
      'Pet owners willing to invest but lack access to cutting-edge science'
    ]
  },

  // MARKET OPPORTUNITY
  {
    id: 4,
    type: 'stats',
    title: 'A £9 Billion Opportunity',
    stats: [
      { value: '£9.03B', label: 'Global companion animal health market (2024)' },
      { value: '£18.75B', label: 'Projected market by 2034' },
      { value: '12.3%', label: 'Annual growth rate' },
      { value: '£382.6M', label: 'Veterinary regenerative medicine (2025)' }
    ]
  },

  // OUR SOLUTION - TWO PILLARS
  {
    id: 5,
    type: 'title',
    title: 'Our Solution',
    subtitle: 'Two Pillars. One Mission.',
    layout: 'center'
  },
  {
    id: 6,
    type: 'split',
    title: 'The Continuum Model',
    content: [
      '**THE CLINIC**: Where we deliver today\nWorld-class longevity care. London-based. Evidence-driven protocols. Measuring everything.',
      '**THE RESEARCH**: What we bring tomorrow\nProcyanidin C1 variants. Gene therapies. Epigenetic reprogramming. Cutting the root cause of disease.'
    ]
  },

  // CLINIC ARM - THE BEST IN THE WORLD
  {
    id: 7,
    type: 'title',
    title: 'The Clinic',
    subtitle: 'Building the World's First Veterinary Longevity Centre',
    layout: 'center'
  },
  {
    id: 8,
    type: 'content',
    title: 'World-Class by Design',
    content: [
      '**Location**: 12 Upper Wimpole Street, London W1G 6LW',
      '**Architecture**: DOMO Architecture + Design',
      '— Award-winning luxury interior design',
      '— High-glamour hospitality aesthetic',
      '— Bespoke fit-out for clinical excellence',
      '**Experience**: More than a clinic. A sanctuary.'
    ]
  },
  {
    id: 9,
    type: 'content',
    title: 'The Expert Team',
    content: [
      '**Professor David Sinclair** — Harvard, pioneering NAD+ and aging biology',
      '**Dr. Avi Roy** — Cancer immunotherapy, personalized medicine',
      '**Boris Djordjevic** — Founder, 199 Biotechnologies, epigenetic reprogramming',
      '**World-class veterinarians** — Trained in oncology, regenerative medicine, longevity protocols',
      '',
      'We assembled the best minds in longevity — for your pets.'
    ]
  },
  {
    id: 10,
    type: 'content',
    title: 'Celebrity Clientele',
    content: [
      'Trusted by those who demand the best',
      'Confidential, luxury service',
      'Concierge veterinary care',
      'Global partnerships for continuity of care',
      '',
      'When only the best will do — for the ones you love most.'
    ]
  },

  // WHAT WE DO NOW
  {
    id: 11,
    type: 'content',
    title: 'What We Do Today',
    content: [
      '**Longitudinal Health Management**',
      '— AI-assisted molecular profiling and biomarker tracking',
      '— Continuous health monitoring, not annual check-ups',
      '',
      '**Evidence-Based Longevity Pharmacology**',
      '— Rapamycin (mTOR inhibition)',
      '— SGLT2 inhibitors (metabolic optimization)',
      '— Acarbose (glucose control)',
      '',
      '**Advanced Diagnostics**',
      '— Genomic testing, epigenetic clocks, proteomics'
    ]
  },
  {
    id: 12,
    type: 'content',
    title: 'Beyond Drugs: Cell & Gene Therapies',
    content: [
      '**AAV Gene Therapies** (Adeno-Associated Virus)',
      '— Follistatin (muscle preservation)',
      '— Klotho (neuroprotection, kidney health)',
      '— TERT (telomerase activation)',
      '',
      '**Cell Therapies**',
      '— NK cells (natural killer cell therapy for cancer)',
      '— Mesenchymal stem cells (regenerative protocols)',
      '',
      'Delivering tomorrow's medicine — today.'
    ]
  },
  {
    id: 13,
    type: 'quote',
    quote: 'We don't just treat disease. We track, measure, and prove efficacy. 100% evidence-based. Zero speculation.',
    author: 'The Continuum Standard'
  },
  {
    id: 14,
    type: 'content',
    title: 'Why We're Different',
    content: [
      '**Transparency**: Every protocol explained at a level no science can dispute',
      '**Measurement**: Biomarker tracking before, during, after — always',
      '**Trust**: We publish data. We show results. We admit unknowns.',
      '**Precision**: Personalized protocols, not one-size-fits-all',
      '',
      'We are creating the trail. We are the first. We are the best.'
    ]
  },

  // RESEARCH ARM - WHAT'S COMING
  {
    id: 15,
    type: 'title',
    title: 'The Research',
    subtitle: 'Bringing Breakthrough Science to Veterinary Medicine',
    layout: 'center'
  },
  {
    id: 16,
    type: 'content',
    title: 'Why Research Matters',
    content: [
      'We don't wait for academia to validate',
      'We are practical. We are fast.',
      'What we care about: **extending youth for those we love most**',
      '',
      'Our research arm exists to bring Nature's most potent therapies to your pet — not in 10 years, but now.'
    ]
  },

  // PROCYANIDIN C1
  {
    id: 17,
    type: 'content',
    title: 'Procyanidin C1: Nature's Senolytic',
    content: [
      '**Published in Nature Metabolism (2021)**',
      '— 10% lifespan extension in aged mice',
      '— Selectively eliminates senescent cells (the root cause of aging)',
      '— At low doses: inhibits inflammation',
      '— At high doses: kills damaged cells',
      '',
      '**The Challenge**: Extract is rare, expensive, inaccessible',
      '**Our Solution**: Synthesize procyanidin C1 variants for veterinary use'
    ]
  },
  {
    id: 18,
    type: 'content',
    title: 'Making PCC1 Accessible',
    content: [
      'Cutting the root cause of disease isn't a luxury',
      "It's a necessity",
      '',
      '**Our Goal**: Bring procyanidin C1 from lab to clinic',
      '— Veterinary-specific formulations',
      '— Drug regulatory pipeline (EMA, FDA-CVM)',
      '— Affordable, scalable manufacturing',
      '',
      'Not just for a few. For everyone.'
    ]
  },

  // DRUG REPURPOSING
  {
    id: 19,
    type: 'content',
    title: 'Drug Repurposing: Proven Safety, New Purpose',
    content: [
      '**Rapamycin** — mTOR inhibitor, extends lifespan across species',
      '**Metformin** — Metabolic health, diabetes prevention',
      '**SGLT2 Inhibitors** — Cardioprotection, kidney health',
      '**Acarbose** — Glucose regulation, lifespan extension in mice',
      '',
      'Decades of human safety data. Now optimized for pets.'
    ]
  },

  // GENE THERAPIES
  {
    id: 20,
    type: 'content',
    title: 'Gene Therapies: Rewriting Biology',
    content: [
      '**AAV Vectors** (Adeno-Associated Virus)',
      '— Safe, non-integrating, durable expression',
      '',
      '**Follistatin** — Preserves muscle mass, combats sarcopenia',
      '**Klotho** — Neuroprotection, anti-aging systemic effects',
      '**TERT** — Telomerase activation (controversial but promising)',
      '',
      'One injection. Lifelong benefits.'
    ]
  },

  // EPIGENETIC REPROGRAMMING
  {
    id: 21,
    type: 'content',
    title: 'Epigenetic Reprogramming: The Future',
    content: [
      '**The Insight**: Cells aren't broken. They're locked in the wrong program.',
      '',
      '**199 Biotechnologies Research**:',
      '— Partial reprogramming (Yamanaka factors, controlled)',
      '— Cancer reprogramming (E-ON-001 for glioblastoma)',
      '— Transcription factor therapies for cancer',
      '',
      'We don't just slow aging. We reverse epigenetic damage.'
    ]
  },
  {
    id: 22,
    type: 'stats',
    title: '199 Biotechnologies Pipeline',
    stats: [
      { value: '100+', label: 'Senolytic compounds screened' },
      { value: 'E-ON-001', label: 'Lead cancer reprogramming candidate (GBM)' },
      { value: '10x cheaper', label: 'Longevity diagnostics vs. traditional labs' },
      { value: 'Epigenetic', label: 'Root cause treatment, not symptom management' }
    ]
  },

  // THE VISION
  {
    id: 23,
    type: 'quote',
    quote: 'From repurposing drugs to gene therapies to epigenetic reprogramming — we are at the cutting edge. Not because it's trendy. Because it works.',
    author: 'Our Commitment'
  },
  {
    id: 24,
    type: 'content',
    title: 'The Path Forward',
    content: [
      '**Year 1**: Clinic launch, establish protocols, build celebrity clientele',
      '**Year 2**: Procyanidin C1 veterinary trials, EMA regulatory submission',
      '**Year 3**: Gene therapy partnerships, epigenetic pilot programs',
      '**Year 5**: Global network, proprietary diagnostic platform, published outcomes',
      '',
      "We're not just building a clinic. We're building an industry."
    ]
  },

  // CLOSING
  {
    id: 25,
    type: 'closing',
    title: 'Join Us',
    subtitle: 'The future of veterinary medicine starts here.',
    content: [
      'Book a consultation',
      'Become a partner',
      'Invest in the future',
      '',
      'info@thecontinuumclinic.com',
      '+44 20 1234 5678',
      'thecontinuumclinic.com'
    ]
  }
]
