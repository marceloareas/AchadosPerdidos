# Estágio de Build - Compila e cria o JAR
FROM maven:3.9.11-amazoncorretto-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
# Compila e cria o JAR executável
RUN mvn clean install -DskipTests

# Estágio Final - Prepara e executa a aplicação
FROM openjdk:21
WORKDIR /app

# Copia o JAR do estágio anterior
COPY --from=build /workspace/target/*.jar app.jar

# Usa as layertools do Spring para descompactar o JAR em camadas
RUN java -Djarmode=layertools -jar app.jar extract

# Executa a aplicação a partir dos arquivos descompactados
# CORREÇÃO: Adiciona o classpath (-cp .) para que o Java encontre a classe JarLauncher
CMD ["java", "-cp", ".", "org.springframework.boot.loader.launch.JarLauncher"]

