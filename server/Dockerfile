FROM node:22.14

# Create the working folder in the container
WORKDIR /app

# Copy the rest of the project
COPY . .

# Copy the dependency files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Generates the Prisma client
RUN npm run postinstall

EXPOSE 3000

# Launch the server in development mode
CMD ["npm", "run", "dev"]