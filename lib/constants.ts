/**
 * Site-wide constants
 * Single source of truth for all hardcoded values
 */

export const SITE_CONFIG = {
  name: "Continuum Clinic",
  description: "London-based veterinary longevity centre providing AI-guided assessments, personalised protocols, and advanced therapeutics for companion animals worldwide.",
  domain: "thecontinuumclinic.com",
  email: "info@thecontinuumclinic.com",
  phone: "+44 20 1234 5678",
  address: {
    street: "12 Upper Wimpole Street",
    city: "London",
    postcode: "W1G 6LW",
    country: "United Kingdom"
  },
  social: {
    twitter: "",
    linkedin: "",
    instagram: ""
  }
} as const

export const NAVIGATION_ITEMS = [
  { href: "/", labelKey: "nav_home" },
  { href: "/about", labelKey: "nav_about" },
  { href: "/services", labelKey: "nav_services" },
  { href: "/blog", labelKey: "nav_blog" },
  { href: "/book-consultation", labelKey: "nav_book" },
  { href: "/contact", labelKey: "nav_contact" },
] as const

export const PORTAL_NAVIGATION = [
  { href: "/portal/dashboard", labelKey: "portal_dashboard", icon: "home" },
  { href: "/portal/pets", labelKey: "portal_pets", icon: "pawprint" },
  { href: "/portal/appointments", labelKey: "portal_appointments", icon: "calendar" },
  { href: "/portal/profile", labelKey: "portal_profile", icon: "user" },
] as const

export const ADMIN_NAVIGATION = [
  { href: "/admin", labelKey: "admin_dashboard", icon: "home" },
  { href: "/admin/clients", labelKey: "admin_clients", icon: "users" },
  { href: "/admin/pets", labelKey: "admin_pets", icon: "pawprint" },
  { href: "/admin/appointments", labelKey: "admin_appointments", icon: "calendar" },
  { href: "/admin/content", labelKey: "admin_content", icon: "file-text" },
  { href: "/admin/analytics", labelKey: "admin_analytics", icon: "bar-chart" },
  { href: "/admin/settings", labelKey: "admin_settings", icon: "settings" },
] as const

export const FOOTER_LINKS = [
  { href: "/privacy", labelKey: "nav_privacy" },
  { href: "/terms", labelKey: "nav_terms" },
  { href: "/contact", labelKey: "nav_contact" },
] as const

export const SERVICES = [
  {
    id: "longevity-assessment",
    titleKey: "service_longevity_title",
    descriptionKey: "service_longevity_desc",
    icon: "activity"
  },
  {
    id: "pharmacology",
    titleKey: "service_pharmacology_title",
    descriptionKey: "service_pharmacology_desc",
    icon: "pill"
  },
  {
    id: "gene-therapy",
    titleKey: "service_gene_therapy_title",
    descriptionKey: "service_gene_therapy_desc",
    icon: "dna"
  },
  {
    id: "cell-therapy",
    titleKey: "service_cell_therapy_title",
    descriptionKey: "service_cell_therapy_desc",
    icon: "microscope"
  },
  {
    id: "oncology",
    titleKey: "service_oncology_title",
    descriptionKey: "service_oncology_desc",
    icon: "heart-pulse"
  },
  {
    id: "diagnostics",
    titleKey: "service_diagnostics_title",
    descriptionKey: "service_diagnostics_desc",
    icon: "scan"
  }
] as const

export const PET_SPECIES = [
  { value: "dog", labelKey: "species_dog" },
  { value: "cat", labelKey: "species_cat" },
  { value: "other", labelKey: "species_other" }
] as const

export const HEALTH_RECORD_TYPES = [
  { value: "checkup", labelKey: "record_type_checkup" },
  { value: "diagnostic", labelKey: "record_type_diagnostic" },
  { value: "treatment", labelKey: "record_type_treatment" },
  { value: "medication", labelKey: "record_type_medication" },
  { value: "vaccination", labelKey: "record_type_vaccination" },
  { value: "lab-result", labelKey: "record_type_lab" }
] as const

export const APPOINTMENT_TYPES = [
  { value: "initial-consultation", labelKey: "appointment_type_initial" },
  { value: "follow-up", labelKey: "appointment_type_followup" },
  { value: "diagnostic", labelKey: "appointment_type_diagnostic" },
  { value: "treatment", labelKey: "appointment_type_treatment" },
  { value: "emergency", labelKey: "appointment_type_emergency" }
] as const

export const BIOMARKER_TYPES = [
  { value: "weight", labelKey: "biomarker_weight", unit: "kg" },
  { value: "blood-pressure", labelKey: "biomarker_bp", unit: "mmHg" },
  { value: "glucose", labelKey: "biomarker_glucose", unit: "mmol/L" },
  { value: "kidney", labelKey: "biomarker_kidney", unit: "μmol/L" },
  { value: "liver", labelKey: "biomarker_liver", unit: "U/L" },
  { value: "custom", labelKey: "biomarker_custom", unit: "" }
] as const

// Supported languages
export const LOCALES = ['en', 'es', 'fr', 'zh', 'ru', 'ar'] as const
export const DEFAULT_LOCALE = 'en' as const

// Session expiry times
export const SESSION_EXPIRY = {
  admin: 7 * 24 * 60 * 60, // 7 days in seconds
  client: 30 * 24 * 60 * 60, // 30 days in seconds
} as const

// Rate limiting
export const RATE_LIMITS = {
  contact: { window: 60 * 60, max: 3 }, // 3 per hour
  login: { window: 15 * 60, max: 5 }, // 5 per 15 minutes
  appointment: { window: 24 * 60 * 60, max: 5 }, // 5 per day
} as const
