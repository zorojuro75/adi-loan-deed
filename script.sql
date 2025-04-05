-- Drop tables if they exist
DROP TABLE IF EXISTS interest_bank_details CASCADE;
DROP TABLE IF EXISTS nominees CASCADE;
DROP TABLE IF EXISTS checks CASCADE;
DROP TABLE IF EXISTS first_side_representative CASCADE;
DROP TABLE IF EXISTS deeds CASCADE;
DROP TABLE IF EXISTS zones CASCADE;
DROP TABLE IF EXISTS regions CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS users CASCADE;

--- create branches
CREATE TABLE IF NOT EXISTS zones (
  id UUID primary KEY DEFAULT uuid_generate_v4(),
  zone_name TEXT NOT NULL,
  zone_code TEXT NOT NULL unique
);
CREATE TABLE IF NOT EXISTS regions (
  id UUID primary KEY DEFAULT uuid_generate_v4(),
  region_name TEXT NOT NULL,
  region_code TEXT NOT NULL unique,
  zone_code TEXT NOT NULL REFERENCES zones(zone_code)
);
CREATE TABLE IF NOT EXISTS branches (
  id UUID primary KEY DEFAULT uuid_generate_v4(),
  branch_name TEXT NOT NULL,
  branch_code TEXT NOT NULL unique,
  region_code TEXT NOT NULL REFERENCES regions(region_code)
);
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password text not null, -- Store hashed passwords
  branch_code TEXT NOT NULL REFERENCES branches(branch_code),
  role text check (role IN ('user', 'admin')) default 'user',
  created_at timestamp default now()
);
-- Create deeds table

CREATE TABLE IF NOT EXISTS deeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deed_custom_id TEXT NOT NULL UNIQUE,
  agreementdate DATE NOT NULL,
  fullname TEXT NOT NULL,
  fathersname TEXT NOT NULL,
  mothersname TEXT NOT NULL,
  nid TEXT NOT NULL,
  mobile TEXT NOT NULL,
  currentvillage TEXT NOT NULL,
  currentpostoffice TEXT NOT NULL,
  currentupazila TEXT NOT NULL,
  currentdistrict TEXT NOT NULL,
  permanentvillage TEXT NOT NULL,
  permanentpostoffice TEXT NOT NULL,
  permanentupazila TEXT NOT NULL,
  permanentdistrict TEXT NOT NULL,
  loan_amount NUMERIC NOT NULL,
  loan_amount_in_words TEXT NOT NULL,
  tenure_of_loan INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create first_side_representative table
CREATE TABLE IF NOT EXISTS first_side_representative (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  region_name TEXT NOT NULL,
  zone_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deed_id UUID NOT NULL REFERENCES deeds(id) ON DELETE CASCADE
);

-- Create checks table
CREATE TABLE IF NOT EXISTS checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deed_id UUID NOT NULL REFERENCES deeds(id) ON DELETE CASCADE
);

-- Create nominees table
CREATE TABLE IF NOT EXISTS nominees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  fathersname TEXT NOT NULL,
  age INTEGER NOT NULL,
  nid TEXT NOT NULL,
  mobile TEXT NOT NULL,
  relationship TEXT NOT NULL,
  distributed_portion NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deed_id UUID NOT NULL REFERENCES deeds(id) ON DELETE CASCADE
);

-- Create interest bank details table
CREATE TABLE IF NOT EXISTS interest_bank_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  branch_routing_number TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deed_id UUID NOT NULL REFERENCES deeds(id) ON DELETE CASCADE
);

-- Enable RLS policies
ALTER TABLE deeds DISABLE ROW LEVEL SECURITY;
ALTER TABLE checks DISABLE ROW LEVEL SECURITY;
ALTER TABLE nominees DISABLE ROW LEVEL SECURITY;
ALTER TABLE interest_bank_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE first_side_representative DISABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access to authenticated users" ON deeds
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON checks
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON nominees
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON interest_bank_details
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow full access to authenticated users" ON first_side_representative
  FOR ALL TO authenticated USING (true);