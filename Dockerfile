# Etapa de compilación
FROM node:22-bullseye-slim AS builder

WORKDIR /app

# Instalar dependencias del sistema y Chromium necesarias para Puppeteer/critical
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Indicar a Puppeteer la ruta del ejecutable de Chromium del sistema
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copiamos solo package.json y package-lock.json primero para usar cache de Docker
COPY package.json package-lock.json ./

# Instalamos dependencias
RUN npm ci --legacy-peer-deps --silent

# Copiamos el resto de la aplicación
COPY . .

# Construimos la aplicación usando el script build:prod (ejecuta inyección de preloads)
RUN npm run build:prod -- --configuration production
RUN npm run generate-critical

# Etapa de producción - nginx
FROM nginx:stable-alpine

# Eliminamos contenido por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos compilados desde el builder
# Angular genera los ficheros estáticos en dist/<projectName>/browser; copiamos su contenido al root de nginx
COPY --from=builder /app/dist/MemoWorks/browser/ /usr/share/nginx/html/

# Copiamos la configuración de nginx para fallback en SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto expuesto
EXPOSE 80

# Ejecutar nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
