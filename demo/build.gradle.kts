plugins {
	java
	id("org.springframework.boot") version "3.2.3"
	id("io.spring.dependency-management") version "1.1.4"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa") // JPA 의존성 추가
	compileOnly("org.projectlombok:lombok")
	runtimeOnly("com.mysql:mysql-connector-java") // MySQL 데이터베이스 드라이버 추가
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	implementation("org.mariadb.jdbc:mariadb-java-client")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
