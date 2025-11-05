# Monitor de Gestión Integral

Sistema de monitoreo integral para la gestión de clientes, implementaciones tecnológicas, paneles BI, procesos, experiencias y usabilidad.

## Características

- Dashboard general con métricas consolidadas
- Gestión de tecnología (implementaciones, plataformas)
- Gestión BI (paneles y configuraciones por cliente)
- Gestión de procesos (levantamientos y documentación)
- Pervex Lab (eventos y actividades)
- Experiencias (cliente y colaboradores)
- Usabilidad tecnológica

## Tecnologías

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: PostgreSQL (Neon)
- **Visualización**: Recharts

## Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Configuración

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd monitor-de-gestión-integral
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Copiar `.env.example` a `.env` (o crear `.env` manualmente)
   - Configurar la URL de la base de datos Neon:
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-xxx-xxx.aws.neon.tech/neondb?sslmode=require
PORT=3001
API_BASE_URL=http://localhost:3001/api
VITE_API_BASE_URL=http://localhost:3001/api
```

## Uso

### Desarrollo

**Frontend (puerto 3000):**
```bash
npm run dev
```

**Backend (puerto 3001):**
```bash
npm run dev:server
```

O ejecutar ambos en terminales separadas.

### Producción

**Build del frontend:**
```bash
npm run build
```

**Ejecutar servidor:**
```bash
npm run server
```

## Estructura del Proyecto

```
monitor-de-gestión-integral/
├── components/          # Componentes React
├── views/              # Vistas principales
├── context/            # Context API para estado global
├── hooks/              # Custom hooks
├── lib/                # Utilidades y API client
├── server/             # Backend API
│   ├── routes/        # Rutas del API
│   └── db.ts          # Configuración de base de datos
├── types.ts           # Tipos TypeScript
├── utils/             # Funciones utilitarias
└── data/              # Datos mock (para desarrollo)
```

## API Endpoints

### Clientes
- `GET /api/clients` - Listar todos los clientes
- `GET /api/clients/:id` - Obtener cliente por ID
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/:id` - Actualizar cliente
- `DELETE /api/clients/:id` - Eliminar cliente

### Implementaciones Tecnológicas
- `GET /api/tech-implementations` - Listar todas las implementaciones
- `GET /api/tech-implementations/client/:clientId` - Implementaciones por cliente
- `POST /api/tech-implementations` - Crear implementación
- `PUT /api/tech-implementations/:id` - Actualizar implementación

### Paneles BI
- `GET /api/bi-panels` - Listar todos los paneles
- `POST /api/bi-panels` - Crear panel
- `PUT /api/bi-panels/:id` - Actualizar panel

### Y más...

Ver código en `server/routes/` para todos los endpoints disponibles.

## Base de Datos

El proyecto usa Neon (PostgreSQL serverless). El esquema de base de datos incluye:

- `users` - Usuarios del sistema
- `clients` - Clientes
- `tech_platforms` - Plataformas tecnológicas
- `tech_implementations` - Implementaciones tecnológicas
- `bi_panels` - Paneles BI
- `bi_client_panels` - Paneles BI por cliente
- `process_areas` - Áreas de proceso
- `process_surveys` - Levantamientos de proceso
- `lab_events` - Eventos del laboratorio
- `alerts` - Alertas del sistema
- `client_experiences` - Experiencias de cliente
- `collaborator_experience_plans` - Planes de experiencia de colaboradores
- `tech_usability` - Usabilidad tecnológica

## Desarrollo

La aplicación usa datos mock por defecto para desarrollo. Para usar el backend:

1. Asegúrate de que el servidor esté corriendo
2. Configura `VITE_API_BASE_URL` en `.env`
3. La app detectará automáticamente el backend disponible

## Licencia

Privado - Todos los derechos reservados
