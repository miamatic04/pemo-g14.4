FROM maven AS build

WORKDIR /app

COPY ./pom.xml ./
COPY ./src ./src

RUN mvn clean install -DskipTests

FROM openjdk:21

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar" ]