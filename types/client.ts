/**
 * Client account types
 */

export interface Client {
  id: string
  email: string
  passwordHash: string
  firstName: string
  lastName: string
  phone?: string
  address?: {
    street?: string
    city?: string
    postcode?: string
    country?: string
  }
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

export interface ClientRegistrationData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface ClientLoginData {
  email: string
  password: string
}

export interface ClientProfileUpdate {
  firstName?: string
  lastName?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    postcode?: string
    country?: string
  }
}

export interface ClientSession {
  clientId: string
  email: string
  role: 'client'
  createdAt: number
}
