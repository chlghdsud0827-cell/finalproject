# DB 스키마

> 현재는 백엔드(Node.js + Express + SQLite)가 구현되지 않은 상태이며, 아래 스키마는 기획 단계에서 확정한 **목표 스키마**다. 프론트엔드는 이 구조를 그대로 흉내낸 mock data(`src/data/*.js`)로 동작한다. 백엔드 착수 시 이 문서를 기준으로 마이그레이션을 작성한다.

## 테이블 정의

### User
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 사용자 ID |
| email | TEXT (UNIQUE) | 로그인 이메일 |
| password | TEXT | 비밀번호 해시 (현재 mock 단계는 평문) |
| name | TEXT | 이름 |
| role | TEXT | `user` \| `mentor` \| `admin` |

멘토 역할인 경우 `Mentor.user_id`로 1:1 연결된다(현재 mock data는 `mentorId` 필드로 사용자에 직접 참조를 둠 — 정식 스키마에서는 Mentor 테이블 쪽 FK로 정리 권장).

### Course
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 과정 ID |
| title | TEXT | 과정명 |
| capacity | INTEGER | 정원 |
| current_count | INTEGER | 확정 인원 (mock 단계에서는 저장하지 않고 Application에서 매번 집계) |

현재 mock data(`src/data/courses.js`)에는 `applicationDeadline`(지원 마감일), `currentCohort`(모집 기수) 필드도 함께 있다 — 실제 스키마에도 반영 필요.

### Application
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 지원 ID |
| user_id | TEXT (FK → User.id) | 지원자 |
| course_id | TEXT (FK → Course.id) | 지원 과정 |
| status | TEXT | `pending` \| `confirmed` \| `waiting` \| `cancelled` |
| applied_at | DATETIME | 지원 일시 |

상태 전이: `지원 → confirmed / waiting → cancelled`. (mock 구현에서는 신청 즉시 confirmed/waiting으로 분기되므로 `pending`을 거치지 않는다.)

### Mentor
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 멘토 ID |
| user_id | TEXT (FK → User.id) | 연결된 사용자 계정 |
| specialties | TEXT[] (태그) | 상담 가능 분야 |
| max_concurrent | INTEGER | 동시 진행 가능 상담 수 |

### Consultation
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 상담 ID |
| student_id | TEXT (FK → User.id) | 신청자 |
| mentor_id | TEXT (FK → Mentor.id, nullable) | 배정 멘토 |
| category | TEXT | 상담 분야 |
| content | TEXT | 상담 내용 |
| status | TEXT | `requested` \| `matched` \| `in_progress` \| `completed` |
| requested_at | DATETIME | 신청 일시 |

상태 전이: `requested → matched → in_progress → completed`. 멘토 거절 시 `matched → requested`(재매칭 실패한 경우) 또는 다른 멘토로 재배정되어 `matched` 유지.

## 관계 (ERD 요약)

```
User 1───N Application N───1 Course
User 1───1 Mentor (role=mentor인 경우)
User 1───N Consultation(student)
Mentor 1───N Consultation(mentor, nullable)
User 1───N Inquiry N───1 Course
Inquiry 1───1 InquiryReply (nullable, 최대 1건)
```

### Inquiry (문의 게시판)
1:1 답변형 문의 게시판. 멘토 상담(Consultation, 분야별 자동 매칭)과는 별개 기능이며, 문의는 담당자(관리자)가 직접 답변하는 구조다. 프론트엔드 mock 단계에서는 별도 `status` 컬럼 없이 `reply` 유무로 답변대기/답변완료를 파생시켜 상태 불일치를 방지한다 — 실제 스키마에서는 `InquiryReply` 테이블 존재 여부로 동일하게 파생 가능.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 문의 ID |
| user_id | TEXT (FK → User.id) | 작성자 |
| course_id | TEXT (FK → Course.id) | 관련 과정 |
| title | TEXT | 제목 |
| content | TEXT | 문의 내용 |
| contact | TEXT (nullable) | 연락처 (선택 입력, 답변 외 직접 안내가 필요할 때만 사용) |
| email | TEXT (nullable) | 이메일 (선택 입력, 로그인 계정 이메일과 다를 수 있음) |
| created_at | DATETIME | 작성 일시 |

### InquiryReply
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 답변 ID |
| inquiry_id | TEXT (FK → Inquiry.id) | 대상 문의 |
| admin_id | TEXT (FK → User.id) | 답변한 관리자 |
| content | TEXT | 답변 내용 |
| created_at | DATETIME | 답변 일시 |

### CallbackRequest (비회원 상담 신청)
로그인 없이 이름·연락처·문의 내용만 남기면 담당자가 직접 전화로 연락하는 콜백 요청. `user_id`가 없다는 점이 `Inquiry`/`Consultation`과의 핵심 차이 — 회원 여부와 무관하게 받는 리드(lead) 성격의 테이블이다. 상태는 `contacted`(연락 완료 여부) boolean 하나로만 관리한다(멘토 자동매칭처럼 여러 단계를 거치지 않으므로).

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | TEXT (PK) | 신청 ID |
| name | TEXT | 신청자 이름 |
| phone | TEXT | 연락처 |
| content | TEXT | 문의 내용 |
| contacted | BOOLEAN | 담당자 연락 완료 여부 (기본 false) |
| requested_at | DATETIME | 신청 일시 |
