Python 가상환경 생성
python3 -m venv .venv

가상환경 실행
source .venv/bin/activate

requirements.txt 설치
pip3 install -r requirements.txt

Flask 실행
python3 app.py


주요 폴더/파일 설명
	•	app.py
		Flask 앱의 진입점. 앱 설정, 블루프린트 등록 등.

	•	requirements.txt
		의존성 패키지 목록.

	•	instance/planweb.db <-main에서 실행해서 만들어야함.
		SQLite 등 DB 파일 (Flask의 기본 인스턴스 폴더).

	•	config.py
		환경설정 (DB URI, 시크릿키 등).

	•	static/
		정적 파일(이미지, CSS, JS) 저장.
		•	css/: 모든 스타일시트 파일.
		•	js/:
			•	`main.js`: 전체 공통 JS
			•	`schedule.js`: 일정 관련 로직
			•	`dragdrop.js`: 드래그 앤 드롭 관련 코드
		•	images/: 아이콘, 배너 등 이미지 파일

	•	templates/
		Jinja2 템플릿(HTML) 파일.
		•	`header.html`: 공통 레이아웃
		•	`footer.html`: 공통 레이아웃
		•	`index.html`: 메인(검색 및 명소 확인)
		•	`schedule.html`: 일정 관리(드래그 앤 드롭, 저장/수정)
		•	`login.html`: 로그인/회원가입(필요하다면)

	•	models/
		DB 모델 정의. 예: 일정, 명소, 사용자 등.

	•	routes/
		Flask 라우트(블루프린트) 분리.
		•	`main.py`: 메인 페이지, 검색 등
		•	`api.py`: AJAX/REST API (일정 저장/불러오기 등)

	•	utils/
		외부 API 연동 등 유틸리티 코드.
		•	`naver_map.py`: 네이버 지도 API 연동 함수

3. 추가 설명 및 팁
	•	반응형 UI
	`style.css`에 미디어 쿼리로 모바일/태블릿/PC 대응.
	필요시 Bootstrap, Tailwind 등 CSS 프레임워크 활용 가능.
	•	드래그 앤 드롭
	`dragdrop.js`에서 명소 순서 변경 기능 구현.