# Form Component

## Overview
The Form component provides a flexible way to collect user input with validation, layout options, and various form controls.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| layout | 'horizontal' \| 'vertical' \| 'inline' | 'horizontal' | Form layout |
| initialValues | object | {} | Initial values for form fields |
| onFinish | function | - | Callback when form is submitted and validation passes |
| onFinishFailed | function | - | Callback when form submission fails validation |
| onValuesChange | function | - | Callback when any form field value changes |
| validateTrigger | string \| string[] | 'onChange' | When to validate fields |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Size of form controls |
| disabled | boolean | false | Whether all form controls are disabled |
| labelCol | object | { span: 8 } | Layout for labels |
| wrapperCol | object | { span: 16 } | Layout for form controls |
| colon | boolean | true | Whether to show colon after label |
| requiredMark | boolean \| 'optional' | true | Whether to display required mark |

## Form.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | - | Field name (required for form control) |
| label | React.ReactNode | - | Label text |
| rules | Rule[] | - | Validation rules |
| valuePropName | string | 'value' | Prop name of value in child component |
| required | boolean | false | Whether field is required |
| help | React.ReactNode | - | Help text |
| extra | React.ReactNode | - | Extra information |
| validateStatus | 'success' \| 'warning' \| 'error' \| 'validating' | - | Validation status |
| hasFeedback | boolean | false | Whether to show validation status icon |
| labelCol | object | - | Layout for label |
| wrapperCol | object | - | Layout for form control |

## Validation Rules

```typescript
interface Rule {
  required?: boolean;
  message?: string;
  type?: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'regexp';
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (rule, value) => Promise<void>;
  whitespace?: boolean;
}
```

## Basic Usage

```jsx
import { Form, Input, Button } from '@/components/ui';

function App() {
  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <Form
      layout="vertical"
      initialValues={{ username: '', password: '' }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[{ required: true, message: 'Please enter your username' }]}
      >
        <Input placeholder="Enter username" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password placeholder="Enter password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```

## Form with Different Layouts

```jsx
// Horizontal layout (default)
<Form layout="horizontal">
  {/* Form items */}
</Form>

// Vertical layout
<Form layout="vertical">
  {/* Form items */}
</Form>

// Inline layout
<Form layout="inline">
  {/* Form items */}
</Form>
```

## Form with Custom Validation

```jsx
<Form.Item
  name="email"
  label="Email"
  rules={[
    { required: true, message: 'Please enter your email' },
    { type: 'email', message: 'Please enter a valid email' },
    {
      validator: async (_, value) => {
        if (value && value.includes('test')) {
          throw new Error('Email cannot contain "test"');
        }
      }
    }
  ]}
>
  <Input placeholder="Enter email" />
</Form.Item>
```

## Form with Dependent Fields

```jsx
<Form.Item
  name="confirmPassword"
  label="Confirm Password"
  dependencies={['password']}
  rules={[
    { required: true, message: 'Please confirm your password' },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || getFieldValue('password') === value) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Passwords do not match'));
      }
    })
  ]}
>
  <Input.Password placeholder="Confirm password" />
</Form.Item>
```

## Form with Dynamic Fields

```jsx
import { Form, Input, Button, Space } from '@/components/ui';
import { MinusCircleOutlined, PlusOutlined } from 'lucide-react';

function DynamicForm() {
  return (
    <Form onFinish={onFinish}>
      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'firstName']}
                  rules={[{ required: true, message: 'Missing first name' }]}
                >
                  <Input placeholder="First Name" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'lastName']}
                  rules={[{ required: true, message: 'Missing last name' }]}
                >
                  <Input placeholder="Last Name" />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
```
