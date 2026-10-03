import SubPage from "./SubPage";
import KidsTeeth from "@/components/dental/KidsTeeth";
import Posters from "@/components/dental/Posters";

// /kids: the children's teeth guide for parents and the educational posters.
const KidsPage = () => (
  <SubPage name="kids">
    {(openBooking) => (
      <>
        <KidsTeeth onBookingClick={openBooking("kids")} />
        <Posters />
      </>
    )}
  </SubPage>
);

export default KidsPage;
