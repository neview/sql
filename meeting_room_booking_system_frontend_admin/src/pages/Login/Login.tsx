import { Button, Checkbox, Form, Input, message } from "antd";
import "./login.css";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../interfaces/interfaces";

interface LoginUser {
  username: string;
  password: string;
}

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export function Login() {
  const navigate = useNavigate();
  const onFinish = useCallback(async (values: LoginUser) => {
    // console.log("Success:", values);
    const res = await login(values.username, values.password);

    const { code, message: msg, data } = res.data;
    if (res.status === 201 || code === 200) {
      message.success("登录成功");

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("user_info", JSON.stringify(data.userInfo));

      setTimeout(() => {
        navigate("/user_manage");
      }, 1000);
    } else {
      message.error(data || res.data.message);
    }
  }, []);
  return (
    <div id="login-container">
      {/* <h1>会议室预定系统</h1> */}
      <Form
        {...layout1}
        onFinish={onFinish}
        name="basic"
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label=" ">
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
