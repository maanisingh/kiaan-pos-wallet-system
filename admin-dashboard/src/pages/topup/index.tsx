import { useState } from 'react';
import { Card, Form, Input, Button, Select, InputNumber, message, Typography, Divider, Row, Col, Radio, Space, Tag } from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  PhoneOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export const TopUpPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'confirm' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'airtel' | 'cash'>('mtn');
  const [cardInfo, setCardInfo] = useState<any>(null);
  const [topupData, setTopupData] = useState<any>(null);

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4500/api'
    : 'https://kiaan.alexandratechlab.com/api';

  const handleCardSearch = async (values: { cardUid: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cards?uid=${values.cardUid}`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setCardInfo(data.data[0]);
        setStep('details');
        message.success('Card found! Enter top-up details.');
      } else {
        message.error('Card not found. Please check the UID.');
      }
    } catch (error) {
      message.error('Error finding card.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailsSubmit = (values: any) => {
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();

      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_uid: cardInfo.uid,
          customer_id: cardInfo.customer_id,
          transaction_type: 'topup',
          amount: values.amount,
          payment_method: paymentMethod,
          payment_provider: paymentMethod === 'cash' ? 'cash' : paymentMethod.toUpperCase(),
          branch_id: '96dab113-cead-47d0-8878-31a15ac94bc9',
          metadata: {
            phone_number: values.phoneNumber,
            reference: `TOPUP-${Date.now()}`,
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTopupData(data.data);
        setStep('success');
        message.success('Top-up successful!');
      } else {
        message.error(data.error || 'Top-up failed.');
      }
    } catch (error) {
      message.error('Error processing top-up.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTopup = () => {
    setStep('select');
    setCardInfo(null);
    setTopupData(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <WalletOutlined /> Card Top-Up
      </Title>
      <Text type="secondary">Add money to customer cards via Mobile Money or Cash</Text>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              minHeight: '500px',
            }}
            bordered={false}
          >
            {/* Step 1: Select Card */}
            {step === 'select' && (
              <div style={{ padding: '40px 20px' }}>
                <Title level={3} style={{ color: 'white' }}>Find Customer Card</Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 32 }}>
                  Enter the NFC card UID to begin top-up
                </Text>

                <Form form={form} onFinish={handleCardSearch} layout="vertical">
                  <Form.Item
                    name="cardUid"
                    rules={[{ required: true, message: 'Please enter card UID' }]}
                  >
                    <Input
                      size="large"
                      placeholder="04EAB38956E78F"
                      prefix={<CreditCardOutlined />}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    style={{
                      background: 'white',
                      color: '#f5576c',
                      border: 'none',
                      fontWeight: 'bold',
                      height: '48px',
                      width: '100%',
                    }}
                  >
                    Find Card
                  </Button>
                </Form>
              </div>
            )}

            {/* Step 2: Enter Details */}
            {step === 'details' && cardInfo && (
              <div style={{ padding: '40px 20px' }}>
                <Title level={3} style={{ color: 'white' }}>Top-Up Details</Title>

                <Card style={{ marginBottom: 24, background: 'rgba(255,255,255,0.15)', border: 'none' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Customer</Text>
                      <Title level={4} style={{ color: 'white', marginTop: 4 }}>
                        {cardInfo.customer_name}
                      </Title>
                    </Col>
                    <Col span={12}>
                      <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Current Balance</Text>
                      <Title level={4} style={{ color: '#52c41a', marginTop: 4 }}>
                        UGX {parseFloat(cardInfo.balance).toLocaleString()}
                      </Title>
                    </Col>
                  </Row>
                </Card>

                <Form form={form} onFinish={handleDetailsSubmit} layout="vertical">
                  <Form.Item label={<Text style={{ color: 'white' }}>Payment Method</Text>}>
                    <Radio.Group
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      size="large"
                      buttonStyle="solid"
                    >
                      <Radio.Button value="mtn">
                        <PhoneOutlined /> MTN Mobile Money
                      </Radio.Button>
                      <Radio.Button value="airtel">
                        <PhoneOutlined /> Airtel Money
                      </Radio.Button>
                      <Radio.Button value="cash">
                        <DollarOutlined /> Cash
                      </Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
                    <Form.Item
                      name="phoneNumber"
                      label={<Text style={{ color: 'white' }}>Phone Number</Text>}
                      rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                      <Input
                        size="large"
                        placeholder="256700000000"
                        prefix={<PhoneOutlined />}
                      />
                    </Form.Item>
                  )}

                  <Form.Item
                    name="amount"
                    label={<Text style={{ color: 'white' }}>Top-Up Amount (UGX)</Text>}
                    rules={[
                      { required: true, message: 'Please enter amount' },
                      {
                        validator: (_, value) => {
                          if (value && value < 1000) {
                            return Promise.reject('Minimum top-up is UGX 1,000');
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber
                      size="large"
                      prefix="UGX"
                      style={{ width: '100%' }}
                      min={1000}
                      step={1000}
                      placeholder="10000"
                    />
                  </Form.Item>

                  <Space>
                    <Button onClick={() => setStep('select')} size="large">
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      style={{
                        background: 'white',
                        color: '#f5576c',
                        border: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      Continue
                    </Button>
                  </Space>
                </Form>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 'confirm' && (
              <div style={{ padding: '40px 20px' }}>
                <Title level={3} style={{ color: 'white' }}>Confirm Top-Up</Title>

                <Card style={{ background: 'white', marginBottom: 24 }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Text type="secondary">Customer</Text>
                      <br />
                      <Text strong>{cardInfo.customer_name}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Current Balance</Text>
                      <br />
                      <Text strong>UGX {parseFloat(cardInfo.balance).toLocaleString()}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Top-Up Amount</Text>
                      <br />
                      <Text strong style={{ color: '#52c41a', fontSize: '20px' }}>
                        UGX {form.getFieldValue('amount')?.toLocaleString()}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">New Balance</Text>
                      <br />
                      <Text strong style={{ fontSize: '20px' }}>
                        UGX {(parseFloat(cardInfo.balance) + form.getFieldValue('amount')).toLocaleString()}
                      </Text>
                    </Col>
                    <Col span={24}>
                      <Text type="secondary">Payment Method</Text>
                      <br />
                      <Tag color={paymentMethod === 'mtn' ? 'gold' : paymentMethod === 'airtel' ? 'red' : 'green'}>
                        {paymentMethod === 'mtn' && 'MTN Mobile Money'}
                        {paymentMethod === 'airtel' && 'Airtel Money'}
                        {paymentMethod === 'cash' && 'Cash Payment'}
                      </Tag>
                    </Col>
                    {form.getFieldValue('phoneNumber') && (
                      <Col span={24}>
                        <Text type="secondary">Phone Number</Text>
                        <br />
                        <Text strong>{form.getFieldValue('phoneNumber')}</Text>
                      </Col>
                    )}
                  </Row>
                </Card>

                <Space>
                  <Button onClick={() => setStep('details')} size="large">
                    Back
                  </Button>
                  <Button
                    type="primary"
                    onClick={handleConfirm}
                    size="large"
                    loading={loading}
                    icon={<CheckCircleOutlined />}
                    style={{
                      background: '#52c41a',
                      border: 'none',
                      fontWeight: 'bold',
                      height: '48px',
                    }}
                  >
                    Confirm Top-Up
                  </Button>
                </Space>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && topupData && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: 24 }} />
                <Title level={3} style={{ color: 'white' }}>Top-Up Successful!</Title>

                <Card style={{ marginTop: 24, background: 'white' }}>
                  <Title level={4}>Transaction Confirmation</Title>
                  <Divider />
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Text type="secondary">Reference Number</Text>
                      <br />
                      <Text strong>{topupData.reference_number}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Customer</Text>
                      <br />
                      <Text strong>{cardInfo.customer_name}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Date & Time</Text>
                      <br />
                      <Text strong>{dayjs(topupData.created_at).format('MMM D, YYYY HH:mm')}</Text>
                    </Col>
                    <Col span={24}>
                      <Divider />
                      <Text type="secondary">Amount Added</Text>
                      <Title level={2} style={{ color: '#52c41a', margin: '8px 0' }}>
                        UGX {parseFloat(topupData.amount).toLocaleString()}
                      </Title>
                    </Col>
                    <Col span={24}>
                      <Text type="secondary">New Balance</Text>
                      <br />
                      <Text strong style={{ fontSize: '24px' }}>
                        UGX {parseFloat(topupData.balance_after).toLocaleString()}
                      </Text>
                    </Col>
                  </Row>
                </Card>

                <Button
                  type="primary"
                  onClick={handleNewTopup}
                  size="large"
                  style={{
                    marginTop: 24,
                    background: 'white',
                    color: '#f5576c',
                    border: 'none',
                    fontWeight: 'bold',
                    width: '100%',
                  }}
                >
                  New Top-Up
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Quick Top-Up Amounts">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {[5000, 10000, 20000, 50000, 100000].map((amount) => (
                <Button
                  key={amount}
                  size="large"
                  block
                  style={{ height: '60px', fontSize: '18px' }}
                  onClick={() => {
                    form.setFieldsValue({ amount });
                  }}
                >
                  UGX {amount.toLocaleString()}
                </Button>
              ))}
            </Space>
          </Card>

          <Card title="Payment Methods" style={{ marginTop: 24 }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card size="small" style={{ background: '#FFC107', border: 'none' }}>
                <MobileOutlined style={{ fontSize: '24px', marginRight: 8 }} />
                <strong>MTN Mobile Money</strong>
                <br />
                <Text type="secondary">Instant top-up via MTN</Text>
              </Card>
              <Card size="small" style={{ background: '#f44336', border: 'none', color: 'white' }}>
                <MobileOutlined style={{ fontSize: '24px', marginRight: 8 }} />
                <strong>Airtel Money</strong>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Instant top-up via Airtel</Text>
              </Card>
              <Card size="small" style={{ background: '#4CAF50', border: 'none', color: 'white' }}>
                <DollarOutlined style={{ fontSize: '24px', marginRight: 8 }} />
                <strong>Cash Payment</strong>
                <br />
                <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Physical cash deposit</Text>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
