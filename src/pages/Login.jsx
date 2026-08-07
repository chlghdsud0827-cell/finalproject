import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Login.css'

const ROLE_HOME = { user: '/mypage', mentor: '/mentor', admin: '/admin' }

const INITIAL_FORM = {
  email: '',
  password: '',
  passwordConfirm: '',
  name: '',
  birthDate: '',
  gender: '',
  phone: '',
  zonecode: '',
  address: '',
  addressDetail: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

// 다음(카카오) 우편번호 서비스. 카카오맵과 달리 별도 API 키 발급 없이
// 스크립트만 로드하면 바로 사용할 수 있다.
function loadDaumPostcodeScript() {
  if (window.daum?.Postcode) return Promise.resolve()

  const existing = document.querySelector('script[data-daum-postcode]')
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', resolve)
      existing.addEventListener('error', reject)
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.dataset.daumPostcode = 'true'
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

function Login() {
  const { login, register, isEmailTaken } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [addressLoading, setAddressLoading] = useState(false)
  // 이메일을 마지막으로 중복 확인했을 때의 값과 결과를 저장 — 확인 이후 이메일을
  // 다시 수정하면 checkedEmail이 더 이상 form.email과 일치하지 않으므로 자동으로
  // "재확인 필요" 상태가 된다(별도 초기화 로직 불필요).
  const [emailCheck, setEmailCheck] = useState({ checkedEmail: '', available: null })
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleEmailCheck() {
    setError('')
    if (!EMAIL_PATTERN.test(form.email)) {
      setEmailCheck({ checkedEmail: '', available: null })
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }
    const taken = await isEmailTaken(form.email)
    setEmailCheck({ checkedEmail: form.email, available: !taken })
  }

  const emailIsChecked = emailCheck.checkedEmail === form.email && emailCheck.available !== null

  function handlePhoneChange(e) {
    setForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))
  }

  function handleAddressSearch() {
    setError('')
    setAddressLoading(true)
    loadDaumPostcodeScript()
      .then(() => {
        setAddressLoading(false)
        new window.daum.Postcode({
          oncomplete: (data) => {
            setForm((prev) => ({ ...prev, zonecode: data.zonecode, address: data.address }))
          },
        }).open()
      })
      .catch(() => {
        setAddressLoading(false)
        setError('주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
      })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (mode === 'register') {
      if (!emailIsChecked || !emailCheck.available) {
        setError('이메일 중복 확인을 먼저 완료해주세요.')
        return
      }
      if (form.password !== form.passwordConfirm) {
        setError('비밀번호가 일치하지 않습니다.')
        return
      }
      if (!form.address) {
        setError('주소 검색을 통해 집주소를 입력해주세요.')
        return
      }
    }

    setSubmitting(true)
    const result =
      mode === 'login'
        ? await login(form.email, form.password)
        : await register(form.email, form.password, form.name, {
            birthDate: form.birthDate,
            gender: form.gender,
            phone: form.phone,
            address: {
              zonecode: form.zonecode,
              address: form.address,
              detail: form.addressDetail,
            },
          })
    setSubmitting(false)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate(ROLE_HOME[result.user.role] ?? '/')
  }

  return (
    <main className="login">
      <div className="login__inner">
        <h1>{mode === 'login' ? '로그인' : '회원가입'}</h1>

        <form className="login__form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              이름
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            이메일
            <div className="login__email-row">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              {mode === 'register' && (
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={handleEmailCheck}
                >
                  중복 확인
                </button>
              )}
            </div>
            {mode === 'register' && emailIsChecked && (
              <span className={emailCheck.available ? 'login__field-ok' : 'login__field-error'}>
                {emailCheck.available
                  ? '사용 가능한 이메일입니다.'
                  : '이미 사용 중인 이메일입니다.'}
              </span>
            )}
          </label>
          <label>
            비밀번호
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          {mode === 'register' && (
            <>
              <label>
                비밀번호 확인
                <input
                  type="password"
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  required
                />
                {form.passwordConfirm && (
                  <span
                    className={
                      form.password === form.passwordConfirm
                        ? 'login__field-ok'
                        : 'login__field-error'
                    }
                  >
                    {form.password === form.passwordConfirm
                      ? '비밀번호가 일치합니다.'
                      : '비밀번호가 일치하지 않습니다.'}
                  </span>
                )}
              </label>

              <label>
                생년월일
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <fieldset className="login__gender">
                <legend>성별</legend>
                <label className="login__gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={form.gender === 'female'}
                    onChange={handleChange}
                    required
                  />
                  여성
                </label>
                <label className="login__gender-option">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={form.gender === 'male'}
                    onChange={handleChange}
                    required
                  />
                  남성
                </label>
              </fieldset>

              <label>
                휴대폰번호
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handlePhoneChange}
                  placeholder="010-0000-0000"
                  maxLength={13}
                  required
                />
              </label>

              <label>
                집주소
                <div className="login__address-row">
                  <input value={form.zonecode} placeholder="우편번호" readOnly />
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={handleAddressSearch}
                    disabled={addressLoading}
                  >
                    {addressLoading ? '불러오는 중...' : '주소 검색'}
                  </button>
                </div>
                <input
                  className="login__address-line"
                  value={form.address}
                  placeholder="주소 검색을 눌러 입력해주세요"
                  readOnly
                />
                <input
                  className="login__address-line"
                  name="addressDetail"
                  value={form.addressDetail}
                  onChange={handleChange}
                  placeholder="상세주소 (동/호수 등)"
                />
              </label>
            </>
          )}

          {error && <p className="login__error">{error}</p>}

          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <button
          type="button"
          className="login__switch"
          onClick={() => {
            setMode((m) => (m === 'login' ? 'register' : 'login'))
            setForm(INITIAL_FORM)
            setEmailCheck({ checkedEmail: '', available: null })
            setError('')
          }}
        >
          {mode === 'login'
            ? '계정이 없으신가요? 회원가입'
            : '이미 계정이 있으신가요? 로그인'}
        </button>

        <p className="login__hint">
          <span className="login__hint-title">테스트 계정 (비밀번호 모두 123456)</span>
          지원자: <span className="login__hint-account">minji@example.com</span>
          <br />
          합격자(멘토 배정): <span className="login__hint-account">yuna@example.com</span>
          <br />
          멘토: <span className="login__hint-account">jisu@example.com</span>
          <br />
          관리자: <span className="login__hint-account">admin@example.com</span>
        </p>
      </div>
    </main>
  )
}

export default Login
