# 포팅 매뉴얼

## 1. git clone 소스 클론 이후 빌드 & 배포할 수 있도록 정리한 문서

### 1-1. 개발환경

| Backend - 메인

Spring Boot 3.2.1
<br>Spring Data JPA
<br>Spring Security
<br>Jwt
<br>Swagger 3
<br>MariaDB

| Backend - 추천

Django RestAPI
<br>MariaDB

| Frontend

React
<br>MUI
<br>Styled-Components
<br>axios
<br>React Router DOM
<br>SweetAlert 2

| 배포

AWS Lightsail
<br>AWS S3
<br>AWS RDS
<br>Nginx
<br>Jenkins
<br>Docker

### 1-2. 환경변수

- gitignore
    
    .env
    

- docker-compose.yml

```xml
version: '3'

services:
  database:
    container_name: travelmaker-mariadb
    image: mariadb
    env_file:
      - .env
    restart: always
    environment:
      MYSQL_PASSWORD : ${MYSQL_PASSWORD}
      MYSQL_USER : ${MYSQL_USER}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - "./mariadb/conf.d:/etc/mysql/conf.d"
      - "./mariadb/data:/var/lib/mysql"
    ports:
      - 3306:3306
  application:
    container_name: travelmaker-server
    restart: always
    image: jindoryy/travelmaker
    ports:
      - 8081:8080
    env_file:
      - .env
    depends_on:
      - database
  django_application:
    container_name: travelmaker-django
    restart: always
    image: jindoryy/travelmaker-bigdata
    ports:
      - 8000:8000
    env_file:
      - .env
    depends_on:
      - database
  client:
    container_name: travelmaker-client
    restart: always
    image: jindoryy/travelmaker-client
    ports:
      - 3000:80
    env_file:
      - .env
    depends_on:
      - database
```

- .env

```xml
SPRING_DATASOURCE_URL = 
SPRING_DATASOURCE_USERNAME = 
SPRING_DATASOURCE_PASSWORD = 

KAKAO_CLIENT_REST_KEY = 
KAKAO_CLIENT_SECRET = 
AWS_S3_ACCESSKEY =
AWS_S3_SECRETKEY =

BIGDATA_SERVER_DOMAIN =
```

### ① EC2 서버 터미널에서 jenkins, java, docker, docker-compose 설치

```xml
sudo apt-get update

// jenkins
sudo apt-get install jenkins

// docker
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install docker-ce

// docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### ② app 폴더 생성 후 위의 .env, docker-compose.yml, 필요한 json 파일 생성

```xml
mkdir app
cd app

vi .env
vi docker-compose.yml
vi [필요한 json 파일명].json
```

### ③ jenkins pipeline script 작성 후 실행

```xml
pipeline {
    agent any
    
    environment {
        backendImageName = 
        bigdataImageName = 
        frontendImageName = 
        registryCredential = 
        
        releaseServerAccount = 
        releaseServerUri = 
    }
    
    tools {
        gradle "gradle8.5"
    }
        
    stages {
        stage('Git Clone') {
            steps {
                git branch: 'develop',
                    credentialsId: 'zmToeisfBBJpY1f3zPNN',
                    url: 'https://lab.ssafy.com/s10-bigdata-recom-sub2/S10P22A305'
            }
        }
        stage('Jar Build') {
            steps {
                dir ('server_main') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew build'
                }
            }
        }
        stage('Backend Image Build & DockerHub Push') {
            steps {
                dir('server_main') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64 -t $backendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $backendImageName:latest --push ."
                        }
                    }
                }
	            dir('server_bigdata') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
		                    sh "docker buildx build --platform linux/amd64 -t $bigdataImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $bigdataImageName:latest --push ."
                        }
                    }
                }
                dir('client') {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
		                    sh "docker buildx build --platform linux/amd64 -t $frontendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $frontendImageName:latest --push ."
                        }
                    }
                }
            }
        }
        stage('Before Service Stop') {
            steps {
                script {
                    sshagent(credentials: ['ubuntu-a305']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker-compose down"
                    ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $backendImageName:latest"
                    ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $bigdataImageName:latest"
                    ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $frontendImageName:latest"
                    '''
                    }
                }
            }
        }    
        stage('Service Start') {
            steps {
                script {
                    sshagent(credentials: ['ubuntu-a305']) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker-compose -f docker-compose.yml up -d"
                        '''
                    }
                }
            }
        }
    }
    post {
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good', 
                message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/zi68zzsd3jdabpr5w48jsocwse',
                channel: 'build'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger', 
                message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/zi68zzsd3jdabpr5w48jsocwse',
                channel: 'build'
                )
            }
        }
    }
}
```

## 2. 프로젝트에서 사용하는 외부 서비스 정보를 정리한 문서

- 소셜 로그인
    - 카카오 로그인 API
        
        https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api
