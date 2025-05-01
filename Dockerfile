FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8087
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
