import { Button, Checkbox, Form, Input } from "antd";
import "./login.css";
import { useCallback } from "react";

interface LoginUser {
  username: string;
  password: string;
}

const layout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

export function Login() {
  const onFinish = useCallback((values: LoginUser) => {
    console.log("Success:", values);
  }, []);
  return (
    <div id="login-container">
      <h1>会议室预定系统</h1>
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
