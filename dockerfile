FROM node:20.11.1

# Set the working directory
WORKDIR /app

# Copy only the package.json and package-lock.json to leverage Docker caching
COPY package.json ./

# Install dependencies and fix audit issues
RUN npm install && npm audit fix

# Install additional dependencies if needed
RUN npm i @parcel/transformer-sass

# Update dependencies to the latest versions allowed by version constraints
RUN npm update

# Copy the rest of the application code
COPY . .

# Start the application
CMD ["npm", "start"]