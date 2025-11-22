# 1. Node 베이스 이미지 선택
FROM node:20-alpine

# 2. 작업 디렉터리 생성
WORKDIR /app

# 3. package.json, package-lock.json 먼저 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install --only=production

# 5. 나머지 코드 복사
COPY . .

# 6. 환경 변수 (포트)
ENV PORT=4000

# 7. 컨테이너가 노출할 포트
EXPOSE 4000

# 8. 실행 명령
CMD ["node", "src/server.js"]