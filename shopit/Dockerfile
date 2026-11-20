FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_BASE_URL=http://localhost:5000
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

ENV NODE_ENV=development
ENV CHOKIDAR_USEPOLLING=true

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
