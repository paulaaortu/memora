-- ============================================================
-- ESQUEMA DE BASE DE DATOS PARA MÉMORA EN SUPABASE
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. Tabla de Habitaciones
CREATE TABLE IF NOT EXISTS public.habitaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero VARCHAR(20) UNIQUE NOT NULL,
    tipo VARCHAR(50) DEFAULT 'Suite',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Espacios / Zonas en Habitaciones
CREATE TABLE IF NOT EXISTS public.espacios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(30) DEFAULT 'dormitorio' CHECK (ubicacion IN ('dormitorio', 'bano')),
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'cube-outline',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Huéspedes
CREATE TABLE IF NOT EXISTS public.huespedes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    habitacion VARCHAR(20) NOT NULL,
    check_in VARCHAR(50),
    check_out VARCHAR(50),
    preferencias TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Objetos / Pertenencias guardadas
CREATE TABLE IF NOT EXISTS public.objetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    huesped_id UUID REFERENCES public.huespedes(id) ON DELETE CASCADE,
    habitacion VARCHAR(20),
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) DEFAULT 'Otros',
    zona VARCHAR(50) NOT NULL,
    instrucciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DATOS INICIALES DE ESPACIOS DE LA HABITACIÓN
-- ============================================================
INSERT INTO public.espacios (code, nombre, ubicacion, descripcion, icono) VALUES
('mesita_noche_izq', 'Mesita de noche (Izquierda)', 'dormitorio', 'Junto a la cama, lado izquierdo', 'bed-outline'),
('mesita_noche_der', 'Mesita de noche (Derecha)', 'dormitorio', 'Junto a la cama, lado derecho', 'bed-outline'),
('armario_principal', 'Armario Principal / Perchas', 'dormitorio', 'Balda superior y barra con perchas', 'shirt-outline'),
('caja_fuerte', 'Caja Fuerte', 'dormitorio', 'Interior del armario, estante de seguridad', 'lock-closed-outline'),
('escritorio', 'Escritorio de Trabajo', 'dormitorio', 'Superficie de mesa y tomas de corriente', 'laptop-outline'),
('maletero_banco', 'Banco Maletero', 'dormitorio', 'Entrada junto al espejo', 'briefcase-outline'),
('lavabo_bano', 'Encimera del Lavabo', 'bano', 'Bandeja de cortesía y encimera', 'water-outline'),
('estante_ducha', 'Repisa de Ducha', 'bano', 'Dentro de la cabina de ducha', 'sparkles-outline')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- PERMISOS Y ACCESO PÚBLICO (ANON / AUTHENTICATED)
-- ============================================================
ALTER TABLE public.habitaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.espacios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.huespedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objetos ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para la aplicación web
CREATE POLICY "Permitir lectura publica de habitaciones" ON public.habitaciones FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir insercion de habitaciones" ON public.habitaciones FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir lectura publica de espacios" ON public.espacios FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Permitir gestion de espacios" ON public.espacios FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso a huespedes" ON public.huespedes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Permitir gestion de objetos" ON public.objetos FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Permisos de roles PostgreSQL
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
