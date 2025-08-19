import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import { Button, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconLockPassword,
  IconMail,
  IconX,
} from "@tabler/icons-react";
import Header from "../Components/Header/Header";
import { userLoginService } from "../Services/authServices";
import { useDispatch } from "react-redux";
import { TOKEN } from "../Constants";
import { setUser } from "../Slices/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form config for login form
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value)
          ? null
          : "At least 8 chars: 1 upper, 1 lower, 1 number, 1 special",
    },
  });

  // handle login
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const res = await userLoginService(values);

      if (res.msg) {
        // storing the token in session storage
        sessionStorage.setItem(TOKEN, res.token);

        // storing the user
        dispatch(setUser(res.user));

        // resetting the form
        form.reset();

        // navigating based on role
        if (res.user?.role === "student") {
          navigate("/student-lms", { replace: true });
        } else if (res.user?.role === "instructor") {
          navigate("/instructor-lms", { replace: true });
        }

        // notification
        notifications.show({
          title: `Welcome Back ${res.user?.fullName}`,
          message: "Login Successful",
          color: "green",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });
      } else {
        // notification
        notifications.show({
          title: `Error in Login`,
          message: `${res}`,
          color: "red",
          icon: <IconX size={18} />,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error in Logging the User", err);
    }
  };

  return (
    <div className="pt-16 w-screen h-screen flex justify-center items-center">
      <Header />
      <form
        onSubmit={form.onSubmit((values) => handleLogin(values))}
        className="border border-neutral-600 rounded-2xl p-3 w-1/3 space-y-4"
      >
        <Title order={4} mb={"md"}>
          Login into your Account
        </Title>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="example@gmail.com"
          leftSection={<IconMail />}
          type="email"
          required={true}
          key={form.key("email")}
          {...form.getInputProps("email")}
        />
        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="********"
          leftSection={<IconLockPassword />}
          required={true}
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Button type="submit" fullWidth>
          Login
        </Button>

        <Text size="sm" className="text-center">
          Do'nt have an account?{" "}
          <Link to={"/register"} className="cursor-pointer underline">
            Register
          </Link>
        </Text>
      </form>
    </div>
  );
};

export default LoginPage;
