# DB 스키마

> Supabase(PostgreSQL) `academy` 스키마에 실제로 구현되어 있다. 이 프로젝트는 같은 Supabase
> 프로젝트를 다른 앱과 함께 쓰기 때문에 기본 `public` 스키마 대신 전용 스키마를 쓴다.
> 원본 정의는 `supabase/migrations/*.sql`(번호 순서대로 적용)이 최종 출처이며, 이 문서는 그
> 요약이다 — 실제 컬럼/정책을 바꿀 때는 새 마이그레이션 파일을 추가하고 이 문서도 함께 갱신한다.
>
> **DB 테이블이 아닌 정적 참조 데이터**: `Course`(`src/data/courses.js`)와 `Mentor`
> (`src/data/mentors.js`)는 DB 테이블이 아니라 프론트엔드 코드에 있는 정적 배열이다. 다른
> 테이블의 `course_id`/`mentor_id` 컬럼은 이 배열의 문자열 id(예: `course-ui-ux`,
> `mentor-1`)를 그대로 저장할 뿐, DB 레벨 FK 제약은 걸려있지 않다.

## 인증 (Supabase Auth)
로그인/비밀번호 자체는 `auth.users`(Supabase Auth 내장 테이블)가 담당한다. 이 프로젝트가 회원가입 시 추가로 받는 정보만 `academy.profiles`에 저장한다.

## 테이블 정의

### academy.profiles (`0001_academy_profiles.sql`)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK, = auth.users.id) | 계정 id |
| email | text | 이메일 |
| name | text | 이름 |
| role | text | `user` \| `mentor` \| `admin` |
| mentor_id | text (nullable) | role=mentor일 때만 값 있음, `data/mentors.js`의 id 참조 |
| birth_date | date | 생년월일 |
| gender | text | 성별 |
| phone | text | 휴대폰번호 |
| zonecode / address / address_detail | text | 주소(우편번호/주소/상세주소) |
| created_at | timestamptz | 가입 일시 |

RLS: 로그인 회원은 전체 프로필 조회 가능(관리자 화면에서 이름 표시 목적, 민감정보 없는 데모 전제). 본인 프로필만 insert/update 가능.

### academy.applications (`0003_academy_applications.sql`)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 지원 id |
| user_id | uuid (FK auth.users, nullable) | 지원자(계정 없는 더미 지원자는 null) |
| name | text | 지원 시점 이름 스냅샷(계정 없어도 표시 가능하도록) |
| course_id | text | `data/courses.js`의 id |
| status | text | `pending` \| `confirmed` \| `waiting` \| `rejected` \| `cancelled` |
| applied_at | timestamptz | 지원 일시 |

RLS: 로그인 회원 전체 조회 가능. 본인 명의로만 insert(단, `user_id is null`인 더미 등록도 별도 정책으로 허용). 상태 변경(update)은 로그인 회원 전체 허용(데모 단순화, 화면에서만 관리자로 제한).

### academy.consultations (`0006_academy_consultations.sql`)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 상담 id |
| student_id | uuid (FK auth.users) | 신청자 |
| name | text | 신청 시점 이름 스냅샷 |
| mentor_id | text (nullable) | 배정 멘토(`data/mentors.js`의 id), 관리자가 수동 배정 전까지 null |
| category | text | 상담 분야 |
| content | text | 상담 내용 |
| status | text | `requested` \| `matched` \| `in_progress` \| `completed` |
| requested_at | timestamptz | 신청 일시 |

RLS: 로그인 회원 전체 조회 가능. 본인 명의로만 insert. 상태/멘토 변경(update)은 로그인 회원 전체 허용(관리자 배정, 멘토 수락/거절/완료 전부 프론트 화면 구분으로만 나눔).

### academy.callback_requests (`0007_academy_callback_requests.sql`)
비회원 상담 신청(콜백). `student_id` 없이 이름・연락처만으로 남기는 리드(lead) 성격 테이블.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 신청 id |
| name | text | 신청자 이름 |
| phone | text | 연락처 |
| content | text | 문의 내용 |
| requested_at | timestamptz | 신청 일시 |
| contacted | boolean | 담당자 연락 완료 여부(기본 false) |
| mentor_id | text (nullable) | 배정 멘토 |

RLS: 로그인 여부 무관 누구나(anon 포함) insert 가능. 조회・수정은 로그인 회원만(관리자 전용 화면).

### academy.community_posts / academy.community_comments (`0008_academy_community.sql`, `0012_academy_community_edit_delete.sql`)
로그인 회원 누구나 글・댓글을 쓰는 다대다 자유 게시판.

**community_posts**
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 글 id |
| author_id | uuid (FK auth.users, nullable) | 작성자(시드 글은 null) |
| author_name | text | 작성자 표시 이름 |
| category | text | 카테고리(자유/스터디 모집/정보공유/후기) |
| title / content | text | 제목/본문 |
| created_at | timestamptz | 작성 일시 |

**community_comments**
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 댓글 id |
| post_id | uuid (FK community_posts, on delete cascade) | 대상 글 |
| author_id | uuid (FK auth.users, nullable) | 작성자 |
| author_name | text | 작성자 표시 이름 |
| content | text | 댓글 내용 |
| created_at | timestamptz | 작성 일시 |

RLS: `/community`가 로그인 없이도 보이는 공개 게시판이라 select는 `anon`도 허용. insert는 로그인 회원이 본인 명의로만(또는 `author_id is null`인 시드 등록). **update・delete는 작성자 본인이거나(`auth.uid() = author_id`), `profiles.role = 'admin'`인 경우만** 허용 — 두 정책이 각각 걸려 있고 하나라도 만족하면 허용된다(PostgreSQL의 permissive policy는 OR로 합쳐짐).

### academy.inquiries (`0010_academy_inquiries.sql`)
1:1 답변형 문의 게시판. 멘토 상담(분야별 배정)과 달리 담당자(관리자)가 직접 답변한다.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 문의 id |
| user_id | uuid (FK auth.users, nullable) | 작성자(비회원은 null) |
| name | text | 작성자 표시 이름(회원은 계정 이름, 비회원은 입력한 이름) |
| title / content | text | 제목/내용 |
| contact / email | text (nullable) | 연락처/이메일(선택 입력) |
| created_at | timestamptz | 작성 일시 |
| reply_content | text (nullable) | 답변 내용 — null이면 답변대기 |
| reply_admin_id | uuid (FK auth.users, nullable) | 답변한 관리자 |
| reply_created_at | timestamptz (nullable) | 답변 일시 |

별도 `status` 컬럼 없이 `reply_content` 유무로 답변대기/답변완료 상태를 파생시켜, 값 불일치(예: status는 답변완료인데 reply_content가 비어있는 경우)가 원천적으로 발생하지 않게 한다.

RLS: 조회는 로그인 회원만(마이페이지 본인 내역 + 관리자 전용 화면이라 커뮤니티처럼 `anon` 조회는 불필요). 등록(insert)은 로그인 회원 본인 명의 또는 비회원(`anon`, `user_id is null`)까지 허용. 답변 등록(update)은 로그인 회원 전체 허용(데모 단순화).

### academy.schedule_events (`0013_academy_schedule_events.sql`)
학원 일정(모집・수업・행사). `/schedule`은 로그인 없이 보는 공개 캘린더 페이지.

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid (PK) | 일정 id |
| title | text | 일정 제목 |
| type | text | `recruiting`(모집) \| `course`(수업) \| `event`(행사) |
| course_id | text | `data/courses.js`의 id |
| start_date / end_date | date | 기간 |
| created_at | timestamptz | 등록 일시 |

RLS: 조회는 `anon` 포함 누구나. 추가・수정・삭제는 로그인 회원 전체 허용(실제로는 관리자 전용 화면이지만 데모 단순화, 다른 관리 테이블과 동일한 패턴).

## 관계 요약

```
auth.users 1───1 academy.profiles
auth.users 1───N academy.applications (user_id nullable)
auth.users 1───N academy.consultations (student_id)
auth.users 1───N academy.inquiries (user_id nullable)
auth.users 1───N academy.community_posts (author_id nullable)
auth.users 1───N academy.community_comments (author_id nullable)
academy.community_posts 1───N academy.community_comments (on delete cascade)

-- DB FK가 아니라 문자열 id로만 연결(정적 데이터 참조):
data/courses.js ← course_id: applications, consultations(category 무관), schedule_events
data/mentors.js ← mentor_id: profiles(mentor role), consultations, callback_requests
```

## 공통 설계 원칙
- **더미(계정 없는) 데이터 허용**: `applications`・`community_posts`・`community_comments`・`inquiries`는 시드 데이터를 위해 `user_id`/`author_id`가 `null`인 행을 별도 insert 정책으로 허용한다(예: `applications_insert_dummy`).
- **이름 스냅샷 저장**: 대부분의 테이블이 `user_id`뿐 아니라 `name`/`author_name`도 함께 저장한다 — 관리자 화면에서 계정 조회 없이 바로 이름을 보여주기 위함이며, 탈퇴 등으로 계정이 사라져도 과거 기록의 작성자명이 남는다.
- **RLS는 데모 목적으로 단순화**: 실제로는 관리자만 하는 작업(상태 변경, 답변, 일정 관리)도 대부분 "로그인한 회원이면 누구나 가능"으로 열려 있고, 화면(라우트) 단에서만 role을 구분한다. 예외적으로 커뮤니티 글/댓글의 수정・삭제만 "본인 또는 관리자"로 서버 단(RLS)에서도 강제한다.
