import { useState } from 'react';
import { Card, Form, Input, Button, Select, message, Typography, Steps, Row, Col, Divider, Tag } from 'antd';
import {
  CreditCardOutlined,
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ScanOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

export const CardRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [customers, setCustomers] = useState<any[]>([]);
  const [registeredCard, setRegisteredCard] = useState<any>(null);

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4500/api'
    : 'https://kiaan.alexandratechlab.com/api';

  // Load customers when component mounts
  useState(() => {
    fetch(`${API_URL}/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data.data || []));
  });

  const handleCardScan = async (values: { uid: string }) => {
    setLoading(true);
    try {
      // Check if card already exists
      const checkResponse = await fetch(`${API_URL}/cards?uid=${values.uid}`);
      const checkData = await checkResponse.json();

      if (checkData.data && checkData.data.length > 0) {
        message.error('This card is already registered!');
        setLoading(false);
        return;
      }

      setCurrentStep(1);
      message.success('Card scanned successfully! Select customer.');
    } catch (error) {
      message.error('Error scanning card.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = () => {
    setCurrentStep(2);
  };

  const handlePinSetup = async (values: any) => {
    setLoading(true);
    try {
      const cardData = {
        uid: form.getFieldValue('uid'),
        customer_id: form.getFieldValue('customer_id'),
        pin: values.pin,
        balance: values.initial_balance || 0,
        status: 'active',
        branch_id: '96dab113-cead-47d0-8878-31a15ac94bc9',
      };

      const response = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredCard(data.data);
        setCurrentStep(3);
        message.success('Card registered successfully!');
      } else {
        message.error(data.error || 'Failed to register card.');
      }
    } catch (error) {
      message.error('Error registering card.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewRegistration = () => {
    setCurrentStep(0);
    setRegisteredCard(null);
    form.resetFields();
  };

  const steps = [
    {
      title: 'Scan Card',
      icon: <ScanOutlined />,
    },
    {
      title: 'Select Customer',
      icon: <UserOutlined />,
    },
    {
      title: 'Set PIN',
      icon: <LockOutlined />,
    },
    {
      title: 'Complete',
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <Title level={2}>
        <CreditCardOutlined /> NFC Card Registration
      </Title>
      <Text type="secondary">Register new NFC cards for customers</Text>

      <Card style={{ marginTop: 24 }}>
        <Steps current={currentStep} items={steps} style={{ marginBottom: 40 }} />

        <Form form={form} layout="vertical" style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* Step 1: Scan Card */}
          {currentStep === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <ScanOutlined style={{ fontSize: '80px', color: '#1890ff', marginBottom: 24 }} />
              <Title level={3}>Scan NFC Card</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
                Place the NFC card near the reader or manually enter the UID
              </Text>

              <Form.Item
                name="uid"
                rules={[{ required: true, message: 'Please enter card UID' }]}
              >
                <Input
                  size="large"
                  placeholder="04EAB38956E78F"
                  prefix={<CreditCardOutlined />}
                  maxLength={14}
                />
              </Form.Item>

              <Button
                type="primary"
                size="large"
                loading={loading}
                icon={<ScanOutlined />}
                onClick={() => form.validateFields(['uid']).then(handleCardScan)}
                style={{ width: '100%', height: 50, fontSize: 16 }}
              >
                Scan Card
              </Button>

              <Divider />

              <Text type="secondary">
                <strong>Demo UIDs:</strong> 04NEW12345678A, 04NEW87654321B, 04NEW99887766C
              </Text>
            </div>
          )}

          {/* Step 2: Select Customer */}
          {currentStep === 1 && (
            <div style={{ padding: '40px 0' }}>
              <UserOutlined style={{ fontSize: '80px', color: '#52c41a', display: 'block', textAlign: 'center', marginBottom: 24 }} />
              <Title level={3} style={{ textAlign: 'center' }}>Select Customer</Title>
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
                Choose the customer to assign this card to
              </Text>

              <Form.Item
                name="customer_id"
                label="Customer"
                rules={[{ required: true, message: 'Please select a customer' }]}
              >
                <Select
                  size="large"
                  placeholder="Select customer"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as string).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {customers.map((customer) => (
                    <Option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name} - {customer.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Button
                    size="large"
                    block
                    onClick={() => setCurrentStep(0)}
                  >
                    Back
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => form.validateFields(['customer_id']).then(handleCustomerSelect)}
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 3: Set PIN and Initial Balance */}
          {currentStep === 2 && (
            <div style={{ padding: '40px 0' }}>
              <LockOutlined style={{ fontSize: '80px', color: '#722ed1', display: 'block', textAlign: 'center', marginBottom: 24 }} />
              <Title level={3} style={{ textAlign: 'center' }}>Set PIN & Initial Balance</Title>
              <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 32 }}>
                Create a 4-digit PIN and set initial balance for the card
              </Text>

              <Form.Item
                name="pin"
                label="4-Digit PIN"
                rules={[
                  { required: true, message: 'Please enter a PIN' },
                  { len: 4, message: 'PIN must be exactly 4 digits' },
                  { pattern: /^\d{4}$/, message: 'PIN must contain only numbers' },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="1234"
                  maxLength={4}
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="pin_confirm"
                label="Confirm PIN"
                dependencies={['pin']}
                rules={[
                  { required: true, message: 'Please confirm the PIN' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('pin') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('PINs do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="1234"
                  maxLength={4}
                  prefix={<LockOutlined />}
                />
              </Form.Item>

              <Form.Item
                name="initial_balance"
                label="Initial Balance (UGX)"
                initialValue={0}
              >
                <Input
                  size="large"
                  type="number"
                  placeholder="0"
                  prefix="UGX"
                  min={0}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Button
                    size="large"
                    block
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={loading}
                    onClick={() => form.validateFields().then(handlePinSetup)}
                  >
                    Register Card
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 3 && registeredCard && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircleOutlined style={{ fontSize: '80px', color: '#52c41a', marginBottom: 24 }} />
              <Title level={3}>Card Registered Successfully!</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
                The NFC card has been activated and is ready to use
              </Text>

              <Card style={{ background: '#f0f2f5', marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text type="secondary">Card UID</Text>
                    <br />
                    <Text strong style={{ fontSize: 16 }}>{registeredCard.uid}</Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Status</Text>
                    <br />
                    <Tag color="success" style={{ fontSize: 14, padding: '4px 12px' }}>ACTIVE</Tag>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Customer</Text>
                    <br />
                    <Text strong style={{ fontSize: 16 }}>
                      {customers.find(c => c.id === registeredCard.customer_id)?.first_name}{' '}
                      {customers.find(c => c.id === registeredCard.customer_id)?.last_name}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text type="secondary">Initial Balance</Text>
                    <br />
                    <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                      UGX {parseFloat(registeredCard.balance || '0').toLocaleString()}
                    </Text>
                  </Col>
                </Row>
              </Card>

              <Button
                type="primary"
                size="large"
                onClick={handleNewRegistration}
                style={{ width: '100%', height: 50, fontSize: 16 }}
              >
                Register Another Card
              </Button>
            </div>
          )}
        </Form>
      </Card>

      <Card title="Registration Guidelines" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Title level={5}>1. Scan Card</Title>
            <Text type="secondary">
              Place NFC card near reader or manually enter the 14-character UID
            </Text>
          </Col>
          <Col span={8}>
            <Title level={5}>2. Assign Customer</Title>
            <Text type="secondary">
              Select existing customer or create new customer profile first
            </Text>
          </Col>
          <Col span={8}>
            <Title level={5}>3. Set Security</Title>
            <Text type="secondary">
              Create 4-digit PIN and set initial balance for the card
            </Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
