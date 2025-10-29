export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalBusiness', 'Veterinarian', 'LocalBusiness'],
        '@id': 'https://thecontinuumclinic.com/#organization',
        name: 'Continuum Clinic',
        alternateName: 'The Continuum Clinic',
        url: 'https://thecontinuumclinic.com',
        logo: 'https://thecontinuumclinic.com/logo.png',
        description: 'London-based veterinary longevity centre specializing in companion animal health optimization, regenerative medicine, and advanced therapeutics.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '12 Upper Wimpole Street',
          addressLocality: 'London',
          postalCode: 'W1G 6LW',
          addressCountry: 'GB'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 51.5194,
          longitude: -0.1482
        },
        telephone: '+44 20 1234 5678',
        email: 'info@thecontinuumclinic.com',
        priceRange: '£££',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00'
          }
        ],
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom'
        },
        sameAs: [
          'https://twitter.com/continuumclinic',
          'https://linkedin.com/company/continuum-clinic'
        ],
        medicalSpecialty: [
          'Veterinary Longevity Medicine',
          'Regenerative Medicine',
          'Gene Therapy',
          'Cell Therapy',
          'Veterinary Oncology'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://thecontinuumclinic.com/#website',
        url: 'https://thecontinuumclinic.com',
        name: 'Continuum Clinic',
        description: 'Veterinary longevity medicine for companion animals',
        publisher: {
          '@id': 'https://thecontinuumclinic.com/#organization'
        },
        inLanguage: ['en-GB', 'es-ES', 'fr-FR', 'zh-CN', 'ru-RU', 'ar-SA']
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://thecontinuumclinic.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is veterinary longevity medicine?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Veterinary longevity medicine focuses on extending healthspan and lifespan in companion animals through evidence-based interventions including pharmacological protocols, gene therapy, cell therapy, and advanced diagnostics.'
            }
          },
          {
            '@type': 'Question',
            name: 'What species do you treat?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We primarily work with dogs, offering longitudinal health management, molecular diagnostics, and advanced therapeutics. We provide evidence-guided protocols for individual patients.'
            }
          },
          {
            '@type': 'Question',
            name: 'What is rapamycin and how is it used in dogs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Rapamycin is an mTOR inhibitor with demonstrated lifespan extension in multiple species. We use it in dogs as part of comprehensive longevity protocols, with dose titration based on continuous biomarker monitoring and clinical assessment.'
            }
          },
          {
            '@type': 'Question',
            name: 'Do you offer gene therapy for pets?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we offer AAV-mediated gene therapy with clinical-grade vectors including follistatin, Klotho, and TERT. All gene therapies are administered under sterile conditions with comprehensive pre-treatment assessment and post-treatment monitoring.'
            }
          },
          {
            '@type': 'Question',
            name: 'Where are you located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Continuum Clinic is located at 12 Upper Wimpole Street, London W1G 6LW, United Kingdom. We also offer telemedicine consultations for follow-up appointments and protocol adjustments.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I book a consultation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can book a consultation through our website booking form, by email at info@thecontinuumclinic.com, or by phone at +44 20 1234 5678. Initial consultations are typically 60-90 minutes and include comprehensive clinical assessment.'
            }
          }
        ]
      },
      {
        '@type': 'Service',
        '@id': 'https://thecontinuumclinic.com/#services',
        serviceType: 'Veterinary Longevity Medicine',
        provider: {
          '@id': 'https://thecontinuumclinic.com/#organization'
        },
        areaServed: {
          '@type': 'Country',
          name: 'United Kingdom'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Veterinary Longevity Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Longitudinal Health Assessment',
                description: 'Clinical evaluation, imaging, and molecular profiling with AI-assisted biomarker analysis'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Pharmacological Intervention',
                description: 'Evidence-guided longevity pharmacology including rapamycin, procyanidin C1, SGLT2 inhibitors, and acarbose'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Gene Therapy',
                description: 'AAV-mediated gene therapy with follistatin, Klotho, and TERT'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Cell Therapy',
                description: 'Autologous and allogeneic NK cells, mesenchymal stem cells'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Veterinary Oncology',
                description: 'Molecular characterization and multi-modal therapy design'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Advanced Diagnostics',
                description: 'Genomic sequencing, metabolomics, proteomics, serial biomarker tracking'
              }
            }
          ]
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
