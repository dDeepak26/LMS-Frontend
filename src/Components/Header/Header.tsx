import { Link } from "react-router-dom";
import { Button, Group, Title } from "@mantine/core";
import type { userType } from "../../Types/UserType";

const Header = ({ user }: { user?: userType }) => {
  console.log("user from header", user);

  return (
    <header className="fixed top-0 w-screen flex flex-row justify-between items-center p-3 border-b border-neutral-600 shadow-2xl">
      {/* logo */}
      <Link to={"/"}>
        <Title order={3} className="cursor-pointer">
          LMS
        </Title>
      </Link>
      {/* navigation */}
      {/* when !user */}
      {!user && (
        <Group>
          <Link to={"/login"}>
            <Button>Login</Button>
          </Link>
          <Link to={"/register"}>
            <Button variant="light">Register</Button>
          </Link>
        </Group>
      )}
      {/* when user */}
      {user && (
        <Link to={"/instructor-lms/course"}>
          <Button>Create Course</Button>
        </Link>
      )}
    </header>
  );
};

export default Header;
