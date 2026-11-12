# CRUD de Tareas con Docker y MongoDB

## Descripción del proyecto

Este proyecto consiste en una API REST para la gestión de tareas, desarrollada con Node.js y Express, utilizando MongoDB como sistema de almacenamiento de datos.

La aplicación permite crear, consultar, actualizar y eliminar tareas mediante operaciones CRUD. Además, utiliza Docker y Docker Compose para ejecutar el backend y la base de datos en contenedores independientes.

## 1. Requisitos

Para ejecutar el proyecto se necesita:

- Windows 10 o Windows 11.
- Visual Studio Code.
- Docker Desktop.
- Git.
- Conexión a Internet.

Tecnologías utilizadas:

- Node.js 22.
- Express 4.
- MongoDB 7.
- Mongoose 8.
- Docker.
- Docker Compose.

No es necesario instalar MongoDB directamente en Windows, porque se ejecuta mediante Docker.

## 2. Estructura del proyecto

```text
crud-tareas-docker/
│
├── src/
│   ├── models/
│   │   └── Tarea.js
│   │
│   ├── routes/
│   │   └── tareaRoutes.js
│   │
│   └── server.js
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

### Descripción de los archivos

- `src/server.js`: inicia el servidor Express y establece la conexión con MongoDB.
- `src/models/Tarea.js`: define el modelo de datos de las tareas.
- `src/routes/tareaRoutes.js`: contiene los endpoints del CRUD.
- `Dockerfile`: configura la imagen de la aplicación.
- `docker-compose.yml`: administra los servicios del backend y MongoDB.
- `.env`: almacena las variables de configuración locales.
- `.env.example`: proporciona una plantilla de variables sin credenciales personales.
- `.gitignore`: evita subir archivos privados y dependencias.
- `.dockerignore`: excluye archivos innecesarios durante la construcción.
- `package.json`: define las dependencias y comandos de ejecución.
- `README.md`: documenta el funcionamiento y la instalación del proyecto.

## 3. Preparación del proyecto

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Ingresar a la carpeta:

```bash
cd crud-tareas-docker
```

Crear el archivo de configuración a partir de la plantilla.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

Revisar que el archivo `.env` contenga las variables necesarias:

```env
PORT=4000
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=change_me_local_only
MONGO_DATABASE=tareas_db
```

Los valores anteriores son de demostración para el entorno local. Para otro entorno deben utilizarse credenciales propias y seguras.

El archivo `.env` no debe publicarse en el repositorio.

## 4. Construcción de la aplicación

Desde la raíz del proyecto ejecutar:

```powershell
docker compose build
```

Este comando construye la imagen del backend utilizando las instrucciones del Dockerfile.

También se puede construir e iniciar todo directamente con:

```powershell
docker compose up -d --build
```

## 5. Inicio de los servicios

Ejecutar:

```powershell
docker compose up -d
```

Este comando inicia los servicios del backend y MongoDB en segundo plano.

Comprobar su estado:

```powershell
docker compose ps
```

Consultar los registros de la aplicación:

```powershell
docker compose logs app
```

Consultar los registros de MongoDB:

```powershell
docker compose logs mongodb
```

La API queda disponible en:

```text
http://localhost:4000
```

Para comprobar que funciona, abrir:

```text
http://localhost:4000/
```

La aplicación debe responder con un mensaje indicando que la API está funcionando.

## 6. Inicialización de la base de datos

El proyecto utiliza MongoDB 7 como base de datos.

La base de datos se llama `tareas_db` y se configura mediante Docker Compose.

La conexión utiliza las siguientes variables:

- `MONGO_INITDB_ROOT_USERNAME`: usuario administrador.
- `MONGO_INITDB_ROOT_PASSWORD`: contraseña del administrador.
- `MONGO_DATABASE`: nombre de la base de datos.

La aplicación se conecta a MongoDB mediante una URI interna de Docker, utilizando el nombre del servicio `mongodb`.

La colección de tareas se crea automáticamente cuando Mongoose almacena el primer documento.

No es necesario ejecutar scripts SQL ni crear manualmente las colecciones.

Los datos se conservan mediante el volumen Docker `mongo_data`.

## 7. Operaciones CRUD

La API utiliza los siguientes endpoints:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/tareas` | Consultar todas las tareas |
| GET | `/api/tareas/:id` | Consultar una tarea específica |
| POST | `/api/tareas` | Crear una tarea |
| PUT | `/api/tareas/:id` | Actualizar una tarea |
| DELETE | `/api/tareas/:id` | Eliminar una tarea |

### 7.1 Crear una tarea

Método: POST

URL:

```text
http://localhost:4000/api/tareas
```

Cuerpo JSON:

```json
{
  "titulo": "Realizar deber de Docker",
  "descripcion": "Desarrollar una API CRUD con MongoDB",
  "estado": "pendiente"
}
```

Ejemplo en PowerShell:

```powershell
$body = @{
    titulo = "Realizar deber de Docker"
    descripcion = "Desarrollar una API CRUD con MongoDB"
    estado = "pendiente"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
  -Uri "http://localhost:4000/api/tareas" `
  -ContentType "application/json" `
  -Body $body
```

### 7.2 Consultar todas las tareas

Método: GET

```powershell
Invoke-RestMethod -Method Get `
  -Uri "http://localhost:4000/api/tareas"
```

### 7.3 Consultar una tarea por ID

Método: GET

```powershell
$id = "ID_DE_LA_TAREA"

Invoke-RestMethod -Method Get `
  -Uri "http://localhost:4000/api/tareas/$id"
```

### 7.4 Actualizar una tarea

Método: PUT

```powershell
$id = "ID_DE_LA_TAREA"

$body = @{
    titulo = "Deber de Docker terminado"
    descripcion = "Proyecto actualizado correctamente"
    estado = "completada"
} | ConvertTo-Json

Invoke-RestMethod -Method Put `
  -Uri "http://localhost:4000/api/tareas/$id" `
  -ContentType "application/json" `
  -Body $body
```

### 7.5 Eliminar una tarea

Método: DELETE

```powershell
$id = "ID_DE_LA_TAREA"

Invoke-RestMethod -Method Delete `
  -Uri "http://localhost:4000/api/tareas/$id"
```

Para las operaciones de actualización y eliminación se debe utilizar el identificador `_id` devuelto por MongoDB al crear la tarea.

## 8. Detención de los servicios

Para detener y eliminar los contenedores:

```powershell
docker compose down
```

Este comando conserva el volumen de MongoDB.

Para iniciar nuevamente:

```powershell
docker compose up -d
```

Para detener los contenedores y eliminar también los datos de la base de datos:

```powershell
docker compose down -v
```

**Advertencia:** el último comando elimina el volumen `mongo_data` y todos los registros almacenados en él. Utilizarlo únicamente cuando se desee reiniciar completamente el entorno.

## 9. Errores frecuentes y soluciones

### Error 1: Authentication failed

**Causa:** las credenciales utilizadas por la aplicación no coinciden con las configuradas en MongoDB.

**Solución:**

1. Revisar las variables del archivo `.env`.
2. Comprobar que el usuario y la contraseña coincidan con la URI de conexión.
3. Si MongoDB ya fue inicializado con otras credenciales, modificar `.env` no cambia automáticamente las credenciales existentes.
4. En un entorno de pruebas sin datos importantes, ejecutar:

```powershell
docker compose down -v
docker compose up -d --build
```

Este procedimiento elimina los datos existentes.

### Error 2: Puerto 4000 ocupado

**Causa:** otro programa está utilizando el puerto que necesita la API.

**Solución:**

1. Comprobar los contenedores:

```powershell
docker compose ps
```

2. Identificar el programa que está utilizando el puerto.
3. Liberarlo o cambiar el puerto publicado en el archivo `docker-compose.yml`.
4. Iniciar nuevamente los servicios.

### Error 3: Error de conexión con MongoDB

**Causa:** la API no encuentra el servicio de base de datos o intenta conectarse antes de que esté disponible.

**Solución:**

1. Revisar que el servicio `mongodb` esté iniciado.
2. Comprobar que la URI utilice `mongodb` como nombre del host, no `localhost`.
3. Consultar los registros:

```powershell
docker compose logs mongodb
docker compose logs app
```

4. Verificar las variables de entorno.

### Error 4: Los cambios del código no se reflejan

**Causa:** Docker está ejecutando una imagen anterior de la aplicación.

**Solución:**

Reconstruir la imagen:

```powershell
docker compose up -d --build
```

Consultar los registros:

```powershell
docker compose logs app
```

## 10. Comprobación desde una copia limpia del repositorio

Para verificar que otra persona pueda ejecutar el proyecto sin depender de archivos locales, se debe realizar una clonación independiente.

Primero, subir el proyecto al repositorio remoto y comprobar que `.env.example` esté incluido y `.env` excluido.

Después, abrir PowerShell en otra carpeta y ejecutar:

```powershell
git clone URL_DEL_REPOSITORIO
cd crud-tareas-docker
```

Crear las variables de entorno:

```powershell
Copy-Item .env.example .env
```

Construir e iniciar:

```powershell
docker compose up -d --build
```

Comprobar los servicios:

```powershell
docker compose ps
```

Consultar los registros:

```powershell
docker compose logs app
```

Finalmente, realizar las operaciones CRUD para comprobar que se puede crear, consultar, actualizar y eliminar información.

La prueba se considera satisfactoria cuando:

1. El repositorio se clona correctamente.
2. Se pueden generar las variables de entorno desde `.env.example`.
3. Los dos servicios se ejecutan correctamente.
4. La aplicación se conecta con MongoDB.
5. Los endpoints CRUD responden correctamente.
6. Los datos permanecen después de detener y reiniciar los contenedores.

## 11. Conclusión

El desarrollo de esta aplicación permitió implementar una API REST con operaciones CRUD utilizando Node.js, Express y MongoDB.

Mediante Docker y Docker Compose se consiguió organizar el backend y la base de datos en servicios independientes, facilitando su construcción, ejecución y administración.

La documentación proporciona los pasos necesarios para que otra persona pueda configurar el entorno, iniciar la aplicación, probar sus funcionalidades y solucionar problemas frecuentes.

## 12. Referencias

- Docker. Docker Compose Documentation. https://docs.docker.com/compose/
- Node.js. Documentación oficial. https://nodejs.org/docs/
- Express. Documentación oficial. https://expressjs.com/
- MongoDB. Documentación oficial. https://www.mongodb.com/docs/
- Mongoose. Documentación oficial. https://mongoosejs.com/docs/