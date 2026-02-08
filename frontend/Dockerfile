FROM node:lts-alpine AS builder

WORKDIR /frontend

COPY package.json package-lock.json ./
COPY tsconfig*.json ./

RUN npm install --cache

COPY . /frontend/

RUN npm run build 


FROM node:lts-alpine AS final

WORKDIR /frontend
COPY package*.json ./

RUN npm install && npm cache clean --force

RUN npm i -g serve



COPY --from=builder /frontend/dist ./dist

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]