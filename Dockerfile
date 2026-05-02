# Use Node 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build project
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]