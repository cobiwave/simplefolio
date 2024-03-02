FROM node:latest

# Set the working directory
WORKDIR /usr

# Copy only the package.json and package-lock.json to leverage Docker caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run npm audit fix
RUN npm audit fix

# Install additional dependencies if needed
RUN npm i @parcel/transformer-sass

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]