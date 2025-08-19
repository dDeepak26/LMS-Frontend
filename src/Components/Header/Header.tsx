import { Link } from "react-router-dom";
import { Button, Group, Title } from "@mantine/core";

const Header = () => {
  return (
    <header className="fixed top-0 w-screen flex flex-row justify-between items-center p-3 border-b border-neutral-600 shadow-2xl">
      {/* logo */}
      <Link to={"/"}>
        <Title order={3} className="cursor-pointer">
          LMS
        </Title>
      </Link>
      {/* navigation */}
      <Group>
        <Link to={"/login"}>
          <Button>Login</Button>
        </Link>
        <Link to={"/register"}>
          <Button variant="light">Register</Button>
        </Link>
      </Group>
    </header>
  );
};

export default Header;
