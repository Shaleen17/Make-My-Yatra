import { Main } from "./components/HomePage/Main";
import { Route, Routes } from "react-router-dom";
import { Search } from "./components/SearchPage/Search";
import Payment from "./components/paymentPage/Payment";
import { Mytrip } from "./components/Booking_page/Getdata";
import { Final } from "./components/Booking_page/gourav/Final";
import { TirthYatraDetail } from "./components/HomePage/TirthYatraDetail";
import { AllDharamshalas } from "./components/DharamshalaPage/AllDharamshalas";
import { AllTirthYatras } from "./components/HomePage/AllTirthYatras";
import { ReelsPage } from "./components/HomePage/ReelsPage";
import { DevoteeProfilesPage } from "./components/HomePage/DevoteeProfilesPage";
import { LoginPage } from "./components/login/LoginPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Main />} />
        <Route path="/search" exact element={<Search />} />
        <Route path="/yatra/:slug" element={<TirthYatraDetail />} />
        <Route path="/dharamshalas" element={<AllDharamshalas />} />
        <Route path="/tirth-yatras" element={<AllTirthYatras />} />
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/devotee-profiles" element={<DevoteeProfilesPage />} />
        <Route path="/devotee-profiles/:handle" element={<DevoteeProfilesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" exact element={<Mytrip />} />
        <Route path="/final" exact element={<Final />} />
        <Route path="/payment" exact element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;
