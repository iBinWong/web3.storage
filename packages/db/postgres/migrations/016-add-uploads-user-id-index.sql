CREATE INDEX IF NOT EXISTS upload_user_id_deleted_at_idx ON upload (user_id) WHERE deleted_at IS NULL;