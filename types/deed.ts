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

export interface DeedWithRelations extends DeedData {
  checks?: Check[]
  nominees?: Nominee[]
}

