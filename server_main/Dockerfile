FROM openjdk:17
WORKDIR /app
ARG JAR_FILE=build/libs/travelmaker-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} travelmaker.jar
ENTRYPOINT ["java","-jar","travelmaker.jar"]
