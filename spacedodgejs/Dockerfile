# Use nginx as base image
FROM nginx:alpine

# Copy the static files to nginx's served directory
COPY index.html /usr/share/nginx/html/
COPY game.js /usr/share/nginx/html/
COPY *.png /usr/share/nginx/html/
COPY *.jpeg /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Use the default nginx configuration
CMD ["nginx", "-g", "daemon off;"]