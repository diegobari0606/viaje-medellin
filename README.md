# Itinerario Medellín · app del viaje

Web de una sola página para planear y vivir el viaje a Medellín (10–15 de septiembre)
entre Diego, Rachell, Minor y Nina. Todos editan desde su teléfono y los cambios
aparecen en vivo en la pantalla de los demás.

**Archivos**

| Archivo | Qué es |
|---|---|
| `index.html` | La app completa: diseño, lógica y conexión a Firestore |
| `firebase-config.js` | Los datos de tu proyecto de Firebase. Es el único archivo que tenés que editar |
| `manifest.json` | Permite instalarla en la pantalla de inicio como una app |
| `sw.js` | Hace que abra aunque no haya señal |
| `icon-192.png`, `icon-512.png` | El ícono (una silleta de la Feria de las Flores) |
| `README.md` | Esta guía |

Mientras no configures Firebase, la app abre igual en **modo local**: podés probarla,
pero los cambios se pierden al recargar.

---

## 1. Crear la base de datos en Firebase

1. Entrá a <https://console.firebase.google.com> y hacé clic en **Agregar proyecto**.
   Ponele el nombre que quieras (por ejemplo `viaje-medellin`). Podés desactivar
   Google Analytics, no hace falta.
2. En el menú de la izquierda: **Compilación → Firestore Database → Crear base de datos**.
   Elegí el modo de producción y la región `nam5` o `us-central1`.
3. Volvé a **Configuración del proyecto** (el engranaje, arriba a la izquierda). Bajá
   hasta **Tus apps** y hacé clic en el ícono `</>` para registrar una app web.
   Ponele un apodo y registrala; **no** actives Firebase Hosting.
4. Firebase te muestra un bloque de código con `apiKey`, `projectId` y demás.
   Copiá esos valores dentro de `firebase-config.js`, reemplazando los `PEGA_AQUI`.

> Esa `apiKey` no es una contraseña y no pasa nada si queda pública en GitHub.
> Quien protege los datos son las reglas del paso siguiente.

## 2. Poner las reglas de seguridad

En **Firestore Database → Reglas**, pegá esto y publicá:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /viajes/medellin-2026 {
      allow read, write: if request.time < timestamp.date(2026, 10, 15);
    }
  }
}
```

Cualquiera con el link puede leer y editar, pero solo ese documento y solo hasta el
15 de octubre de 2026. Después queda cerrado solo. Si querés extenderlo, cambiá la fecha.

## 3. Subir el proyecto a GitHub

Sin consola: en <https://github.com/new> creá un repositorio público llamado por
ejemplo `viaje-medellin`, entrá a **Add file → Upload files**, arrastrá **todos** los
archivos de esta carpeta y confirmá.

Desde la terminal:

```bash
git init
git add .
git commit -m "Itinerario Medellín"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/viaje-medellin.git
git push -u origin main
```

## 4. Publicarlo con GitHub Pages

1. En el repositorio: **Settings → Pages**.
2. En *Source* elegí **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guardá.
3. Esperá un par de minutos. La dirección queda así:
   `https://TU-USUARIO.github.io/viaje-medellin/`

Ese es el link que compartís en el grupo.

## 5. Instalarla en el teléfono

- **iPhone**: abrí el link en Safari → botón de compartir → *Agregar a inicio*.
- **Android**: abrí el link en Chrome → menú de tres puntos → *Instalar aplicación*.

Queda con ícono propio, a pantalla completa, y abre aunque se caiga la señal.

---

## Cómo se usa

**Todos los días**

- El botón **Editar** muestra u oculta los controles. En modo lectura se ve limpio.
- El círculo a la izquierda de cada actividad la marca como **hecha**. Lo ve todo el grupo.
- El día de hoy se resalta solo y aparece el botón **Hoy** para saltar directo a él.
- Antes del viaje, arriba sale la cuenta regresiva.
- **◎ Mapa** abre esa dirección en Google Maps.

**Editando**

- **Fecha**: se elige en el calendario y la etiqueta (`Jue 10`) se calcula sola.
- **Hora**: texto libre. Si lleva números (`8:30 a.m.`) se pinta con el color del día;
  si es algo como `Mañana`, se ve como etiqueta gris.
- **Lugar**: lo que escribás ahí es lo que busca el botón de mapa.
- **Presupuesto**: cada monto suma un subtotal por día y un total del viaje, con la
  conversión a colones y cuánto sale por persona.
- **Color del día**: los ocho círculos bajo la fecha.
- **Orden**: las flechas ↑ ↓ mueven actividades dentro del día, o el día completo.
- Se pueden **agregar y borrar días** y editar la lista de **pendientes**.

**En el menú •••**

- *Imprimir o guardar PDF*: saca el itinerario limpio, sin controles ni la guía.
- *Compartir el link*: abre el compartir del teléfono o copia la dirección.
- *Descargar una copia*: baja un `.json` con todo, por si acaso.

El indicador de arriba a la izquierda dice *Guardado*, *Guardando…* o *Actualizado*
cuando llega un cambio de otra persona.

## Cambiar la moneda o los viajeros

En `index.html`, dentro del bloque `SEMILLA`:

```js
meta:{
  titulo:"MEDELLÍN",
  viajeros:["Diego","Rachell","Minor","Nina"],
  moneda:"COP",
  tasaCRC:0.14        // cuántos colones vale un peso colombiano
}
```

La tasa también se edita desde la app, en *Lo esencial* con el modo edición activado.

Ojo: `SEMILLA` solo se usa la primera vez, para crear el documento en Firestore.
Si ya existe, cambiá esos datos borrando el documento `viajes/medellin-2026` desde
la consola de Firebase, o editándolo ahí mismo.

## Si cambiás el código después de publicar

La página se busca siempre en la red primero, así que los cambios llegan solos.
Si algún teléfono se queda con la versión vieja, subí el número de versión en `sw.js`
(`const CACHE = "medellin-v2"`) y recargá.
