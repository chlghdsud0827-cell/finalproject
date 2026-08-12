import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import FloatingConsult from './components/FloatingConsult.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import PagePlaceholder from './components/PagePlaceholder.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import History from './pages/History.jsx'
import Facilities from './pages/Facilities.jsx'
import Instructors from './pages/Instructors.jsx'
import Mentors from './pages/Mentors.jsx'
import Notices from './pages/Notices.jsx'
import Schedule from './pages/Schedule.jsx'
import NoticeDetail from './pages/NoticeDetail.jsx'
import Faq from './pages/Faq.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Funding from './pages/Funding.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Reviews from './pages/Reviews.jsx'
import CareerSupport from './pages/CareerSupport.jsx'
import Partners from './pages/Partners.jsx'
import Location from './pages/Location.jsx'
import Branches from './pages/Branches.jsx'
import ConsultationRequest from './pages/ConsultationRequest.jsx'
import InquiryBoard from './pages/InquiryBoard.jsx'
import Community from './pages/Community.jsx'
import CommunityPostDetail from './pages/CommunityPostDetail.jsx'
import Login from './pages/Login.jsx'
import MyPage from './pages/MyPage.jsx'
import MentorDashboard from './pages/MentorDashboard.jsx'
import Admin from './pages/Admin.jsx'

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/history" element={<History />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/notices/:noticeId" element={<NoticeDetail />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/course" element={<CourseDetail />} />
        <Route path="/funding" element={<Funding />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/career-support" element={<CareerSupport />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/location" element={<Location />} />
        <Route path="/branches" element={<Branches />} />
        <Route
          path="/privacy"
          element={
            <PagePlaceholder
              title="개인정보처리방침"
              description="개인정보처리방침 내용은 추후 작성 예정입니다."
            />
          }
        />
        <Route path="/mentors" element={<Mentors />} />
        <Route
          path="/consultation"
          element={
            <RequireAuth>
              <ConsultationRequest />
            </RequireAuth>
          }
        />
        <Route path="/inquiry" element={<InquiryBoard />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:postId" element={<CommunityPostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/mypage"
          element={
            <RequireAuth>
              <MyPage />
            </RequireAuth>
          }
        />
        <Route
          path="/mentor"
          element={
            <RequireAuth role="mentor">
              <MentorDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth role="admin">
              <Admin />
            </RequireAuth>
          }
        />
      </Routes>
      <Footer />
      <FloatingConsult />
    </>
  )
}

export default App
