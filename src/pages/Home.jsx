import { Link } from 'react-router-dom'
import { useApplications } from '../context/ApplicationContext.jsx'
import { DEFAULT_COURSE_ID } from '../data/courses.js'
import { portfolios } from '../data/portfolios.js'
import HeroSlider from '../components/HeroSlider.jsx'
import HomePromoModal from '../components/HomePromoModal.jsx'
import FundingBanner from '../components/FundingBanner.jsx'
import AchievementBanner from '../components/AchievementBanner.jsx'
import DeadlineCountdown from '../components/DeadlineCountdown.jsx'
import PortfolioCard from '../components/PortfolioCard.jsx'
import JourneyGraph from '../components/JourneyGraph.jsx'
import PartnerMarquee from '../components/PartnerMarquee.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import BottomCta from '../components/BottomCta.jsx'
import './Home.css'

function Home() {
  const { getCourseWithCapacity } = useApplications()
  const course = getCourseWithCapacity(DEFAULT_COURSE_ID)
  const previewPortfolios = portfolios.slice(0, 3)

  return (
    <main className="home">
      <HomePromoModal course={course} />
      <FundingBanner />
      <HeroSlider />
      <AchievementBanner />

      <div className="home__capacity">
        <Link className="btn btn--primary" to="/course">
          지원하기
        </Link>
        <DeadlineCountdown deadline={course.applicationDeadline} compact />
      </div>

      <JourneyGraph />

      <section className="home__portfolio" aria-label="수료생 포트폴리오">
        <div className="home__portfolio-head">
          <h2>수료생 포트폴리오</h2>
          <Link to="/portfolio">전체 보기 →</Link>
        </div>
        <div className="home__portfolio-grid">
          {previewPortfolios.map((p) => (
            <PortfolioCard key={p.id} portfolio={p} />
          ))}
        </div>
      </section>

      <PartnerMarquee />
      <FaqAccordion />
      <BottomCta />
    </main>
  )
}

export default Home
