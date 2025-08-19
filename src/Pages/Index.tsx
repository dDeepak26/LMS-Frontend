import { Title } from "@mantine/core";
import Header from "../Components/Header/Header";

const Index = () => {
  return (
    <div className="flex justify-center items-center w-screen h-screen pt-16">
      <Header />
      <div className="">
        <Title order={2}>Welcome to LMS</Title>
      </div>
    </div>
  );
};

export default Index;
