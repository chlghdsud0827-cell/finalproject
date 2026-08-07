// 시드 데이터(지원자・상담 신청 학생 등)에 실제 이름처럼 보이는 랜덤 한글 이름을 부여할 때 공용으로 쓴다.
const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
const GIVEN_NAMES = [
  '민준', '서연', '지훈', '수빈', '예린', '도윤', '하은', '지우', '채원', '시우',
  '유진', '은서', '준서', '서윤', '민서', '지안', '하준', '소율', '태윤', '나윤',
]

export function randomKoreanName() {
  const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)]
  const given = GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)]
  return `${surname}${given}`
}
