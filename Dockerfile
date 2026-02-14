# Use Node.js 20 lightweight image
FROM node:20-alpine

WORKDIR /app

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source code
COPY backend ./backend

# Set environment
ENV NODE_ENV=production

WORKDIR /app/backend

EXPOSE 5001

# Start backend
CMD ["node", "src/index.js"]
