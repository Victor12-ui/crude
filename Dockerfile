
# Imagen base de Node.js
FROM node:22-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el código fuente
COPY src ./src

# Puerto de la aplicación
EXPOSE 4000

# Iniciar el servidor
CMD ["npm", "start"]
