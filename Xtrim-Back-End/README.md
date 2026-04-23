# XTRIM CRM Leads - Backend (Serverless)

Este proyecto es el backend para la prueba técnica de XTRIM. Gestiona leads en un CRM simplificado con soporte para vistas de lista y Kanban, además de KPIs de ventas.

## Tecnologías
- **Framework**: Serverless Framework (v4)
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB (Mongoose)
- **Arquitectura**: Hexagonal (Domain, Application, Infrastructure)

## Estructura del Proyecto
- `src/domain`: Entidades y definiciones de repositorio (Lógica de negocio pura).
- `src/application`: Casos de uso (Orquestación de la lógica).
- `src/infrastructure`: Implementaciones de persistencia y Handlers de AWS Lambda.

## Configuración y Ejecución
1. Instalar dependencias: `npm install`
2. Configurar `MONGO_URI` (vía env o en `serverless.ts`).
3. Ejecutar localmente: `npx serverless offline`

---

## Caso Práctico (Respuestas)

**Situación**: Tráfico cayó 40%, formulario intermitente, sitio lento en móvil.

1. **¿Qué revisaría primero?**
   - **Google Search Console**: Ver si hay errores de indexación, penalizaciones o caídas en keywords específicas que expliquen el 40% menos de tráfico.
   - **Core Web Vitals (Insights/Lighthouse)**: Para diagnosticar la lentitud en móviles (LCP, FID, CLS).
   - **Logs del Backend**: Para investigar por qué el formulario es "intermitente" (errores 500, timeouts de DB).

2. **¿Cómo abordaría el diagnóstico?**
   - **Performance**: Usar Lighthouse para identificar si hay scripts pesados, imágenes sin optimizar o bloqueo del hilo principal.
   - **Intermitencia**: Pruebas de carga sencillas y revisión de la conexión con el CRM/DB. Verificar si hay límites de tasa (rate limiting).
   - **Tráfico**: Comparar periodos previos en Analytics para ver si la caída es en una página específica (posible cambio de URL o Sitemap roto).

3. **¿Qué posibles soluciones propondría?**
   - **SEO**: Implementar SSR (Server Side Rendering) si no existe, optimizar meta tags dinámicos y arreglar el Sitemap.
   - **Velocidad**: Implementar Lazy Loading en imágenes, minificar assets y usar CDN.
   - **Formulario**: Añadir validación del lado del cliente, reintentos (retries) lógicos en el backend y monitoreo de errores en tiempo real (Sentry).

---

## Escalabilidad (Opcional)
Si el volumen crece a 10,000 leads diarios:
- Implementar una **Cola de Mensajes (SQS)** para que el formulario no dependa de la velocidad de inserción en la DB.
- Usar **Réplicas de Lectura** en MongoDB si el dashboard (Kanban/Lista) tiene mucho tráfico.
- Implementar **Caché (Redis)** para los KPIs que no necesiten tiempo real absoluto.
