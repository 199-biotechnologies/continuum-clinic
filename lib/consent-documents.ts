import { ConsentDocument } from '@/types/consent'

// Legally researched consent documents for veterinary longevity clinic
// Based on UK veterinary regulations, RCVS guidelines, and GDPR compliance

export const CONSENT_DOCUMENTS: ConsentDocument[] = [
  {
    id: 'informed-consent-v1.0',
    type: 'informed-consent',
    version: '1.0',
    title: 'Informed Consent for Veterinary Longevity Treatment',
    effectiveDate: '2025-01-01',
    required: true,
    category: 'medical',
    content: `
# Informed Consent for Veterinary Longevity Treatment

**The Continuum Clinic - Veterinary Longevity Medicine**

## Purpose of This Consent

This consent form is designed to inform you about the nature of veterinary longevity medicine, the treatments your pet may receive, and the potential risks and benefits involved.

## Nature of Veterinary Longevity Medicine

Veterinary longevity medicine focuses on extending healthspan (the period of life spent in good health) through evidence-based interventions including:

- Pharmacological interventions (e.g., rapamycin, SGLT2 inhibitors, acarbose)
- Gene therapy (AAV-mediated delivery of therapeutic genes)
- Cell therapy (NK cells, mesenchymal stem cells)
- Advanced diagnostics (molecular profiling, biomarker tracking)
- Nutritional and lifestyle optimization

## Understanding of Treatment

I understand that:

1. **Novel Treatments**: Some treatments offered are relatively new in veterinary medicine and may not be widely adopted in standard veterinary practice.

2. **Evidence Base**: While treatments are grounded in published research and mechanistic understanding, long-term outcomes in companion animals may not be fully established.

3. **Individual Response**: Every animal responds differently to treatment. Outcomes cannot be guaranteed.

4. **Monitoring Required**: Longevity interventions require ongoing monitoring through clinical assessments and biomarker analysis.

5. **Not Emergency Care**: The Continuum Clinic does not provide emergency veterinary services. In case of emergency, I will contact my local emergency veterinary hospital.

6. **Complementary to Standard Care**: Longevity medicine complements, but does not replace, standard veterinary care for acute conditions.

## Risks and Benefits

### Potential Benefits:
- Extended healthspan and improved quality of life
- Early detection of age-related conditions
- Optimized metabolic health
- Reduced risk of certain diseases

### Potential Risks:
- Adverse reactions to medications or therapies
- Side effects (will be explained for each specific treatment)
- Uncertain long-term outcomes
- Financial investment without guaranteed results
- Need for ongoing monitoring and adjustments

## Specific Treatment Risks

### Pharmacological Interventions:
- Potential side effects specific to each medication
- Drug interactions with existing medications
- Individual intolerance or adverse reactions
- Need for dose titration and monitoring

### Gene Therapy:
- Immune response to viral vectors
- Off-target gene expression
- Unknown long-term effects
- Irreversibility of genetic modifications

### Cell Therapy:
- Injection site reactions
- Immune reactions
- Variable efficacy between individuals
- Potential for tumor formation (rare)

## Financial Responsibility

I understand that:

1. Longevity medicine involves significant costs for diagnostics, treatments, and monitoring
2. Treatment costs will be discussed before procedures
3. Insurance coverage may be limited for some interventions
4. I am financially responsible for all services rendered

## Right to Decline or Discontinue

I understand that:

1. I have the right to decline any recommended treatment
2. I may discontinue treatment at any time
3. Declining treatment will not affect other veterinary care provided

## Questions and Communication

I acknowledge that:

1. I have been given the opportunity to ask questions
2. My questions have been answered to my satisfaction
3. I understand the information provided
4. I can contact the clinic with future questions

## Consent

By accepting this consent, I acknowledge that:

- I have read and understood this document
- I have had the opportunity to ask questions
- I understand the nature, risks, and benefits of veterinary longevity medicine
- I consent to my pet receiving longevity treatments as recommended and agreed upon
- I understand this is a general consent and specific procedures may require additional consent

**This consent remains valid unless revoked in writing.**
    `
  },
  {
    id: 'liability-waiver-v1.0',
    type: 'liability-waiver',
    version: '1.0',
    title: 'Liability Waiver and Release',
    effectiveDate: '2025-01-01',
    required: true,
    category: 'legal',
    content: `
# Liability Waiver and Release of Claims

**The Continuum Clinic - Veterinary Longevity Medicine**

## Acknowledgment of Risks

I acknowledge and understand that veterinary longevity medicine involves inherent risks, including but not limited to:

1. **Treatment Risks**: Adverse reactions, side effects, complications from medications, gene therapy, or cell therapy
2. **Diagnostic Risks**: Risks associated with blood draws, imaging, and other diagnostic procedures
3. **Unpredictable Outcomes**: Individual variation in response to treatment
4. **Novel Interventions**: Use of treatments that may be relatively new in veterinary medicine

## Assumption of Risk

I voluntarily assume all risks associated with veterinary longevity treatments for my pet, including risks that are known and unknown, foreseen and unforeseen.

## Release of Liability

To the fullest extent permitted by law, I release, waive, discharge, and covenant not to sue The Continuum Clinic, its veterinarians, staff, employees, agents, and affiliated persons or entities (collectively, "Released Parties") from any and all liability for any loss, damage, injury, or death to my pet arising from or related to:

1. Treatment provided at The Continuum Clinic
2. Medications, therapies, or procedures administered
3. Advice or recommendations given
4. Use of diagnostic equipment or laboratory services

## Exceptions

This waiver does not release the Released Parties from liability for:

1. Gross negligence or willful misconduct
2. Violation of applicable veterinary regulations
3. Fraud or intentional misrepresentation

## No Guarantee of Results

I understand and acknowledge that:

1. The Released Parties make no guarantees regarding treatment outcomes
2. Veterinary medicine involves uncertainty and individual variation
3. Longevity interventions may not achieve desired results
4. Adverse outcomes may occur despite proper care

## Indemnification

I agree to indemnify and hold harmless the Released Parties from any claims, damages, losses, or expenses (including legal fees) arising from:

1. My failure to disclose relevant medical history
2. My failure to follow treatment instructions
3. Claims by third parties related to my pet
4. My breach of any agreement with The Continuum Clinic

## Acknowledgment

I acknowledge that:

1. I have read this waiver carefully
2. I understand its terms and legal effect
3. I am signing it voluntarily
4. I have been advised to seek independent legal advice if desired
5. This waiver is binding on my heirs, executors, administrators, and assigns

## Governing Law

This waiver shall be governed by and construed in accordance with the laws of England and Wales.

**By accepting this waiver, I acknowledge that I have read, understood, and agree to be bound by its terms.**
    `
  },
  {
    id: 'data-privacy-gdpr-v1.0',
    type: 'data-privacy',
    version: '1.0',
    title: 'Data Privacy and GDPR Consent',
    effectiveDate: '2025-01-01',
    required: true,
    category: 'data',
    content: `
# Data Privacy and GDPR Consent

**The Continuum Clinic - Data Protection Notice**

## Data Controller

The Continuum Clinic is the data controller for your personal data and your pet's medical data.

**Contact Details:**
- Email: info@thecontinuumclinic.com
- Address: 12 Upper Wimpole Street, London W1G 6LW

## Data We Collect

We collect and process the following categories of data:

### Personal Data (About You):
- Name, address, contact information
- Payment and billing information
- Emergency contact details
- Communication preferences

### Pet Medical Data:
- Medical history and clinical records
- Diagnostic test results and biomarker data
- Treatment plans and outcomes
- Genetic and molecular profiling data
- Photographs and imaging

### Technical Data:
- IP address and device information
- Usage data and analytics
- Cookies and tracking technologies

## Lawful Basis for Processing

We process your data under the following lawful bases:

1. **Contract Performance**: To provide veterinary services
2. **Consent**: For specific uses of data (research, marketing)
3. **Legitimate Interest**: For operational purposes and service improvement
4. **Legal Obligation**: To comply with veterinary and business regulations

## How We Use Your Data

We use your data for:

1. **Veterinary Care**: Diagnosis, treatment, and monitoring
2. **Communication**: Appointment reminders, test results, clinical updates
3. **Billing**: Invoicing and payment processing
4. **Research**: Anonymized data for clinical research (with separate consent)
5. **Service Improvement**: Quality assurance and outcome tracking
6. **Legal Compliance**: Regulatory requirements and record-keeping

## Data Sharing

We may share your data with:

1. **Veterinary Specialists**: For referrals or consultations (with your consent)
2. **Laboratories**: For diagnostic testing
3. **Insurance Providers**: For claims processing (with your authorization)
4. **Legal Authorities**: When required by law
5. **Service Providers**: IT systems, payment processors (under data processing agreements)

We do NOT sell your data to third parties.

## Data Security

We protect your data using:

- Encryption in transit and at rest
- Access controls and authentication
- Regular security audits
- Staff training on data protection
- Secure cloud storage with reputable providers

## Your Rights Under GDPR

You have the right to:

1. **Access**: Request copies of your personal data
2. **Rectification**: Correct inaccurate data
3. **Erasure**: Request deletion (subject to legal obligations)
4. **Restriction**: Limit processing in certain circumstances
5. **Portability**: Receive your data in machine-readable format
6. **Object**: Object to processing based on legitimate interests
7. **Withdraw Consent**: At any time for consent-based processing
8. **Complain**: Lodge a complaint with the Information Commissioner's Office (ICO)

## Data Retention

We retain data for:

- **Medical Records**: Minimum 7 years (RCVS requirement)
- **Financial Records**: 6 years (HMRC requirement)
- **Marketing Consent**: Until withdrawn
- **Research Data**: As specified in research protocols

## International Transfers

Some data may be transferred outside the UK/EEA to service providers in countries with adequate data protection or under appropriate safeguards (Standard Contractual Clauses).

## Research Use (Optional)

Separately, you may consent to the use of anonymized data for veterinary research and publication. This is optional and does not affect the care your pet receives.

## Consent

By accepting this privacy notice, I acknowledge that:

1. I have read and understood how my data will be processed
2. I consent to the collection and use of my personal data as described
3. I consent to the collection and use of my pet's medical data
4. I understand my rights and how to exercise them
5. I can withdraw consent at any time for consent-based processing

**For questions about data protection, please contact: info@thecontinuumclinic.com**
    `
  },
  {
    id: 'treatment-authorization-v1.0',
    type: 'treatment-authorization',
    version: '1.0',
    title: 'Treatment Authorization',
    effectiveDate: '2025-01-01',
    required: true,
    category: 'medical',
    content: `
# Treatment Authorization

**The Continuum Clinic - Authorization for Veterinary Treatment**

## General Authorization

I, as the owner or authorized agent of the pet named in this authorization, hereby authorize The Continuum Clinic and its veterinarians to:

1. **Examine** my pet and perform diagnostic procedures as deemed necessary
2. **Administer** medications, treatments, and therapies as recommended
3. **Perform** procedures, including but not limited to:
   - Blood draws and sample collection
   - Diagnostic imaging
   - Administration of pharmacological agents
   - Gene therapy procedures
   - Cell therapy procedures
   - Other longevity interventions

## Specific Authorizations

### Anesthesia and Sedation:
I authorize the use of anesthesia or sedation when deemed necessary for procedures, understanding the inherent risks involved.

### Emergency Treatment:
In the event of an emergency, I authorize The Continuum Clinic to provide necessary emergency stabilization and treatment. I understand that reasonable efforts will be made to contact me, but treatment will not be delayed if I cannot be reached.

### Diagnostic Testing:
I authorize diagnostic testing including blood work, imaging, genetic testing, and molecular profiling as recommended for assessment and monitoring.

### Medication Administration:
I authorize the administration of prescribed medications and understand that I will be informed of potential side effects and monitoring requirements.

## Financial Authorization

I understand and agree that:

1. I am financially responsible for all services rendered
2. Payment is expected at the time of service unless other arrangements have been made
3. I will be provided with estimates for procedures when feasible
4. Emergency treatment may be provided before cost estimates can be given

## Communication Authorization

I authorize The Continuum Clinic to:

1. Contact me via phone, email, or SMS regarding my pet's care
2. Leave messages regarding appointments and treatment (unless I specify otherwise)
3. Send appointment reminders and follow-up communications

## Limitations

This authorization does NOT include:

1. Euthanasia (requires separate written authorization)
2. Experimental procedures not previously discussed
3. Transfer of care to another facility (except in emergencies)

## Revocation

I understand that I may revoke this authorization at any time by providing written notice. Revocation will not affect actions taken prior to revocation.

## Duration

This authorization remains in effect for all visits unless specifically revoked in writing.

## Acknowledgment

I acknowledge that:

1. I am the legal owner or authorized agent for this pet
2. I have the authority to make medical decisions for this pet
3. I have been given the opportunity to ask questions
4. I understand the nature of the authorized treatments

**By accepting this authorization, I confirm that I have read, understood, and agree to the terms stated above.**
    `
  },
  {
    id: 'financial-responsibility-v1.0',
    type: 'financial-responsibility',
    version: '1.0',
    title: 'Financial Responsibility Agreement',
    effectiveDate: '2025-01-01',
    required: true,
    category: 'financial',
    content: `
# Financial Responsibility Agreement

**The Continuum Clinic - Financial Terms and Conditions**

## Acknowledgment of Financial Responsibility

I acknowledge and agree that I am financially responsible for all veterinary services provided to my pet at The Continuum Clinic.

## Payment Terms

### Payment Due:
- Payment is due at the time of service unless other arrangements have been made in advance
- Accepted payment methods: Credit/debit cards, bank transfer, cash

### Estimates:
- Cost estimates may be provided for planned procedures
- Estimates are approximations and final costs may vary
- I understand that estimates do not include unforeseen complications

### Deposits:
- Deposits may be required for certain procedures or extensive treatments
- Deposits are non-refundable except as required by law

## Insurance

### Insurance Claims:
- If I have pet insurance, I understand that I am responsible for payment and must submit claims to my insurance provider
- The Continuum Clinic may provide documentation for insurance claims as a courtesy
- Insurance reimbursement is between the client and insurance provider

### Coverage Limitations:
- I understand that longevity medicine services may not be covered by standard pet insurance policies
- I will verify coverage with my insurance provider before services

## Pricing

I understand that:

1. Longevity medicine involves specialized services that may be more costly than standard veterinary care
2. Pricing reflects the specialized nature of services, including:
   - Advanced diagnostics and biomarker analysis
   - Novel therapeutic interventions
   - Ongoing monitoring and protocol adjustments
   - Access to specialized expertise
3. Pricing will be discussed transparently before initiating treatment

## Payment Plans

- Payment plans may be available for extensive treatments (subject to approval)
- Payment plan terms will be specified in a separate agreement
- Failure to maintain payment plan terms may result in suspension of services

## Collections

I acknowledge that:

1. Overdue accounts may be subject to collection proceedings
2. I will be responsible for collection costs, legal fees, and interest on overdue amounts
3. My account may be reported to credit agencies for non-payment

## Cancellations

### Appointment Cancellations:
- Cancellations must be made at least 24 hours in advance
- Late cancellations or no-shows may be subject to a cancellation fee

### Treatment Cancellations:
- If I choose to discontinue treatment, I remain responsible for services already rendered

## Itemized Statements

I have the right to:

1. Request an itemized statement for all services
2. Request clarification of any charges
3. Dispute charges in good faith

## Price Changes

The Continuum Clinic reserves the right to adjust pricing. Current pricing will be communicated before services are rendered.

## Consent

By accepting this financial responsibility agreement, I acknowledge that:

1. I have read and understood the financial terms
2. I agree to pay for all services provided to my pet
3. I understand my financial obligations and payment options
4. I am legally authorized to incur these financial obligations

**This agreement remains in effect for all services provided unless modified in writing.**
    `
  }
]

// Get all required consent documents
export function getRequiredConsents(): ConsentDocument[] {
  return CONSENT_DOCUMENTS.filter(doc => doc.required)
}

// Get consent document by ID
export function getConsentDocument(id: string): ConsentDocument | null {
  return CONSENT_DOCUMENTS.find(doc => doc.id === id) || null
}

// Get consents by type
export function getConsentsByType(type: string): ConsentDocument[] {
  return CONSENT_DOCUMENTS.filter(doc => doc.type === type)
}

// Get consents by category
export function getConsentsByCategory(category: string): ConsentDocument[] {
  return CONSENT_DOCUMENTS.filter(doc => doc.category === category)
}
