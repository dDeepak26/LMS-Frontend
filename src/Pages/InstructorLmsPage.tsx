import Header from "../Components/Header/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../store.ts";

const InstructorLmsPage = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <div className="pt-16">
      <Header user={user} />
    </div>
  );
};

export default InstructorLmsPage;
