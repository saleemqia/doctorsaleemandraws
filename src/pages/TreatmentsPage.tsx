import SubPage from "./SubPage";
import Treatments from "@/components/dental/treatments/Treatments";

// /treatments: animated step-by-step explanations of common treatments.
const TreatmentsPage = () => (
  <SubPage name="treatments">{(openBooking) => <Treatments onBookingClick={openBooking("treatments")} />}</SubPage>
);

export default TreatmentsPage;
