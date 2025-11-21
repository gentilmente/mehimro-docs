---
id: intro
title: Centro de Documentación Mehmiro
sidebar_label: Resumen General
---

# Centro de Documentación Mehmiro

Bienvenido a la base de conocimiento centralizada de Mehmiro, la plataforma de evaluación educativa impulsada por IA. Este portal Docusaurus consolida reglas arquitectónicas, estándares de desarrollo, especificaciones de características y flujos de trabajo BDD/TDD en un solo sitio continuamente actualizado.

## Estructura de Documentación

### Fundamentos

Principios centrales, vocabulario y contexto del proyecto que guían todos los entregables.

- [Persona de Desarrollo y Enfoque](foundations/persona.md)
- [Resumen del Proyecto](foundations/project-overview.md)
- [Glosario](foundations/glossary.md)
- [Pautas Centrales](foundations/core-guidelines.md)

### Arquitectura

Planos del sistema, modelado de datos y requisitos no funcionales.

- [Arquitectura del Sistema](architecture/system-architecture.md)
- [Modelo de Datos](architecture/data-model.md)
- [Rendimiento y Seguridad](architecture/performance-security.md)

### Estándares

Pautas de ingeniería para entrega consistente y lista para producción.

- [Estándares de Codificación](standards/coding-standards.md)
- [Pautas de Interfaz de Usuario](standards/ui-guidelines.md)
- [Estrategia de Pruebas](standards/testing-strategy.md)

### Procesos

Manuales operativos, gobierno y definiciones del ciclo de vida de características.

- [Ciclo de Vida de Características](processes/feature-lifecycle.md)
- [Gobernanza de Documentación](processes/documentation-governance.md)

### Características

Especificaciones detalladas de características, incluyendo escenarios BDD, notas de implementación y activos de prueba.

- [Perspectivas de Evaluación Estudiantil](features/student-assessment-insights/overview.md)
- [Sistema de Monitoreo Estudiantil](features/student-monitoring-system/overview.md)

### Referencia

API, hooks y documentación de servicios que respaldan detalles de implementación.

_Próximamente — Las referencias de API, hooks y servicios se documentarán junto con las herramientas de generación de código._

## Navegación Rápida

| Objetivo                          | Ruta                                                       |
| ----------------------------- | ---------------------------------------------------------- |
| Entender la visión del producto | [Resumen del Proyecto](foundations/project-overview.md)        |
| Alinear en persona de ingeniería  | [Persona de Desarrollo y Enfoque](foundations/persona.md)   |
| Iniciar una nueva característica           | [Ciclo de Vida de Características](processes/feature-lifecycle.md)        |
| Escribir escenarios BDD           | [Estrategia de Pruebas](standards/testing-strategy.md)          |
| Revisar reglas de codificación            | [Estándares de Codificación](standards/coding-standards.md)          |
| Revisar arquitectura del sistema    | [Arquitectura del Sistema](architecture/system-architecture.md) |

## Mantener la Documentación Sincronizada

Sigue las reglas a continuación para asegurar que el portal se mantenga alineado con el código base:

1. Actualiza la documentación relevante junto con cada cambio de código.
2. Usa las plantillas proporcionadas en cada sección al agregar nuevo contenido.
3. Valida enlaces y referencias cruzadas antes de fusionar.
4. Ejecuta `pnpm docs:build` y `pnpm docs:test` (ver [Gobernanza de Documentación](processes/documentation-governance.md)) antes de enviar solicitudes de extracción.

## Recursos Relacionados

- [README del Repositorio](https://github.com/gentilmente/mehimro-docs#readme)
- [Suite de Pruebas](https://github.com/gentilmente/mehimro-docs/tree/main/tests)
- [Biblioteca de Componentes](https://github.com/gentilmente/mehimro-docs/tree/main/components)
- [Storybook](https://mehmiro-storybook.vercel.app)

---

_Este sitio está construido con Docusaurus 3.9 y está destinado a servir como la fuente de verdad viva para la arquitectura, estándares y documentación de características de Mehmiro._