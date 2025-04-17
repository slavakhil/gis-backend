# Используем официальный образ Node.js
FROM node:20-slim

# Создаем директорию внутри контейнера
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Компилируем TypeScript
RUN npm run build

# Запускаем сервер
CMD ["npm", "start"]
