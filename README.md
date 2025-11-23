# 🧪 TestWeaver Backend v1

> **Pairwise(IPO) 기반 테스트 케이스 자동 생성 웹 서비스의 백엔드 프로젝트**

> 원래 Spring Boot + JPA로 설계했던 구조를, Node.js + Express.js + MySQL(MariaDB 호환) 기반으로 재구현

> 도메인 레벨에서는 **Strategy / Builder / Factory / Template Method / Repository / DTO 패턴**을 적용

---

## 1. 개요 (Overview)

TestWeaver는 다음과 같은 목적으로 가진 테스트 설계 도구.

- 파라미터와 값 목록을 입력하면 **Pairwise(IPO) 알고리즘**으로 테스트 케이스를 자동 생성

- 생성된 테스트 케이스를 웹 UI에서 조회/관리

- CSV/Excel 등으로 내보내기 (Export 구현)

- 프로젝트 단위로 테스트 케이스를 그룹화 및 관리

프론트는 별도 리포지토리로 구성

---

## 2. 기술 스택 (Tech Stack)

### Backend

- Node.js
- Express
- MariaDB (MySQL2 드라이버 사용)
- dotenv (환경변수 관리)

### 아키텍쳐 & 패턴

- **Layered Architecture**
    - routes ▶ controller ▶ service ▶ repository ▶ DB
- **Strategy Pattern**
    - IPO, IPOG 등 Pairwise 알고리즘 교체 가능
- **Builder Pattern**
    - TestCase 생성 시 Builder로 조립
- **Factory Pattern**
    - CSV / Excel 등 Export 타입에 따라 Exporter 생성
- **Repository Pattern**
    - DB 쿼리를 전담하는 레이어 분리
- **DTO**
    - Controller와 Service 간 요청/응답 객체 명확화

---

### 3. 프로젝트 구조 (Folder Structure)

```bash
📦 testweaver-backend
├─ 📁 src
│  ├─ 📁 config
│  │   ├─ env.js           # 환경변수 로딩 및 공통 설정
│  │   └─ db.js            # MySQL2 연결 풀 생성
│  │
│  ├─ 📁 routes            # 라우터 (Express Router)
│  │   ├─ project.routes.js
│  │   ├─ testcase.routes.js
│  │   └─ auth.routes.js
│  │
│  ├─ 📁 controller        # Request → Service 호출, DTO 매핑
│  │   ├─ project.controller.js
│  │   ├─ testcase.controller.js
│  │   └─ auth.controller.js
│  │
│  ├─ 📁 service           # 비즈니스 로직
│  │   ├─ project.service.js
│  │   ├─ testcase.service.js
│  │   └─ auth.service.js
│  │
│  ├─ 📁 repositories        # DB 접근 계층 (MySQL2 + SQL)
│  │   ├─ project.repository.js
│  │   ├─ testcase.repository.js
│  │   └─ user.repository.js
│  │
│  ├─ 📁 core            # 도메인 로직 & 패턴 모음
│  │   ├─ 📁 strategy
│  │   │   └─ 📁 pairwise
│  │   │       ├─ IPOGStrategy.js
│  │   │       ├─ IPOStrategy.js
│  │   │       ├─ PairwiseEngine.js
│  │   │       ├─ PairwiseStrategy.js
│  │   │       └─ PairwiseStrategyFactory.js
│  │   │
│  │   ├─ 📁 builder
│  │   │   └─ TestCaseBuilder.js   # parameter + values → testcase 조립
│  │   │
│  │   ├─ 📁 export
│  │   │   ├─ ExporterFactory.js   # type: 'csv' | 'excel' → Exporter 생성
│  │   │   ├─ CsvExporter.js
│  │   │   └─ ExcelExporter.js
│  │   │
│  │   ├─ 📁 validator
│  │   │   ├─ auth.validator.js
│  │   │   ├─ TestCaseValidator.js
│  │   │   └─ DefaultTestCaseValidator.js
│  │
│  ├─ 📁 dto
│  │   ├─ project.dto.js
│  │   └─ testcase.dto.js
│  │
│  ├─ 📁 middleware
│  │   ├─ errorHandler.js
│  │   ├─ validateRequest.js
│  │   └─ auth.js
│  │
│  ├─ 📁 utils
│  │   └─ asyncHandler.js          # 비동기 controller 에러 래핑
│  │
│  ├─ app.js                       # Express 앱 설정, 미들웨어/라우터 등록
│  └─ server.js                    # 실제 서버 시작 (http.listen)
│
├─ .env                            # 실제 환경 변수 (Git에 올리지 않음)
├─ package.json
└─ README.md