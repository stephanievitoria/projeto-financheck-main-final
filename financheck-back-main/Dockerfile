# Estágio 1: Build da aplicação (Usando Maven com Eclipse Temurin 17)
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Estágio 2: Execução do Jar (Usando a imagem leve do Eclipse Temurin 17)
FROM eclipse-temurin:17-jre-alpine
COPY --from=build /target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
