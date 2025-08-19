import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  PasswordInput,
  Radio,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Header from "../Components/Header/Header";
import {
  IconCheck,
  IconLockPassword,
  IconMail,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { userRegisterService } from "../Services/authServices";

const RegisterPage = () => {
  const navigate = useNavigate();
  // form config for register form
  const form = useForm({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      role: "student",
    },
    validate: {
      fullName: (value) =>
        /^[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*$/.test(value)
          ? null
          : "Each name should start with a capital letter and should only contain letters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(value)
          ? null
          : "At least 8 chars: 1 upper, 1 lower, 1 number, 1 special",
    },
  });

  // handle register
  const handleRegister = async (values: {
    fullName: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      // api call
      const res = await userRegisterService(values);

      if (res.msg) {
        // resetting form
        form.reset();

        // navigating
        navigate("/login", { replace: true });

        // notification
        notifications.show({
          title: `Registration Done Successfully`,
          message: `registered`,
          color: "green",
          icon: <IconCheck size={18} />,
          autoClose: 3000,
        });
      } else {
        form.reset();
        // notification
        notifications.show({
          title: `Error in Registering`,
          message: `${res}`,
          color: "red",
          icon: <IconX size={18} />,
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error in Registering the User", err);
    }
  };

  return (
    <div className="pt-16 w-screen h-screen flex justify-center items-center">
      <Header />
      <form
        onSubmit={form.onSubmit((values) => handleRegister(values))}
        className="border border-neutral-600 rounded-2xl p-3 w-1/3 space-y-4"
      >
        <Title order={4} mb={"md"}>
          Create New Account
        </Title>
        <TextInput
          withAsterisk
          label="Full Name"
          placeholder="John Deo"
          leftSection={<IconUser />}
          required={true}
          key={form.key("fullName")}
          {...form.getInputProps("fullName")}
        />
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
        <Radio.Group
          name="role"
          label="Select your Role"
          withAsterisk
          key={form.key("role")}
          {...form.getInputProps("role")}
        >
          <Group mt="xs">
            <Radio value="student" label="Student" />
            <Radio value="instructor" label="Instructor" />
          </Group>
        </Radio.Group>
        <Button type="submit" fullWidth>
          Register
        </Button>

        <Text size="sm" className="text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="cursor-pointer underline">
            Login
          </Link>
        </Text>
      </form>
    </div>
  );
};

export default RegisterPage;
