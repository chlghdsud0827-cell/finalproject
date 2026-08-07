import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ApplicationProvider } from './context/ApplicationContext.jsx'
import { ConsultationProvider } from './context/ConsultationContext.jsx'
import { CallbackProvider } from './context/CallbackContext.jsx'
import { InquiryProvider } from './context/InquiryContext.jsx'
import { CommunityProvider } from './context/CommunityContext.jsx'
import { ScheduleProvider } from './context/ScheduleContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ApplicationProvider>
          <ConsultationProvider>
            <CallbackProvider>
              <InquiryProvider>
                <CommunityProvider>
                  <ScheduleProvider>
                    <App />
                  </ScheduleProvider>
                </CommunityProvider>
              </InquiryProvider>
            </CallbackProvider>
          </ConsultationProvider>
        </ApplicationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
