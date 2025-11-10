-- Tabla de relación many-to-many entre usuarios y clientes
-- Permite asignar múltiples clientes a un usuario y viceversa

CREATE TABLE IF NOT EXISTS user_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by_user_id UUID REFERENCES users(id),
  UNIQUE(user_id, client_id)
);

CREATE INDEX idx_user_clients_user_id ON user_clients(user_id);
CREATE INDEX idx_user_clients_client_id ON user_clients(client_id);

-- Los admins tienen acceso a todos los clientes por defecto (no necesitan asignaciones)
-- Los usuarios normales solo ven los clientes que se les asignen explícitamente

