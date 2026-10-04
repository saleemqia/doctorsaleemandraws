import SubPage from "./SubPage";
import Infographics from "@/components/dental/Infographics";

// /infographics: one-page visual explanations (care, gums, decay, sensitivity, food).
const InfographicsPage = () => <SubPage name="infographics">{() => <Infographics />}</SubPage>;

export default InfographicsPage;
