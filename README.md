# 온라인 도구 v6 — 총 16종, 한국어/영어

기존 v5 도구 4종(넓이, 공학용, 속도, 온도) + 신규 12종(길이, 무게, 부피, 데이터, 압력, 시간, 에너지, 출력, 연비, 토크, 밀도, 각도).

## 사용
`ko/index.html` 또는 `en/index.html`을 브라우저에서 열면 됩니다. 각 도구는 `/ko/<slug>/` 및 `/en/<slug>/` 독립 페이지입니다. 실제 Cloudflare 배포시 프로젝트 폴더를 정적 루트로 설정하세요.

## 광고
`assets/ads.js`에서 기본 `enabled:false, preview:true` 이므로 광고 슬롯이 '광고 자리'로만 표시되고 실제 광고는 요청하지 않습니다. 신규 도메인 애드센스 승인 이후 설정하세요. 상단/하단 자동광고는 애드센스 관리자에서 별도로 제어합니다.

## 변환 기준
- 영미권에 단위 차이가 있는 갤런(US/UK), 마력(hp/PS), 톤(t/US short ton), MPG(US/UK)는 구분함.
- KB/MB/GB = 10진 단위, KiB/MiB/GiB = 2진 단위.
- 시간의 월/년은 길이가 일정하지 않아 제외.
- 연비 L/100km은 역수 변환이며 0 이하 입력 불가.
- 파일을 서버에 올리거나 유료 API를 호출하지 않습니다.
- 계산 결과는 반올림되어 표시됩니다.


## v7: Loan repayment tool
- /ko/loan/, /en/loan/
- Equal payments, equal principal, interest-only bullet, monthly table, CSV
- Static browser-only calculation; all values estimated; use loan.js for formula logic.


## v7: Loan repayment tool
- /ko/loan/, /en/loan/
- Equal payments, equal principal, interest-only bullet, monthly table, CSV
- Static browser-only calculation; all values estimated; use loan.js for formula logic.


## v8 changes
- Branding: 완전무료 온라인도구 / 100% Free Online Tools
- Home directory ad preview positions: top, middle, bottom; placeholders require assets/ads.js.
- Image-to-PDF converter runs locally with built-in PDF/JPEG encoder (no library/API).
- PDF-to-Image converter uses PDF.js 3.11.174 on public CDN. Internet is required to load the renderer. PDF and converted images are processed locally, not uploaded.
- AdSense remains disabled; preview placeholders are marked as 광고 자리 / Ad placement.


## v9 UI 변경
- KO/EN 메인 도구 목록에서 아이콘과 상세 설명을 제거하고 도구 이름만 표시합니다.
- 홈 광고 자리 3곳 및 각 도구 광고 슬롯 유지.
- PDF 도구의 화면에 노출되던 브라우저 처리 관련 문구를 제거했습니다. 실제 파일 처리 방식은 변경하지 않았습니다.

## v10 변경 사항
- 메인 도구 목록을 개별 카드 2열 레이아웃으로 복원했습니다.
- 각 카드에는 아이콘과 설명 없이 도구 이름만 표시합니다.
- 기존 기능, 다국어 페이지, 광고 3곳은 유지합니다.


## v11: 기능/SEO 검증 및 배포 준비
- 기존 디자인과 19종 도구, KO/EN 총 38개 도구 페이지를 유지했습니다.
- 빈 루트/레거시 경로는 noindex 처리했으며, 별도 도메인이 정해지기 전까지 절대 canonical/사이트맵은 생성하지 않습니다.
- 도메인 연결 후 **프로젝트 폴더에서** `python configure_seo.py https://실제-도메인.com`을 실행하세요. 언어별 canonical, 절대 URL hreflang 및 sitemap.xml, robots.txt의 Sitemap 경로를 자동 구성합니다.
- 다시 다른 도메인으로 연결할 경우 같은 명령을 재실행할 수 있습니다.
- PDF→이미지는 PDF.js CDN 연결이 필요하고, 실제 브라우저/기기별 대용량 성능은 배포 후 재검증하세요.
- 앱의 광고는 미리보기 슬롯만 존재합니다. 애드센스 검토 통과 전 코드/자동 광고를 활성화하지 마세요.
