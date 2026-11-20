FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development

EXPOSE 5000

CMD ["npm", "run", "dev"]
