-- Script para vaciar y cargar datos de clientes
-- Ejecutar con: neonctl sql --project-id <project_id> --branch-name <branch> < load_clients.sql

-- 1. Vaciar tabla de clientes (CASCADE eliminará registros relacionados)
TRUNCATE TABLE clients CASCADE;

-- 2. Crear usuarios necesarios (directores)
-- Usamos DO block para almacenar UUIDs y reutilizarlos
DO $$
DECLARE
    uuid_miriam_villouta UUID := gen_random_uuid();
    uuid_rene_bravo UUID := gen_random_uuid();
    uuid_ana_gonzalez UUID := gen_random_uuid();
    uuid_ximena_cuso UUID := gen_random_uuid();
    uuid_alex_martinex UUID := gen_random_uuid();
    uuid_mauricio_tarisfeno UUID := gen_random_uuid();
    uuid_oscar_contreras UUID := gen_random_uuid();
    uuid_ricardo_seguel UUID := gen_random_uuid();
    uuid_natalie_morales UUID := gen_random_uuid();
    uuid_teresa_lucero UUID := gen_random_uuid();
BEGIN

    -- Insertar usuarios (solo si no existen)
    INSERT INTO users (id, name) 
    SELECT uuid_miriam_villouta, 'Miriam Villouta'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Miriam Villouta'));

    INSERT INTO users (id, name) 
    SELECT uuid_rene_bravo, 'René Bravo'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('René Bravo'));

    INSERT INTO users (id, name) 
    SELECT uuid_ana_gonzalez, 'Ana Gonzalez'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Ana Gonzalez'));

    INSERT INTO users (id, name) 
    SELECT uuid_ximena_cuso, 'Ximena Cuso'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Ximena Cuso'));

    INSERT INTO users (id, name) 
    SELECT uuid_alex_martinex, 'Alex Martinex'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Alex Martinex'));

    INSERT INTO users (id, name) 
    SELECT uuid_mauricio_tarisfeno, 'Mauricio Tarisfeño'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Mauricio Tarisfeño'));

    INSERT INTO users (id, name) 
    SELECT uuid_oscar_contreras, 'Oscar Contreras'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Oscar Contreras'));

    INSERT INTO users (id, name) 
    SELECT uuid_ricardo_seguel, 'Ricardo Seguel'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Ricardo Seguel'));

    INSERT INTO users (id, name) 
    SELECT uuid_natalie_morales, 'Natalie Morales'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Natalie Morales'));

    INSERT INTO users (id, name) 
    SELECT uuid_teresa_lucero, 'Teresa Lucero'
    WHERE NOT EXISTS (SELECT 1 FROM users WHERE LOWER(name) = LOWER('Teresa Lucero'));

    -- Obtener IDs de usuarios existentes si ya están en la BD
    SELECT id INTO uuid_miriam_villouta FROM users WHERE LOWER(name) = LOWER('Miriam Villouta') LIMIT 1;
    SELECT id INTO uuid_rene_bravo FROM users WHERE LOWER(name) = LOWER('René Bravo') LIMIT 1;
    SELECT id INTO uuid_ana_gonzalez FROM users WHERE LOWER(name) = LOWER('Ana Gonzalez') LIMIT 1;
    SELECT id INTO uuid_ximena_cuso FROM users WHERE LOWER(name) = LOWER('Ximena Cuso') LIMIT 1;
    SELECT id INTO uuid_alex_martinex FROM users WHERE LOWER(name) = LOWER('Alex Martinex') LIMIT 1;
    SELECT id INTO uuid_mauricio_tarisfeno FROM users WHERE LOWER(name) = LOWER('Mauricio Tarisfeño') LIMIT 1;
    SELECT id INTO uuid_oscar_contreras FROM users WHERE LOWER(name) = LOWER('Oscar Contreras') LIMIT 1;
    SELECT id INTO uuid_ricardo_seguel FROM users WHERE LOWER(name) = LOWER('Ricardo Seguel') LIMIT 1;
    SELECT id INTO uuid_natalie_morales FROM users WHERE LOWER(name) = LOWER('Natalie Morales') LIMIT 1;
    SELECT id INTO uuid_teresa_lucero FROM users WHERE LOWER(name) = LOWER('Teresa Lucero') LIMIT 1;

    -- 3. Insertar clientes
    INSERT INTO clients (id, name, gerencia, owner_user_id, headcount) VALUES
    (gen_random_uuid(), 'BEIERSDORF S.A.', 'Candrews', uuid_miriam_villouta, 272),
    (gen_random_uuid(), 'C&C CHILE SPA', 'Rbravo', uuid_rene_bravo, 5),
    (gen_random_uuid(), 'CANON CHILE S.A.', 'Candrews', uuid_ana_gonzalez, 23),
    (gen_random_uuid(), 'CMPC TISSUE S.A', 'Candrews', uuid_ximena_cuso, 1094),
    (gen_random_uuid(), 'COLGATE PALMOLIVE CHILE S.A', 'Rbravo', uuid_alex_martinex, 273),
    (gen_random_uuid(), 'COLOMBINA DE CHILE LTDA.', 'Candrews', uuid_miriam_villouta, 30),
    (gen_random_uuid(), 'COMERCIAL DEPOR LTDA.', 'Candrews', uuid_miriam_villouta, 168),
    (gen_random_uuid(), 'COMPAÑIA CHILENA DE FOSFOROS S', 'Candrews', uuid_ana_gonzalez, 70),
    (gen_random_uuid(), 'EDIPAC S.A', 'Candrews', uuid_ximena_cuso, 12),
    (gen_random_uuid(), 'EMBONOR S.A.', 'Rbravo', uuid_mauricio_tarisfeno, 739),
    (gen_random_uuid(), 'FPC TISSUE SPA', 'Candrews', uuid_ana_gonzalez, 31),
    (gen_random_uuid(), 'GASCO GLP S.A.', 'Candrews', uuid_miriam_villouta, 41),
    (gen_random_uuid(), 'GESTION INTEGRAL DE PDV', 'Rbravo', uuid_oscar_contreras, 227),
    (gen_random_uuid(), 'HUAWEI TECH INVESTMENT', 'Rbravo', uuid_ricardo_seguel, 54),
    (gen_random_uuid(), 'IND DE ALIM ARCOR DOS EN UNO', 'Candrews', uuid_natalie_morales, 367),
    (gen_random_uuid(), 'LABORATORIO DURANDIN S.A.I.', 'Candrews', uuid_ana_gonzalez, 80),
    (gen_random_uuid(), 'QUILLAYES SURLAT', 'Rbravo', uuid_alex_martinex, 420),
    (gen_random_uuid(), 'RECKITT BENCKISER CHILE S.A.', 'Rbravo', uuid_alex_martinex, 104),
    (gen_random_uuid(), 'SCANAVINI', 'Candrews', uuid_ana_gonzalez, 42),
    (gen_random_uuid(), 'SOLUCIONES EN MADERA S.A.', 'Candrews', uuid_ana_gonzalez, 12),
    (gen_random_uuid(), 'SYNAPSIS', 'Candrews', uuid_miriam_villouta, 4),
    (gen_random_uuid(), 'TEAM FOODS CHILE SPA (GTS)', 'Candrews', uuid_ana_gonzalez, 3),
    (gen_random_uuid(), 'TRANSPORTES ANDINA REFRESCOS', 'Rbravo', uuid_mauricio_tarisfeno, 956),
    (gen_random_uuid(), 'TRANSPORTES CCU LTDA.', 'Rbravo', uuid_teresa_lucero, 186),
    (gen_random_uuid(), 'UNILEVER CHILE S.A.', 'Rbravo', uuid_natalie_morales, 600);

END $$;

-- Verificar datos cargados
SELECT COUNT(*) as total_clients FROM clients;
SELECT COUNT(*) as total_users FROM users;

