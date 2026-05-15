-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

CREATE TABLE IF NOT EXISTS admin_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50),
  pipeline_name VARCHAR(200),
  data JSONB,
  confidence NUMERIC(3,2) DEFAULT 0.80,
  status VARCHAR(30) DEFAULT 'pending_review'
    CHECK (status IN (
      'pending_review','approved',
      'rejected','published')),
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_aq_status
  ON admin_queue(status);
CREATE INDEX IF NOT EXISTS idx_aq_source
  ON admin_queue(source_type);
CREATE INDEX IF NOT EXISTS idx_aq_created
  ON admin_queue(created_at DESC);
