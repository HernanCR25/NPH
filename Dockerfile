FROM maven:3.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
# Descarga las dependencias para aprovechar el caché de Docker
RUN mvn dependency:go-offline

# Copia el código fuente y compila
COPY src ./src
RUN mvn package -DskipTests

# Imagen de producción
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copia solo el JAR compilado
COPY --from=build /app/target/*.jar app.jar

# Variable para el puerto
ENV PORT=8087

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]
