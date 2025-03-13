FROM eclipse-temurin:21-alpine AS build
WORKDIR /app

COPY gradlew .
COPY gradle gradle

COPY build.gradle.kts settings.gradle.kts ./
RUN chmod +x gradlew && ./gradlew dependencies

COPY src src
RUN chmod +x gradlew && ./gradlew build -x test

FROM eclipse-temurin:21-alpine
COPY --from=build /app/build/libs/tutor-assistant-app-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "/app.jar"]
