FROM node:16

# Create app directory
WORKDIR /app

COPY . .

RUN npm install

EXPOSE 1337

CMD ["node", "index.js"]