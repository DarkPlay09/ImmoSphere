
# Compilation Angular
FROM node:24 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production \
    && index_file="$(find dist -type f -name index.html -print -quit)" \
    && test -n "$index_file" \
    && mkdir -p /site \
    && cp -a "$(dirname "$index_file")/." /site/

# Serveur web de production
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /site/ /usr/share/nginx/html/

EXPOSE 80
