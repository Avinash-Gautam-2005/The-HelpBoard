# Stage 1: Build the Java application
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY helpboard-backend/pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY helpboard-backend/src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Set environment variables
ENV JAVA_OPTS="-Xmx256m -Xms256m"

# Run the application
CMD ["java", "-jar", "app.jar"]
