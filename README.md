# Task Manager v2

Python Flask alapú feladatkezelő alkalmazás junior backend / full-stack portfólióprojekthez.

A projekt célja: bemutatni egy egyszerű, de strukturált webalkalmazást, amelyben a felhasználók regisztrálnak, bejelentkeznek, majd saját taskjaikat kezelik.

## Fő funkciók

- Felhasználó regisztráció
- Jelszó hash-elés Werkzeug segítségével
- Login JWT tokennel
- Védett task endpointok
- Saját taskok listázása
- Task létrehozása
- Task állapotának váltása
- Task törlése
- Egyszerű HTML/CSS/JavaScript frontend
- Admin dashboard alapok
- Login események naplózása
- SQLite adatbázis
- Route / Service / Repository rétegezés

## Tech stack

- Python
- Flask
- Flask-Cors
- PyJWT
- Werkzeug
- SQLite
- HTML
- CSS
- JavaScript

## Projektstruktúra

```text
task_manager/
├── app.py
├── config.py
├── requirements.txt
├── .env.example
├── database/
│   ├── db.py
│   └── schema.sql
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   ├── admin.html
│   ├── admin.js
│   └── admin.css
├── models/
│   ├── user.py
│   └── task.py
├── repositories/
├── routes/
├── services/
└── utils/
```

## Futtatás lokálisan

1. Virtuális környezet létrehozása:

```bash
python -m venv .venv
```

2. Aktiválás Windows alatt:

```bash
.venv\Scripts\activate
```

3. Függőségek telepítése:

```bash
pip install -r requirements.txt
```

4. App indítása:

```bash
python app.py
```

5. Böngészőben:

```text
http://127.0.0.1:5000/
```

Admin oldal:

```text
http://127.0.0.1:5000/admin
```

## API endpointok

### Auth

```text
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```text
GET    /api/tasks/
POST   /api/tasks/
GET    /api/tasks/<task_id>
PUT    /api/tasks/<task_id>
PATCH  /api/tasks/<task_id>/toggle
DELETE /api/tasks/<task_id>
```

### Admin

```text
GET /api/admin/users
GET /api/admin/logs
GET /api/admin/tasks
```

Az admin endpointokhoz olyan user kell, ahol az adatbázisban `is_admin = 1`.

## Biztonsági alapelvek

- A jelszó nincs plain text formában tárolva.
- A backend JWT alapján azonosítja a usert.
- A task műveleteknél mindig van `user_id` szűrés.
- Egy user csak a saját taskjait láthatja, módosíthatja és törölheti.
- A frontend task renderelése nem közvetlen `innerHTML` stringbe helyettesíti a user által megadott task címet/leírást.

## Tanulási érték

Ez a projekt bemutatja:

- Flask route-ok működését
- Service layer szerepét
- Repository pattern alapjait
- SQL CRUD műveleteket
- JWT authentikációt
- Userhez kötött jogosultsági logikát
- Egyszerű frontend-backend kommunikációt
- Portfólióprojekt dokumentálását

## Következő fejlesztési lehetőségek

- Task szerkesztés frontendből
- Task priority mező
- Due date / határidő
- Search és filter
- Bootstrap vagy Tailwind design
- Unit tesztek
- PostgreSQL támogatás
- Deployment Render/Railway környezetbe
- Jobb admin jogosultság-kezelés
