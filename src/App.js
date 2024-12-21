import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './MainLayout';
import LoginPage from './manager/loginpage/LoginPage.jsx';
import SignupPage from './manager/signuppage/SignupPage.jsx';
import ManagerInfoPage from './manager/managerinfopage/ManagerInfoPage.jsx';
import MyMatchesPage from './manager/mymatchespage/MyMatchesPage.jsx';
import SettingsPage from './manager/settingspage/SettingsPage.jsx';
import ChangePasswordPage from './manager/changepasswordpage/ChangePasswordPage.jsx';
import WithdrawalPage from './manager/withdrawalpage/WithdrawalPage.jsx';
import MyReviews from './manager/reviewspage/MyReviews.jsx';
import TeamManagementPage from './manager/teammanagementpage/TeamManagementPage.jsx';
import ScheduleList from './manager/schedulelistpage/ScheduleList.jsx';
import MatchDetailPage from './manager/matchdetail/MatchDetailPage.jsx';
import PlayerNumberAssignment from './manager/playernumberassignment/PlayerNumberAssignment.jsx';
import MatchResultPage from './manager/matchresultpage/MatchResultPage.jsx';
import MatchRegistrationPage from './manager/matchregistrationpage/MatchRegistrationPage.jsx';
import PrivacyPolicyPage from './manager/privacypolicypage/PrivacyPolicyPage.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<MainLayout />}>
          <Route path="/schedule-list" element={<ScheduleList />} />
          <Route path="/manager-info" element={<ManagerInfoPage />} />
          <Route path="/my-matches" element={<MyMatchesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/reviews" element={<MyReviews />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/withdrawal" element={<WithdrawalPage />} />
          <Route path="/team-management" element={<TeamManagementPage />} />
          <Route path="/match-detail/:matchId" element={<MatchDetailPage />} />
          <Route path="/player-numbers" element={<PlayerNumberAssignment />} />
          <Route path="/match-results" element={<MatchResultPage />} />
          <Route path="/match-registration" element={<MatchRegistrationPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>

        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;