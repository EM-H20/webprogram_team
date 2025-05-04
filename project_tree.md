# 초기 프로젝트 디렉터리 구조

plan_web/                  # 프로젝트 루트 디렉터리
  ├── app.py               # 플라스크 앱 진입점
  ├── config.py            # 환경설정 파일
  ├── requirements.txt     # 파이썬 패키지 의존성 목록
  ├── README.md            # 프로젝트 설명 문서
  ├── project_tree.md      # 프로젝트 구조 문서(현재 파일)
  ├── .gitignore           # Git 무시 파일 목록
  ├── instance/            # 인스턴스별 설정(비어있음)
  ├── models/              # 데이터 모델 관련 파일
  │   └── schedule.py      # 일정 관련 데이터 모델
  ├── routes/              # API 및 라우팅 관련 파일
  │   ├── __init__.py      # 라우트 패키지 초기화
  │   ├── api.py           # API 엔드포인트 정의
  │   └── main.py          # 메인 라우트 정의
  ├── static/              # 정적 파일(이미지, JS, CSS)
  │   ├── css/
  │   │   └── style.css    # 전체 스타일시트
  │   ├── js/
  │   │   ├── dragdrop.js  # 드래그앤드롭 기능 JS
  │   │   ├── main.js      # 메인 기능 JS
  │   │   └── schedule.js  # 일정 관련 JS
  │   └── images/          # 이미지 파일
  ├── templates/           # HTML 템플릿 파일
  │   ├── header.html      # 헤더 템플릿
  │   ├── footer.html      # 푸터 템플릿
  │   ├── index.html       # 메인 페이지
  │   ├── login.html       # 로그인 페이지
  │   └── schedule.html    # 일정 페이지
  ├── utils/               # 유틸리티 함수 모음
  │   └── naver_map.py     # 네이버 지도 관련 유틸
  └── .venv/               # 가상환경(파이썬)

---
