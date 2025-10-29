/**
 * Pet profile types
 */

export type PetSpecies = 'dog' | 'cat' | 'other'
export type PetSex = 'male' | 'female' | 'neutered' | 'spayed'

export interface Pet {
  id: string
  clientId: string
  name: string
  species: PetSpecies
  breed: string
  dateOfBirth: string
  weight: number
  sex: PetSex
  microchipId?: string
  insuranceDetails?: {
    provider?: string
    policyNumber?: string
    expiryDate?: string
  }
  photoUrl?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface PetCreateData {
  name: string
  species: PetSpecies
  breed: string
  dateOfBirth: string
  weight: number
  sex: PetSex
  microchipId?: string
  insuranceDetails?: {
    provider?: string
    policyNumber?: string
    expiryDate?: string
  }
  notes?: string
}

export interface PetUpdateData {
  name?: string
  breed?: string
  weight?: number
  insuranceDetails?: {
    provider?: string
    policyNumber?: string
    expiryDate?: string
  }
  notes?: string
}
