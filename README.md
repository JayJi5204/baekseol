# 백설

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [환경 설정](#환경-설정)
3. [설치 및 배포 가이드](#설치-및-배포-가이드)
4. [서비스별 구성](#서비스별-구성)
5. [데이터베이스 설정](#데이터베이스-설정)

---

## 프로젝트 개요

### 🎯 프로젝트 목적

양질의 설문 조사를 하고싶은 사람들을 위한 **설문조사 플랫폼**으로, 다음과 같은 기능을 제공합니다:

- **설문 생성 및 관리**: 객관식, 주관식등 다양한 질문 유형 지원
- **직관적인 응당 수집 및 분석 기능**: 실시간 응답 데이터 수집 및 통계 제공
- **사용자 경험 최적화**: 사용자 경험에 따르 설문 추천
- **관리자 편의기능**: 통계를 통해 수익 구조 파악

### 🔧 주요 기술 스택

- **백엔드**: Spring Boot 3.5.5 (Java 21), Spring Webflux, WebSocket
- **프론트엔드**: React 19 + TypeScript + Vite
- **데이터베이스**: MySQL(JDBC,R2DBC), Redis
- **Message Q**:Kafka
- **Batch**: Spring Batch
- **AI**: OpenAI API
- **컨테이너화**: Docker + Docker Compose
- **CI/CD**: Jenkins
- **웹서버**: Nginx

---

## 환경 설정

### IDE

- IntelliJ, VSCode

#### Spring Boot 설정(.env)

```bash
MYSQL_USER=""
MYSQL_PASSWORD=""
SPRING_DATASOURCE_URL=""

# JWT
JWT_SECRET=""

# Toss api
TOSS_SECRET=""
TOSS_SECURITY=""

# Redis
REDIS_PORT=redis

GMAIL_USERNAME=""
GMAIL_PASSWORD=""
```

#### AI/ML 서비스 설정

```bash
# OpenAI API
OPENAI_API_KEY=""
```

### 🌐 네트워크 설정

#### 포트 매핑

- **80**: Nginx (웹 서버)
- **8081**: Spring Boot
- **3306**: MySQL
- **6379**: Redis
- **8080**: Jenkins
- **8082**: Webflux
- **29092**: Kafka

### 🌐 외부 서비스 요구사항

- **OpenAI API**: GPT 모델 사용을 위한 API 키
- **Toss API**: 결제를 구현하기 위한 API 키
- **GMail SMTP**: 메일 발송을 위한 API 키

---

## 설치 및 배포 가이드

### 1️⃣ 저장소 클론

```bash
git clone https://lab.ssafy.com/s13-final/S13P31A204.git
cd S13P31A204
```

### 2️⃣ 환경 변수 설정

```bash
# 환경 변수 파일 복사
cp env.example .env

# 환경 변수 편집
nano .env
```

### 3️⃣ Docker 환경 확인

```bash
# Docker 설치 확인
docker --version
docker-compose --version

# Docker 서비스 시작 (Linux)
sudo systemctl start docker
sudo systemctl enable docker
```

### 4️⃣ 자동 배포 실행

```bash
# 실행 권한 부여
chmod +x deploy.sh

# 배포 실행
./deploy.sh
```

### 5️⃣ 수동 배포 (단계별)

```bash
# 1. 기존 컨테이너 정리
docker-compose down --remove-orphans

# 2. 이미지 빌드
docker-compose build --no-cache

# 3. 서비스 시작
docker-compose up -d

# 4. 헬스체크
docker-compose ps
```

---

## 서비스별 구성

### 🖥️ 백엔드 (Spring Boot)

#### 주요 의존성

- Spring Boot 3.5.5
- Spring Security
- Spring Data JPA
- Spring Data Redis
- MySQL Connector
- JWT (JSON Web Token)
- Spring Boot Webflux
- Spring Boot WebSocket
- Spring Boot Kafka

#### 설정 파일 위치

- `backend/src/main/resources/application.yml`
- `backend/.env` (환경별 설정)

#### 빌드 및 실행

```bash
cd backend
./gradlew clean bootJar
java -jar build/libs/*.jar
```

### 🌐 프론트엔드 (React + Vite)

#### 주요 의존성

- React 19.1.1
- TypeScript 5.8.3
- Vite 7.1.7
- Tailwind CSS 4.1.13
- Recharts 3.4.1
- Axios 1.12.2
- Zustand 5.0.8

#### 빌드 및 실행

```bash
cd frontend
npm install
npm run build
npm run preview
```

## 데이터베이스 설정

### 🗄️ MySQL 설정

#### 데이터베이스 생성

```sql
CREATE DATABASE baekseol;
CREATE USER 'baekseol'@'%' IDENTIFIED BY 'backseol1234';
GRANT ALL PRIVILEGES ON baekseol.* TO 'baekseol'@'%';
FLUSH PRIVILEGES;
```

#### 주요 테이블

- **users**: 사용자 정보
- **payments**: 결제 정보
- **point_record**: 포인트 정보
- **surveys**: 설문 정보
- **daily_statistics**: 관리자 정보
- **interests**: 관심사 정보

#### 접속 정보

- **URL**: baekseol.site
- **사용자명**: ""
- **비밀번호**: ""

**📅 최종 업데이트**: 2025년 11월 20일
