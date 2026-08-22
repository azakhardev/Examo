FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8081
# Start Expo web and bundler, binding to all network interfaces
CMD ["npx", "expo", "start", "--web"]