import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Riksdagen from "./pages/Riksdagen";
import Ledamoter from "./pages/Ledamoter";
import Dokument from "./pages/Dokument";
import Anforanden from "./pages/Anforanden";
import Voteringar from "./pages/Voteringar";
import Regeringskansliet from "./pages/Regeringskansliet";
import Pressmeddelanden from "./pages/Pressmeddelanden";
import RegeringskanslientPropositioner from "./pages/RegeringskanslientPropositioner";
import RegeringskanslientDokument from "./pages/RegeringskanslientDokument";
import RegeringskanslientKategorier from "./pages/RegeringskanslientKategorier";
import RegeringskanslientDepartementsserien from "./pages/RegeringskanslientDepartementsserien";
import RegeringskanslientSkrivelse from "./pages/RegeringskanslientSkrivelse";
import RegeringskanslientSOU from "./pages/RegeringskanslientSOU";
import RegeringskanslientTal from "./pages/RegeringskanslientTal";
import RegeringskanslientRemisser from "./pages/RegeringskanslientRemisser";
import RegeringskanslientKommittedirektiv from "./pages/RegeringskanslientKommittedirektiv";
import RegeringskanslientFaktapromemoria from "./pages/RegeringskanslientFaktapromemoria";
import RegeringskanslientInformationsmaterial from "./pages/RegeringskanslientInformationsmaterial";
import RegeringskanslientMRGranskningar from "./pages/RegeringskanslientMRGranskningar";
import RegeringskanslientDagordningar from "./pages/RegeringskanslientDagordningar";
import RegeringskanslientRapporter from "./pages/RegeringskanslientRapporter";
import RegeringskanslientRegeringsuppdrag from "./pages/RegeringskanslientRegeringsuppdrag";
import RegeringskanslientRegeringsarenden from "./pages/RegeringskanslientRegeringsarenden";
import RegeringskanslientSakrad from "./pages/RegeringskanslientSakrad";
import RegeringskanslientBistandsstrategier from "./pages/RegeringskanslientBistandsstrategier";
import RegeringskanslientOverenskommelserAvtal from "./pages/RegeringskanslientOverenskommelserAvtal";
import RegeringskanslientArendeforteckningar from "./pages/RegeringskanslientArendeforteckningar";
import RegeringskanslientArtiklar from "./pages/RegeringskanslientArtiklar";
import RegeringskanslientDebattartiklar from "./pages/RegeringskanslientDebattartiklar";
import RegeringskanslientUDAvrader from "./pages/RegeringskanslientUDAvrader";
import RegeringskanslientUttalanden from "./pages/RegeringskanslientUttalanden";
import RegeringskanslientLagradsremiss from "./pages/RegeringskanslientLagradsremiss";
import RegeringskanslientForordningsmotiv from "./pages/RegeringskanslientForordningsmotiv";
import RegeringskanslientInternationellaOverenskommelser from "./pages/RegeringskanslientInternationellaOverenskommelser";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/riksdagen" element={<Riksdagen />} />
        <Route path="/riksdagen/ledamoter" element={<Ledamoter />} />
        <Route path="/riksdagen/dokument" element={<Dokument />} />
        <Route path="/riksdagen/anforanden" element={<Anforanden />} />
        <Route path="/riksdagen/voteringar" element={<Voteringar />} />
        <Route path="/regeringskansliet" element={<Regeringskansliet />} />
        <Route path="/regeringskansliet/pressmeddelanden" element={<Pressmeddelanden />} />
        <Route path="/regeringskansliet/propositioner" element={<RegeringskanslientPropositioner />} />
        <Route path="/regeringskansliet/dokument" element={<RegeringskanslientDokument />} />
        <Route path="/regeringskansliet/kategorier" element={<RegeringskanslientKategorier />} />
        <Route path="/regeringskansliet/departementsserien" element={<RegeringskanslientDepartementsserien />} />
        <Route path="/regeringskansliet/skrivelse" element={<RegeringskanslientSkrivelse />} />
        <Route path="/regeringskansliet/sou" element={<RegeringskanslientSOU />} />
        <Route path="/regeringskansliet/tal" element={<RegeringskanslientTal />} />
        <Route path="/regeringskansliet/remisser" element={<RegeringskanslientRemisser />} />
        <Route path="/regeringskansliet/kommittedirektiv" element={<RegeringskanslientKommittedirektiv />} />
        <Route path="/regeringskansliet/faktapromemoria" element={<RegeringskanslientFaktapromemoria />} />
        <Route path="/regeringskansliet/informationsmaterial" element={<RegeringskanslientInformationsmaterial />} />
        <Route path="/regeringskansliet/mr-granskningar" element={<RegeringskanslientMRGranskningar />} />
        <Route path="/regeringskansliet/dagordningar" element={<RegeringskanslientDagordningar />} />
        <Route path="/regeringskansliet/rapporter" element={<RegeringskanslientRapporter />} />
        <Route path="/regeringskansliet/regeringsuppdrag" element={<RegeringskanslientRegeringsuppdrag />} />
        <Route path="/regeringskansliet/regeringsarenden" element={<RegeringskanslientRegeringsarenden />} />
        <Route path="/regeringskansliet/sakrad" element={<RegeringskanslientSakrad />} />
        <Route path="/regeringskansliet/bistands-strategier" element={<RegeringskanslientBistandsstrategier />} />
        <Route path="/regeringskansliet/overenskommelser-avtal" element={<RegeringskanslientOverenskommelserAvtal />} />
        <Route path="/regeringskansliet/arendeforteckningar" element={<RegeringskanslientArendeforteckningar />} />
        <Route path="/regeringskansliet/artiklar" element={<RegeringskanslientArtiklar />} />
        <Route path="/regeringskansliet/debattartiklar" element={<RegeringskanslientDebattartiklar />} />
        <Route path="/regeringskansliet/ud-avrader" element={<RegeringskanslientUDAvrader />} />
        <Route path="/regeringskansliet/uttalanden" element={<RegeringskanslientUttalanden />} />
        <Route path="/regeringskansliet/lagradsremiss" element={<RegeringskanslientLagradsremiss />} />
        <Route path="/regeringskansliet/forordningsmotiv" element={<RegeringskanslientForordningsmotiv />} />
        <Route path="/regeringskansliet/internationella-overenskommelser" element={<RegeringskanslientInternationellaOverenskommelser />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  </BrowserRouter>
);

export default App;
