-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE incident_severity AS ENUM ('P1', 'P2', 'P3', 'P4');
CREATE TYPE incident_status AS ENUM (
  'active',
  'ai-investigating',
  'human-intervention',
  'resolved',
  'auto-healed',
  'investigating'
);
CREATE TYPE timeline_event_type AS ENUM ('alert', 'investigation', 'action', 'resolution');
CREATE TYPE ai_activity_type AS ENUM ('investigating', 'resolved', 'healed', 'health-check');
CREATE TYPE integration_category AS ENUM ('alerting', 'observability', 'communication', 'source-control');

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  role user_role DEFAULT 'member',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Incidents table
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  service TEXT NOT NULL,
  severity incident_severity NOT NULL,
  status incident_status NOT NULL DEFAULT 'active',
  mttr INTERVAL,
  description TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Timeline events table
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  type timeline_event_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Hypotheses table
CREATE TABLE hypotheses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggested_fix TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integrations table
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  category integration_category NOT NULL,
  connected BOOLEAN DEFAULT FALSE,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI activities table
CREATE TABLE ai_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,
  type ai_activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  details JSONB DEFAULT '[]'::jsonb,
  is_live BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_incidents_organization_id ON incidents(organization_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at DESC);
CREATE INDEX idx_incidents_service ON incidents(service);
CREATE INDEX idx_incidents_organization_status ON incidents(organization_id, status);

CREATE INDEX idx_timeline_events_incident_id ON timeline_events(incident_id);
CREATE INDEX idx_timeline_events_timestamp ON timeline_events(timestamp DESC);

CREATE INDEX idx_hypotheses_incident_id ON hypotheses(incident_id);

CREATE INDEX idx_integrations_organization_id ON integrations(organization_id);
CREATE INDEX idx_integrations_type ON integrations(type);
CREATE INDEX idx_integrations_organization_type ON integrations(organization_id, type);

CREATE INDEX idx_ai_activities_organization_id ON ai_activities(organization_id);
CREATE INDEX idx_ai_activities_incident_id ON ai_activities(incident_id);
CREATE INDEX idx_ai_activities_timestamp ON ai_activities(timestamp DESC);
CREATE INDEX idx_ai_activities_is_live ON ai_activities(is_live) WHERE is_live = TRUE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies will be added after Supabase auth is configured
-- For now, we'll create placeholder policies

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_activities ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (will be enhanced after auth setup)
-- Users can only see their own organization's data
CREATE POLICY "Users can view their organization's data"
  ON organizations FOR SELECT
  USING (id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their organization's users"
  ON users FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their organization's incidents"
  ON incidents FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can create incidents in their organization"
  ON incidents FOR INSERT
  WITH CHECK (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update incidents in their organization"
  ON incidents FOR UPDATE
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view timeline events for their organization's incidents"
  ON timeline_events FOR SELECT
  USING (incident_id IN (
    SELECT id FROM incidents 
    WHERE organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  ));

CREATE POLICY "Users can view hypotheses for their organization's incidents"
  ON hypotheses FOR SELECT
  USING (incident_id IN (
    SELECT id FROM incidents 
    WHERE organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
  ));

CREATE POLICY "Users can view their organization's integrations"
  ON integrations FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage their organization's integrations"
  ON integrations FOR ALL
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can view their organization's AI activities"
  ON ai_activities FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));

