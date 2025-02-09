# Stage 1: Use the official Node.js Alpine image as the base image
FROM node:21-alpine3.18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy necessary files for dependency installation
COPY package.json package-lock.json angular.json

# Install the Angular CLI 
RUN npm install -g @angular/cli

# Install Yarn package manager
RUN apk add yarn

# Install project dependencies using Yarn
RUN yarn install

# Copy the entire application to the container
COPY . .

RUN npm install @angular-devkit/build-angular --force
# Build the Angular app with production configuration
RUN ng build --configuration=production

# Stage 2: Create a new image with a smaller base image (NGINX)
FROM nginx:1.25.3-alpine-slim

# Copy the NGINX configuration file to the appropriate location
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built Angular app from the 'calipharma' image to the NGINX HTML directory
COPY --from=build /app/dist/online-shop /usr/share/nginx/html

# Specify the command to run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
