import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button, Flex, Group, Menu, Text, Title } from "@mantine/core";
import type { userType } from "../../Types/UserType";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
  IconCirclePlus,
  IconLogout2,
  IconUserCircle,
} from "@tabler/icons-react";
import { removeUser } from "../../Slices/userSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user: userType = useSelector((state: RootState) => state.user);
  return (
    <header className="fixed z-50 bg-neutral-800 top-0 w-screen flex flex-row justify-between items-center p-3 border-b border-neutral-600 shadow-2xl">
      {/* logo */}
      <Link
        to={
          user && user.role === "instructor"
            ? "/instructor-lms"
            : user && user.role === "student"
            ? "/student-lms"
            : "/"
        }
      >
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
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Group className="cursor-pointer">
              <Avatar />
              <Flex direction={"column"}>
                <Text size="sm" fw={500}>
                  {user.fullName}
                </Text>
                <Text c="dimmed" size="xs">
                  {user.email}
                </Text>
              </Flex>
            </Group>
          </Menu.Target>

          <Menu.Dropdown>
            {user && user?.role === "instructor" && (
              <Menu.Item
                leftSection={<IconCirclePlus size={14} />}
                onClick={() =>
                  navigate("/instructor-lms/course", { replace: true })
                }
              >
                Create Course
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconUserCircle size={14} />}>
              Profile
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconLogout2 size={14} />}
              onClick={() => {
                dispatch(removeUser());
                sessionStorage.clear();
                localStorage.clear();
                navigate("/", { replace: true });
              }}
            >
              LogOut
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </header>
  );
};

export default Header;
