import SubPage from "./SubPage";
import CaseStudy from "@/components/dental/CaseStudy";
import { ScanVideos } from "@/components/dental/DigitalDentistry";

// /case: the full implant case (before → 3D planning → implants → result) and the 3D-scanning videos.
const CasePage = () => (
  <SubPage name="case">
    {() => (
      <>
        <CaseStudy />
        <ScanVideos />
      </>
    )}
  </SubPage>
);

export default CasePage;
