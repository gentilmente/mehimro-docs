---
id: project-overview
title: Resumen del Proyecto
sidebar_label: Resumen del Proyecto
---

# Mehmiro — Plataforma de Evaluación Educativa Impulsada por IA

## Resumen del Producto

Mehmiro ayuda a los profesores a optimizar la evaluación estudiantil, hacer seguimiento del progreso y generar perspectivas a través de la automatización impulsada por IA. La plataforma combina administración de clases, planificación de lecciones y análisis de rendimiento en una experiencia cohesiva y centrada en la privacidad.

## Propuestas de Valor Central

### 🤖 Evaluación Impulsada por IA

- Análisis automatizado de evaluaciones presentadas por profesores, estudiantes, familias e IA.
- Sugerencias conscientes del contexto adaptadas a variables y escalas de clase.
- Retroalimentación práctica alineada con el historial estudiantil y objetivos de lección.

### 📊 Seguimiento del Progreso Estudiantil

- Visualizaciones interactivas (gráficos de radar, lineales, polares) que cubren múltiples períodos.
- Detección de tendencias, análisis comparativos y resúmenes de rendimiento acumulativo.
- Filtrado rápido por fuente de evaluación, variable, sesión o rango de tiempo.

### 👥 Gestión de Clases y Lecciones

- Paneles de clase con lista de estudiantes, variables de evaluación, planificación de lecciones y programación.
- Perfiles estudiantiles con contexto histórico, perspectivas de IA e indicadores de intervención.
- Planificación de lecciones integrada que conecta objetivos de aprendizaje con resultados de evaluación.

### 🔐 Diseño Centrado en la Privacidad

- Los estudiantes usan alias secretos; los identificadores personales se excluyen del almacenamiento.
- Control de acceso estricto para profesores, administradores, asistentes y miembros de la familia.
- Diseño preparado para cumplimiento alineado con la protección de datos educativos.

## Stack Tecnológico

| Capa          | Herramientas                                    | Notas                                                        |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| Frontend       | **Next.js 15**, **React 19**, **TypeScript**    | App Router, componentes del servidor, UI móvil-primera.      |
| Estilos        | **Tailwind CSS**, shadcn/ui                     | Estilos utilitarios con primitivas reutilizables.            |
| Visualización  | **Chart.js**                                    | Gráficos de radar/lineales/polares embebidos en paneles estudiantiles. |
| Backend & Datos| **Supabase (PostgreSQL)**                       | Seguridad a Nivel de Fila (RLS), actualizaciones en tiempo real, migraciones. |
| Autenticación  | **NextAuth**                                    | Gestión de sesiones, acceso basado en roles.                 |
| Integración IA | Google Gemini (planificado)                     | Prompts estructurados para evaluaciones, diagnósticos, incorporación. |
| Pruebas        | **Vitest**, **Playwright**, **Cucumber**        | Cobertura de unidad, integración, BDD y E2E.                 |
| Herramientas   | **ESLint**, **Prettier**, **PNPM**              | Formato consistente, linting y gestión de paquetes.          |

## Principios de Desarrollo

### Experiencia Móvil-Primera

- Diseña componentes para layouts de teléfono primero, optimizando para interacciones táctiles.
- Asegura que existan estados esqueleto/carga para cada vista principal de UI.

### Patrones de Componentes Consistentes

- Reutiliza componentes y hooks compartidos en lugar de crear duplicados.
- Mantén las responsabilidades de componentes enfocadas y limita el área de superficie de props.

### Disciplina de Pruebas

- Sigue el flujo de trabajo TDD/BDD: define escenarios, escribe pruebas fallidas, implementa, refactoriza.
- Mantén ≥80% de cobertura de código y asegura que los escenarios se reflejen en suites automatizadas.
- Incluye pruebas Playwright dirigidas para flujos de usuario críticos.

### Documentación y Gobernanza

- Trata la documentación como un entregable de primera clase.
- Actualiza documentos relacionados, especificaciones de características y diagramas con cada cambio.
- Ejecuta validación de documentación (`pnpm docs:build` & `pnpm docs:test`) antes de envío de PR.

## Roles de Usuario

| Rol                       | Descripción        | Capacidades                                                     |
| ------------------------- | ------------------ | --------------------------------------------------------------- |
| Profesores                | Usuarios principales| Gestionar clases, evaluar estudiantes, ver perspectivas, planificar lecciones. |
| Administradores           | Supervisión operacional | Gestionar listas de estudiantes, monitorear análisis, configurar comportamiento del sistema. |
| Asistentes / Tutores      | Personal de apoyo  | Acceso limitado a paneles de clase y contexto de lecciones.     |
| Miembros de Familia (Futuro) | Tutores           | Acceso de solo lectura a resúmenes e perspectivas estudiantiles.|
| Estudiantes               | Protegidos         | Sin acceso directo (solo alias).                                |

## Seguridad y Cumplimiento

- HTTPS aplicado en todos los entornos.
- Variables de entorno gestionadas mediante convenciones de Next.js y configuraciones del proyecto Supabase.
- Logging listo para auditoría para interacciones de IA y cambios de evaluación.
- Integración con Supabase RLS para políticas granulares de acceso a datos.

## Consideraciones de Rendimiento

- SSR o renderizado estático para páginas críticas de SEO.
- Caché inteligente en capa de servicios, con invalidación vinculada a actualizaciones de evaluación.
- Consultas Supabase por lotes, índices de base de datos y paginación consistente.
- Builds de desarrollo habilitados con Turbopack para retroalimentación rápida.

## Hoja de Ruta del Producto (Aspectos Destacados)

| Fase       | Enfoque                   | Resumen                                                     |
| ---------- | ------------------------- | ----------------------------------------------------------- |
| Corto Plazo| i18n & UI Multi-idioma    | Añadir soporte español/inglés, preferencias de idioma.      |
| Corto Plazo| Análisis Avanzado         | Métricas de rendimiento predictivo, comparaciones de cohortes. |
| Mediano Plazo | Integraciones           | Conectores LMS, portal de padres, importaciones de evaluación externa. |
| Mediano Plazo | Colaboración en Tiempo Real | Planificación de lecciones compartida, mensajería de profesores.      |
| Largo Plazo | Móvil y Sin Conexión      | Capacidades PWA y exploración de aplicación nativa.         |

## Documentación Referenciada

- [Arquitectura del Sistema](../developer/architecture/system-architecture.md)
- [Estándares de Codificación](../developer/standards/coding-standards.md)
- [Ciclo de Vida de Características](../developer/processes/feature-lifecycle.md)
- [Perspectivas de Evaluación Estudiantil](../developer/features/student-assessment-insights/overview.md)
- [Sistema de Monitoreo Estudiantil](../developer/features/student-monitoring-system/overview)

---
