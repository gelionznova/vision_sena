# Sistema de Control de Acceso con Reconocimiento Facial y QR

App web **full‑stack** (Backend **Django**, Frontend **React**) para **gestionar el acceso** a instalaciones educativas o cualquier entidad con **niveles de seguridad**, **carnet digital** con **capa de seguridad + QR**, y **modelo de reconocimiento facial** que **registra entradas/salidas** y **seguimiento de desplazamiento** por **zonas comunes** y **áreas restringidas** mediante una **red de cámaras** conectadas al sistema.

---

## ✨ Características principales

- **Gestión de identidades**: funcionarios, estudiantes y visitantes (roles y permisos granulares).
- **Carnet digital** con QR seguro (firma/verificación + expiración + anti‑replay).
- **Reconocimiento facial** (por ejemplo OpenCV LBPH / FaceNet según configuración) para validar acceso.
- **Registro de entradas y salidas** por punto de control (torniquete, portería, puerta).
- **Seguimiento de desplazamientos**: actividad por zonas, rutas y permanencias.
- **Mapa de cámaras / zonas**: asociación de cámaras IP/RTSP a áreas (comunes vs. restringidas).
- **Panel de monitoreo en tiempo real** (WS/SSE): eventos, alertas, métricas.
- **Bitácora de auditoría** (quién, dónde, cuándo, dispositivo, IP).
- **Notificaciones** (correo/push) según políticas (p. ej., intento fallido/alerta).
- **API REST** autenticada (JWT) para integraciones.
- **Exportes** (CSV/Excel/PDF) de actividad y eventos.
- **Multi‑entidad / multi‑sede** (opcional) y **multilenguaje** (i18n).

---

## 🏗️ Arquitectura

- **Frontend**: React + Router + estado (Context/Redux) + UI library (a elección).
- **Backend**: Django + Django REST Framework (DRF) + JWT (djangorestframework‑simplejwt).
- **Reconocimiento**: servicio Python (OpenCV/mediapipe/face_recognition) + colas (Celery/Redis) opcional.
- **BD**: PostgreSQL (prod) / SQLite (dev).
- **Cámaras**: RTSP/RTMP/IP; ingesta vía ffmpeg/opencv; opcional **WebRTC** para baja latencia.
- **DevOps**: Docker Compose (nginx + backend + frontend + worker + db + redis).
- **Observabilidad**: logging estructurado + health checks + métricas (prometheus opcional).

```
/project-root
  ├─ servers/
  │   ├─ django/           # backend
  │   └─ react/            # frontend
  ├─ vision/               # módulos de visión (RF/RTSP, modelos, jobs)
  ├─ deploy/               # docker, nginx, scripts
  └─ docs/                 # diagramas, políticas, plantillas
```

---

## 🔐 Seguridad

- **JWT** con refresh/rotate, expiración corta y revocación de tokens.
- **CORS/CSRF** configurado por ambiente.
- **Hash de contraseñas** (Argon2/BCrypt).
- **QR firmado** (HMAC/ECDSA) con **nonce**, **timestamp** y **scope** (entrada/salida/área).
- **Rate‑limit** para endpoints críticos y verificación facial.
- **Principio de mínimo privilegio** en roles (Admin, Seguridad, Operador, Invitado).

---

## 🧠 Reconocimiento Facial (pipeline sugerido)

1. **Detección de rostro** (Haar/MTCNN/MediaPipe).
2. **Alineación + normalización** (geométrica/iluminación).
3. **Extracción / embedding**: LBPH (rápido on‑edge) o CNN (FaceNet/ArcFace).
4. **Comparación**: distancia/coseno, umbral configurable por **nivel de seguridad** y **área**.
5. **Fusión con QR** (si aplica) + políticas (doble factor).
6. **Registro de evento** (usuario, cámara, score, zona, decisión).

> **Nota**: para datasets/modelos, usar **Git LFS** o almacenamiento externo; evitar subir miles de imágenes al repo estándar.

---

## 🧩 Módulos principales (Backend)

- **Users**: roles, permisos, perfiles biométricos, carnet digital.
- **Devices**: cámaras, puertas, zonas, sedes.
- **Access**: reglas/políticas por zona, horarios, listas blancas/negra.
- **Events**: entradas/salidas, intentos fallidos, alertas.
- **Tracking**: estadías por zona, heatmaps (derivado), rutas (opcional).
- **Reporting**: informes, exportes y analíticas.

### Modelos (resumen)

- `Person` (role, doc_id, photo, embeddings)
- `Device` (type, camera_uri, zone, status)
- `Zone` (name, type: common/restricted, policies)
- `AccessRule` (zone, schedule, min_score, factors)
- `AccessEvent` (person, device, zone, type: in/out, score, method: face/qr/both)
- `Movement` (person, from_zone, to_zone, time_span)

---

## 🔗 API (ejemplos)

Autenticación:

```http
POST /api/auth/login
Authorization: (none)
Body: { "username": "admin", "password": "..." }
→ { "access": "...", "refresh": "..." }
```

Verificación QR (servidor valida firma y vigencia):

```http
POST /api/access/verify-qr
Authorization: Bearer <access>
Body: { "qr": "<payload/base64>" }
→ { "ok": true, "zone": "LAB-IA", "decision": "allow" }
```

Evento facial:

```http
POST /api/access/verify-face
Authorization: Bearer <access>
Body: { "device_id": "cam-01", "image": "<base64>", "mode": "in" }
→ { "ok": true, "person_id": 123, "score": 0.92, "decision": "allow" }
```

Listar actividad (filtros):

```http
GET /api/events?zone=LAB-IA&from=2025-10-01&to=2025-10-30
Authorization: Bearer <access>
```

---

## 🛠️ Requisitos

- Python 3.10+
- Node 18+/Yarn o npm
- PostgreSQL 14+ (prod) / SQLite (dev)
- (Opcional) Redis para colas y WebSocket broadcast
- FFmpeg (procesar RTSP/frames)
- OpenCV/mediapipe/face_recognition según pipeline elegido

---

## ⚙️ Configuración rápida (DEV)

### Backend (Django)

```bash
cd servers/django
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -U pip wheel
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

**.env.example** (backend)

```
DEBUG=true
SECRET_KEY=change_me
ALLOWED_HOSTS=*
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
JWT_ACCESS_TTL_MIN=15
JWT_REFRESH_TTL_DAYS=7
QR_SECRET_KEY=change_me_qr
MEDIA_ROOT=./uploads
```

### Frontend (React)

```bash
cd servers/react
npm install   # o yarn
cp .env.example .env
npm run dev   # o yarn dev
```

**.env.example** (frontend)

```
VITE_API_BASE=http://localhost:8000/api
VITE_WS_BASE=ws://localhost:8000/ws
VITE_APP_NAME=Control de Acceso IA
```

---

## 🧪 Datos de prueba

```bash
# Backend
python manage.py loaddata fixtures/dev/users.json
python manage.py loaddata fixtures/dev/zones.json
python manage.py loaddata fixtures/dev/devices.json
```

---

## 🐳 Deploy con Docker Compose (prod)

```
deploy/
  ├─ docker-compose.yml
  ├─ nginx/
  │   └─ site.conf        # proxy, gzip, HTTP/2, certificados
  └─ env/
      ├─ backend.env
      ├─ frontend.env
      └─ postgres.env
```

Comandos:

```bash
docker compose pull
docker compose up -d --build
docker compose logs -f
```

Buenas prácticas prod:

- **HTTPS** (Let’s Encrypt) y **HTTP/2**.
- **SECURE\_\*** flags en Django, **HSTS**, **CSP**.
- **ALLOWED_HOSTS** fijo y **CORS** acotado.
- **Workers** gunicorn + autorestart (systemd).
- **Backups** BD + rotación de logs.
- **Supervisión** (healthchecks, uptime).

---

## 📈 Métricas & Reportes (ideas)

- Tasa de accesos permitidos/denegados por zona y franja horaria.
- Top de intentos fallidos por dispositivo/usuario.
- Heatmap de permanencia por áreas.
- SLA de cámaras/dispositivos en línea.

---

## 🗺️ Roadmap

- WebRTC de baja latencia para cámaras.
- SDK móvil (Wallet/Pass) para carnet offline.
- 2FA biométrico (rostro + QR + PIN/OTP).
- Detección antispoofing (blink/liveness).
- Motor de reglas no‑code por políticas.
- Integración Active Directory / LDAP.
- Multi‑tenant por organización/sede.
- Panel analítico con dashboards (recharts).

---

## 📜 Licencia

MIT — ver `LICENSE` (SENA).

---

## 🤝 Contribuciones

Issues y PRs son bienvenidos. Abre un ticket con tus propuestas o bugs.

---

## ✅ Checklists rápidas

**Antes de producción**

- [ ] SECRET_KEY/QR_SECRET_KEY rotadas y seguras
- [ ] HTTPS + HSTS + CSP
- [ ] BD en PostgreSQL + backups
- [ ] Usuarios/roles mínimos necesarios
- [ ] Umbrales de score por zona revisados
- [ ] Aviso de privacidad y consentimiento biométrico

**Mantenimiento**

- [ ] Rotación de logs
- [ ] Monitoreo de cámaras (heartbeat)
- [ ] Re‑entrenamiento/perfilado de embeddings
- [ ] Revisión de accesos anómalos

---

## 👥 Equipo & Créditos

**Desarrolladores Aprendices SENA — CTPI Regional Cauca, Popayán, Colombia**
**Tecnico Procesamiento de Datos para Modelos de Inteligencia Artificial - Ficha 2993008**

- **Yeimy Fabián Méndez Mendoza** — _Líder del Proyecto / Product Owner_
- **Juan David Domínguez** — _Backend & API (Django/DRF), Seguridad y Autenticación_
- **Juan David Erazo** — _Frontend (React), UX/UI y Experiencia de Usuario_
- **Deiby Emanuel** — _Visión por Computador (OpenCV/RTSP) & DevOps/Infra (Docker, Nginx)_

> Este proyecto fue desarrollado en el marco de formación SENA, **Centro de Teleinformática y Producción Industrial (CTPI) — Regional Cauca, Popayán, Colombia**.

---
