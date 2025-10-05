# Use official image as base
FROM openjdk:17-jdk-slim

# Set working directory in the container
WORKDIR /app

# Copy the backend jar file to container
COPY ./target/blue_reserve-0.0.1-SNAPSHOT.jar /app/backend.jar

# Expose the port the backend will run on
EXPOSE 8080

# Run the backend jar file
ENTRYPOINT ["java", "-jar", "backend.jar"]

