# GAME OVER - Tienda de informatica y Hardware

## Descripción
**Game Over** es una plataforma de comercio electrónico especializada en la venta de componentes de hardware, placas de video, procesadores y periféricos. 

El frontend está desarrollado con Next.js, React y Tailwind CSS.

Esta aplicación consume una API RESTful desarrollada en Django para la materia de **Ingeniería de Software**.
* [Documentación / Repositorio de la API Backend](https://github.com/mchena6/games_store)

---

## Ejecución Local

Sigue estos pasos para levantar el entorno de desarrollo del frontend en tu máquina local:

1. **Clonar el repositorio e ingresar a la carpeta:**
   ```bash
   git clone git@github.com:mchena6/frontend_games_store.git
   cd frontend_games_store
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Crea un archivo llamado `.env.local` en la raíz del proyecto y agrega las siguientes variables (ajusta los puertos si es necesario):
   ```env
   # URL base donde se encuentra corriendo la API de Django
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   NODE_ENV === "production"
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Testing Unitario

El proyecto utiliza **Vitest**, **Zod** y **RHF** para asegurar la calidad y validación. 

Para correr los tests, ejecuta el siguiente comando en tu terminal:
```bash
npm run test
```
*Vitest ejecutará las pruebas en modo 'watch' mostrando el detalle de los 4 tests unitarios aprobados exitosamente.*

---

## Enlaces Importantes

* 🌐 **Aplicación Desplegada (Producción):** [https://frontend-games-store.vercel.app/]
* 📋 **Tablero Kanban (Gestión ágil):** [https://trello.com/b/7eb4Sdnq/games-store]

---

## Capturas de la Aplicación
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-59-54" src="https://github.com/user-attachments/assets/ba5861f7-7a3b-47a3-86a4-fb93d2fb5f09" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-57-01" src="https://github.com/user-attachments/assets/714b753f-0598-4dd3-998d-e8a2c7c6bdb4" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-57-07" src="https://github.com/user-attachments/assets/4b40bd7e-380f-4158-bc8c-4a8ffa9fec45" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-57-38" src="https://github.com/user-attachments/assets/2e436987-8c70-41d3-9688-f9a0977ff957" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-58-02" src="https://github.com/user-attachments/assets/d8c1ad0d-ecec-487f-884c-709bb20b9999" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-58-40" src="https://github.com/user-attachments/assets/65bddc60-7a5d-4d00-9cbd-0850e8cde12a" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 15-58-46" src="https://github.com/user-attachments/assets/ece01a66-3945-42c5-bb80-394946839574" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 16-00-05" src="https://github.com/user-attachments/assets/e1bb49cf-cd72-4f70-9833-d38b60aadd01" />
<img width="1366" height="768" alt="Captura de pantalla de 2026-11-11 16-02-03" src="https://github.com/user-attachments/assets/66e05e26-c7d4-4803-9fca-cc039eb96764" />

---

## Integrantes del Equipo

*   **Martin Chena** - (https://github.com/mchena6)
*   **Ibañez Ian** - (https://github.com/IanChoDK)
*   **Pereyra Franco** - (https://github.com/FrancoPereyra13)

---
*Proyecto desarrollado para la EFI de Programacion III.*
