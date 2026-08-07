export const INQUIRY_STATUS_LABEL = {
  pending: '답변대기',
  answered: '답변완료',
}

export const INQUIRY_STATUS_BADGE_CLASS = {
  pending: 'badge--waiting',
  answered: 'badge--success',
}

export function getInquiryStatus(inquiry) {
  return inquiry.reply ? 'answered' : 'pending'
}
