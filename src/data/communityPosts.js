// 커뮤니티 게시판 seed data — 문의 게시판(1:1 답변형)과 달리 수강생끼리 자유롭게
// 글을 쓰고 댓글을 주고받는 공간이라, 여러 명이 댓글을 남기는 흐름을 보여주도록 구성.
// 모든 작성자는 data/users.js에 실제 로그인 계정(authorId)으로 등록되어 있다 —
// 커뮤니티는 회원만 글・댓글을 쓸 수 있어야 하므로(CommunityContext 참고),
// 시드 데이터도 예외 없이 실제 계정과 연결해둔다.
export const COMMUNITY_CATEGORIES = ['자유', '스터디 모집', '정보공유', '후기']

export const initialCommunityPosts = [
  {
    id: 'post-1',
    authorId: 'user-osehun',
    authorName: '오세훈',
    category: '스터디 모집',
    title: '포트폴리오 피드백 스터디 같이 하실 분 구해요',
    content:
      '이번 주말부터 매주 토요일 오후에 온라인으로 포트폴리오 서로 피드백 주는 스터디를 열려고 합니다. 3~4명 정도 모이면 좋을 것 같아요. 댓글로 참여 의사 남겨주세요!',
    createdAt: '2026-07-27T10:00:00.000Z',
    comments: [
      {
        id: 'comment-1-1',
        authorId: 'user-kimhaneul',
        authorName: '김하늘',
        content: '저 참여하고 싶어요! 토요일 오후면 시간 괜찮습니다.',
        createdAt: '2026-07-27T11:00:00.000Z',
      },
      {
        id: 'comment-1-2',
        authorId: 'user-leejiwoo',
        authorName: '이지우',
        content: '오 좋은 아이디어네요, 저도 껴주세요 :)',
        createdAt: '2026-07-27T13:20:00.000Z',
      },
      {
        id: 'comment-1-3',
        authorId: 'user-osehun',
        authorName: '오세훈',
        content: '좋습니다! 그럼 이번 주 토요일 오후 3시에 온라인으로 모이는 걸로 할게요.',
        createdAt: '2026-07-27T15:00:00.000Z',
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'user-kimhaneul',
    authorName: '김하늘',
    category: '정보공유',
    title: 'Figma 무료 플러그인 추천 모음',
    content:
      '요즘 과제하면서 유용하게 쓰고 있는 무료 플러그인들 공유합니다. Autoflow(플로우 화살표), Iconify(아이콘 검색), Content Reel(더미 텍스트/이미지) 이 세 개는 진짜 필수템이에요.',
    createdAt: '2026-07-28T09:30:00.000Z',
    comments: [
      {
        id: 'comment-2-1',
        authorId: 'user-choiyoojin',
        authorName: '최유진',
        content: 'Content Reel 정보 감사합니다! 바로 설치했어요.',
        createdAt: '2026-07-28T10:15:00.000Z',
      },
      {
        id: 'comment-2-2',
        authorId: 'user-parkseojun',
        authorName: '박서준',
        content: '저는 Unsplash 플러그인도 자주 씁니다. 더미 이미지 넣을 때 편해요.',
        createdAt: '2026-07-28T14:00:00.000Z',
      },
    ],
  },
  {
    id: 'post-3',
    authorId: 'user-parkseojun',
    authorName: '박서준',
    category: '후기',
    title: '3기 선배님 취업 후기 특강 듣고 왔어요',
    content:
      '어제 저녁에 3기 수료하신 선배님이 오셔서 취업 준비 과정 특강해주셨는데 정말 도움 많이 됐습니다. 포트폴리오는 3~4개 프로젝트로 압축하고, 각 프로젝트마다 "왜 이런 결정을 했는지" 스토리를 명확히 하는 게 핵심이라고 하시더라고요.',
    createdAt: '2026-07-29T20:00:00.000Z',
    comments: [
      {
        id: 'comment-3-1',
        authorId: 'user-leejiwoo',
        authorName: '이지우',
        content: '와 저도 듣고 싶었는데 못 갔어요ㅠㅠ 녹화본 있을까요?',
        createdAt: '2026-07-29T20:30:00.000Z',
      },
    ],
  },
  {
    id: 'post-4',
    authorId: 'user-leejiwoo',
    authorName: '이지우',
    category: '자유',
    title: '다들 과제하실 때 카페 vs 집, 뭐가 더 잘 되세요?',
    content:
      '저는 집에서 하면 자꾸 눕고 싶어져서 요즘 카페 순회 중인데, 다른 분들은 어디서 작업하시는지 궁금해요. 강남역 근처 노트북 하기 좋은 카페 있으면 추천도 해주세요!',
    createdAt: '2026-07-30T15:40:00.000Z',
    comments: [
      {
        id: 'comment-4-1',
        authorId: 'user-osehun',
        authorName: '오세훈',
        content: '저도 완전 공감이요 집은 침대의 유혹이 너무 큽니다',
        createdAt: '2026-07-30T16:00:00.000Z',
      },
      {
        id: 'comment-4-2',
        authorId: 'user-choiyoojin',
        authorName: '최유진',
        content: '교육장 스터디룸도 저녁 8시까지 개방이라 자주 이용해요!',
        createdAt: '2026-07-30T16:20:00.000Z',
      },
      {
        id: 'comment-4-3',
        authorId: 'user-kimhaneul',
        authorName: '김하늘',
        content: '강남역 11번 출구 쪽 조용한 카페 많아요, 나중에 같이 가요',
        createdAt: '2026-07-30T17:05:00.000Z',
      },
      {
        id: 'comment-4-4',
        authorId: 'user-leejiwoo',
        authorName: '이지우',
        content: '오 좋아요! 다음 주에 같이 가실 분들 여기 댓글 남겨주세요',
        createdAt: '2026-07-30T17:10:00.000Z',
      },
    ],
  },
  {
    id: 'post-5',
    authorId: 'user-choiyoojin',
    authorName: '최유진',
    category: '정보공유',
    title: '국비지원 관련 서류 준비 팁 정리해봤어요',
    content:
      '국민내일배움카드 신청부터 자부담금 확인까지, 처음엔 헷갈리는 부분이 많았는데 순서대로 정리해봤습니다. 1) 고용센터에서 카드 발급 2) 훈련기관 상담 예약 3) 자부담금 확인 후 등록. 도움 되셨으면 좋겠어요.',
    createdAt: '2026-07-31T08:20:00.000Z',
    comments: [],
  },
]
