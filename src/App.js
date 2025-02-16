import React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "./MainLayout";
import LoginPage from "./manager/loginpage/LoginPage.jsx";
import SignupPage from "./manager/signuppage/SignupPage.jsx";
import ManagerInfoPage from "./manager/managerinfopage/ManagerInfoPage.jsx";
import MyMatchesPage from "./manager/mymatchespage/MyMatchesPage.jsx";
import SettingsPage from "./manager/settingspage/SettingsPage.jsx";
import MyReviews from "./manager/reviewspage/MyReviews.jsx";
import TeamManagementPage from "./manager/teammanagementpage/TeamManagementPage.jsx";
import ScheduleList from "./manager/schedulelistpage/ScheduleList.jsx";
import MatchDetailPage from "./manager/matchdetail/MatchDetailPage.jsx";
import PlayerNumberAssignment from "./manager/playernumberassignment/PlayerNumberAssignment.jsx";
import BlacklistManager from "./manager/blacklistpage/BlackListPage.jsx";
import ScoreBoardPage from "./manager/scoreboard/ScoreBoardPage.jsx";
import VideoUploadPage from "./manager/videoupload/VideoUploadPage.jsx";
import MatchCautionsPage from "./manager/matchcautions/MatchCautionsPage.jsx";
import MatchFeedbackPage from "./manager/matchfeedback/MatchFeedbackPage.jsx";
import FindEmail from "./manager/findemail/findemail.jsx";
import ResetPassword from "./manager/resetpassword/resetpassword.jsx";
import UpdatePassword from "./manager/managerinfopage/UpdatePassword.jsx";
import ManagerHome from "./manager/managerhome/ManagerHome.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup/*" element={<SignupPage />} />
        <Route path="/find-email/*" element={<FindEmail />} />
        <Route path="/reset-password/*" element={<ResetPassword />} />

        <Route element={<MainLayout />}>
          {/* 완료 */}
          <Route path="/schedule-list/*" element={<ScheduleList />} />
          <Route path="/match-detail/:matchId/*" element={<MatchDetailPage />} />
          <Route path="/my-matches/*" element={<MyMatchesPage />} />
          <Route path="/feedback/*" element={<MatchFeedbackPage />} />
          <Route path="/update-password/*" element={<UpdatePassword />} />
          <Route path="/manager/*" element={<ManagerHome />} />
          <Route path="/player-numbers/*" element={<PlayerNumberAssignment />} />

          {/* 미완료 */}
          <Route path="/manager-info/*" element={<ManagerInfoPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="/reviews/*" element={<MyReviews />} />
          <Route path="/team-management/*" element={<TeamManagementPage />} />
          <Route path="/blacklist/*" element={<BlacklistManager />} />
          <Route path="/score-board/*" element={<ScoreBoardPage />} />
          <Route path="/video-upload/*" element={<VideoUploadPage />} />
          <Route path="/match-cautions/*" element={<MatchCautionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
