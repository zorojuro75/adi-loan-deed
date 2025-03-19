export interface DeedData {
  id: string
  agreementdate: string
  fullname: string
  fathersname: string
  mothersname: string
  nid: string
  mobile: string
  currentvillage: string
  currentpostoffice: string
  currentupazila: string
  currentdistrict: string
  permanentvillage: string
  permanentpostoffice: string
  permanentupazila: string
  permanentdistrict: string
  loan_amount: number
  loan_amount_in_words: string
  tenure_of_loan: number
  created_at?: string
  updated_at?: string
}

export type Check = {
  id: string
  check_number: string
  bank_name: string
  branch: string
  amount: number
  created_at?: string
  updated_at?: string
  deed_id: string
}
export type InterestBankDetails = {
  id: string
  name: string
  account_number: string
  bank_name: string
  branch: string
  branch_routing_number: string
  amount: number
  created_at?: string
  updated_at?: string
  deed_id: string
}

export type Nominee = {
  id: string
  name: string
  fathersname: string
  age: number
  nid: string
  mobile: string
  relationship: string
  distributed_portion: number
  created_at?: string
  updated_at?: string
  deed_id: string
}

export type FirstSideRepresentative = {
  id: string
  name: string
  branch_name: string
  region_name: string
  zone_name: string
  created_at?: string
  updated_at?: string
  deed_id: string
}

export interface DeedWithRelations extends DeedData {
  checks: Check[]
  nominees: Nominee[]
  first_side_representative: FirstSideRepresentative
  interest_bank_details: InterestBankDetails
}
