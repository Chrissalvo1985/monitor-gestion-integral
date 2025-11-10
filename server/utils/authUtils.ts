import { Request } from 'express';
import { query } from '../db.js';

export interface UserContext {
  userId: string;
  role: 'admin' | 'user';
  assignedClients?: string[];
}

/**
 * Extrae información del usuario desde los headers de la request
 */
export async function getUserContext(req: Request): Promise<UserContext | null> {
  const userId = req.headers['x-user-id'] as string;
  const role = req.headers['x-user-role'] as 'admin' | 'user';

  if (!userId || !role) {
    return null;
  }

  // Si es admin, no necesita clientes asignados (tiene acceso a todo)
  if (role === 'admin') {
    return { userId, role, assignedClients: [] };
  }

  // Para usuarios normales, obtener sus clientes asignados
  const result = await query(
    'SELECT client_id FROM user_clients WHERE user_id = $1',
    [userId]
  );

  return {
    userId,
    role,
    assignedClients: result.rows.map(row => row.client_id),
  };
}

/**
 * Filtra una lista de clientes según los permisos del usuario
 */
export function filterClientsByPermissions(
  clients: any[],
  userContext: UserContext | null
): any[] {
  if (!userContext) {
    return clients; // Sin filtro si no hay contexto de usuario
  }

  if (userContext.role === 'admin') {
    return clients; // Admin ve todos los clientes
  }

  // Usuario normal solo ve sus clientes asignados
  if (!userContext.assignedClients || userContext.assignedClients.length === 0) {
    return []; // Sin clientes asignados, no ve nada
  }

  return clients.filter(client => 
    userContext.assignedClients!.includes(client.id)
  );
}

/**
 * Genera una condición SQL WHERE para filtrar por clientes asignados
 */
export function getClientFilterSQL(
  userContext: UserContext | null,
  clientIdColumn: string = 'client_id'
): { sql: string; params: any[] } {
  if (!userContext || userContext.role === 'admin') {
    return { sql: '', params: [] }; // Sin filtro para admin
  }

  if (!userContext.assignedClients || userContext.assignedClients.length === 0) {
    // Sin clientes asignados, devolver condición imposible
    return { sql: `${clientIdColumn} IS NULL AND ${clientIdColumn} IS NOT NULL`, params: [] };
  }

  // Filtrar por los clientes asignados
  const placeholders = userContext.assignedClients.map((_, idx) => `$${idx + 1}`).join(', ');
  return {
    sql: `${clientIdColumn} IN (${placeholders})`,
    params: userContext.assignedClients,
  };
}

