import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainLayout from './MainLayout';
import LoginPage from './manager/loginpage/LoginPage.jsx';
import SignupPage from './manager/signuppage/SignupPage.jsx';
import ManagerInfoPage from './manager/managerinfopage/ManagerInfoPage.jsx';
import MyMatchesPage from './manager/mymatchespage/MyMatchesPage.jsx';
import SettingsPage from './manager/settingspage/SettingsPage.jsx';
import MyReviews from './manager/reviewspage/MyReviews.jsx';
import TeamManagementPage from './manager/teammanagementpage/TeamManagementPage.jsx';
import ScheduleList from './manager/schedulelistpage/ScheduleList.jsx';
import MatchDetailPage from './manager/matchdetail/MatchDetailPage.jsx';
import PlayerNumberAssignment from './manager/playernumberassignment/PlayerNumberAssignment.jsx';
import BlacklistManager from './manager/blacklistpage/BlackListPage.jsx';
import ScoreBoardPage from './manager/scoreboard/ScoreBoardPage.jsx';
import VideoUploadPage from './manager/videoupload/VideoUploadPage.jsx';
import MatchCautionsPage from './manager/matchcautions/MatchCautionsPage.jsx';
import MatchFeedbackPage from './manager/matchfeedback/MatchFeedbackPage.jsx';

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
          <Route path="/team-management" element={<TeamManagementPage />} />
          <Route path="/match-detail/:matchId" element={<MatchDetailPage />} />
          <Route path="/player-numbers" element={<PlayerNumberAssignment />} />
          <Route path="/blacklist" element={<BlacklistManager />} /> 
          <Route path="/score-board" element={<ScoreBoardPage />} /> 
          <Route path="/video-upload" element={<VideoUploadPage />} /> 
          <Route path="/match-cautions" element={<MatchCautionsPage />} /> 
          
          <Route path="/feedback" element={<MatchFeedbackPage />} />
        </Route>

        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;