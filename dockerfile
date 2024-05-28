FROM node:16

RUN apt-get update && apt-get install -y netcat postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY wait-for-it.sh /app/wait-for-it.sh

RUN chmod +x /app/wait-for-it.sh
RUN chmod +x /app/run.sh

RUN npx prisma generate

EXPOSE 3001

CMD ["/app/wait-for-it.sh", "postgres_database", "npm", "start"]
