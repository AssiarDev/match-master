FROM node:22.14

# Create the working folder in the container
WORKDIR /app

# Copy the dependency files and the Prisma schema
# (prisma schema is needed for the postinstall script to run during npm install)
COPY package*.json ./
COPY prisma ./prisma/

# Install the dependencies (includes native compilation for argon2 and prisma generate)
RUN npm install

# Copy the rest of the project
COPY . .

EXPOSE 3000

# Launch the server in development mode
CMD ["npm", "run", "dev"]
