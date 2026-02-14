# ---------- Build Frontend ----------
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


# ---------- Build Backend ----------
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --production

# Copy backend source
COPY backend ./backend

# Copy frontend build into backend public folder
COPY --from=frontend-build /app/frontend/dist ./backend/public

ENV NODE_ENV=production

WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "index.js"]
