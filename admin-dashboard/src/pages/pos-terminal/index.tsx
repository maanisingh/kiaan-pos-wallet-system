import { useState } from 'react';
import { Card, Form, Input, Button, Space, InputNumber, message, Typography, Divider, Row, Col, Modal, Statistic } from 'antd';
import {
  CreditCardOutlined,
  DollarOutlined,
  LockOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  ScanOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const POSTerminal = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'scan' | 'amount' | 'pin' | 'receipt'>('scan');
  const [cardInfo, setCardInfo] = useState<any>(null);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [receiptVisible, setReceiptVisible] = useState(false);

  const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:4500/api'
    : 'https://kiaan.alexandratechlab.com/api';

  const handleCardScan = async (values: { cardUid: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/cards?uid=${values.cardUid}`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setCardInfo(data.data[0]);
        setStep('amount');
        message.success('Card found! Enter transaction amount.');
      } else {
        message.error('Card not found. Please check the UID and try again.');
      }
    } catch (error) {
      message.error('Error scanning card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSubmit = (values: { amount: number }) => {
    if (values.amount > parseFloat(cardInfo.balance)) {
      message.error('Insufficient balance!');
      return;
    }
    setStep('pin');
  };

  const handlePinSubmit = async (values: { pin: string }) => {
    setLoading(true);
    try {
      const amount = form.getFieldValue('amount');

      // Process transaction
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_uid: cardInfo.uid,
          customer_id: cardInfo.customer_id,
          transaction_type: 'purchase',
          amount: amount,
          pin: values.pin,
          branch_id: '96dab113-cead-47d0-8878-31a15ac94bc9', // Default branch
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTransactionData(data.data);
        setStep('receipt');
        setReceiptVisible(true);
        message.success('Transaction completed successfully!');
      } else {
        message.error(data.error || 'Transaction failed. Please check PIN and try again.');
      }
    } catch (error) {
      message.error('Error processing transaction.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = () => {
    setStep('scan');
    setCardInfo(null);
    setTransactionData(null);
    setReceiptVisible(false);
    form.resetFields();
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>
        <CreditCardOutlined /> POS Terminal
      </Title>
      <Text type="secondary">Process customer transactions with NFC cards</Text>

      <Card
        style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minHeight: '400px',
        }}
        bordered={false}
      >
        {/* Step 1: Card Scanning */}
        {step === 'scan' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <ScanOutlined style={{ fontSize: '64px', marginBottom: 24 }} />
            <Title level={3} style={{ color: 'white' }}>Scan Customer Card</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 32 }}>
              Enter the NFC card UID to begin transaction
            </Text>

            <Form form={form} onFinish={handleCardScan} layout="vertical">
              <Form.Item
                name="cardUid"
                rules={[{ required: true, message: 'Please enter card UID' }]}
              >
                <Input
                  size="large"
                  placeholder="04EAB38956E78F"
                  prefix={<CreditCardOutlined />}
                  style={{ maxWidth: 400, margin: '0 auto' }}
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<ScanOutlined />}
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  fontWeight: 'bold',
                  height: '48px',
                  padding: '0 48px',
                }}
              >
                Scan Card
              </Button>
            </Form>
          </div>
        )}

        {/* Step 2: Enter Amount */}
        {step === 'amount' && cardInfo && (
          <div style={{ padding: '40px 20px' }}>
            <Title level={3} style={{ color: 'white', textAlign: 'center' }}>Transaction Amount</Title>

            <Card style={{ marginBottom: 24, background: 'rgba(255,255,255,0.15)', border: 'none' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Customer</Text>
                  <Title level={4} style={{ color: 'white', marginTop: 4 }}>
                    {cardInfo.customer_name}
                  </Title>
                </Col>
                <Col span={12}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Available Balance</Text>
                  <Title level={4} style={{ color: '#52c41a', marginTop: 4 }}>
                    UGX {parseFloat(cardInfo.balance).toLocaleString()}
                  </Title>
                </Col>
              </Row>
            </Card>

            <Form form={form} onFinish={handleAmountSubmit} layout="vertical">
              <Form.Item
                name="amount"
                rules={[
                  { required: true, message: 'Please enter amount' },
                  {
                    validator: (_, value) => {
                      if (value && value > parseFloat(cardInfo.balance)) {
                        return Promise.reject('Amount exceeds available balance');
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  size="large"
                  prefix={<DollarOutlined />}
                  placeholder="0.00"
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                />
              </Form.Item>
              <Space>
                <Button onClick={() => setStep('scan')} size="large">
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    background: 'white',
                    color: '#667eea',
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

        {/* Step 3: PIN Verification */}
        {step === 'pin' && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <LockOutlined style={{ fontSize: '64px', marginBottom: 24 }} />
            <Title level={3} style={{ color: 'white' }}>Enter PIN</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: 32 }}>
              Customer must enter their 4-digit PIN to authorize transaction
            </Text>

            <Form form={form} onFinish={handlePinSubmit} layout="vertical">
              <Form.Item
                name="pin"
                rules={[
                  { required: true, message: 'Please enter PIN' },
                  { len: 4, message: 'PIN must be 4 digits' },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="****"
                  maxLength={4}
                  prefix={<LockOutlined />}
                  style={{ maxWidth: 200, margin: '0 auto', textAlign: 'center', fontSize: '24px' }}
                />
              </Form.Item>
              <Space>
                <Button onClick={() => setStep('amount')} size="large">
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                  style={{
                    background: '#52c41a',
                    border: 'none',
                    fontWeight: 'bold',
                    height: '48px',
                    padding: '0 48px',
                  }}
                >
                  Process Transaction
                </Button>
              </Space>
            </Form>
          </div>
        )}

        {/* Step 4: Receipt */}
        {step === 'receipt' && transactionData && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: 24 }} />
            <Title level={3} style={{ color: 'white' }}>Transaction Successful!</Title>

            <Card style={{ marginTop: 24, background: 'white', maxWidth: 500, margin: '24px auto' }}>
              <Title level={4}>Receipt</Title>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text type="secondary">Customer</Text>
                  <br />
                  <Text strong>{cardInfo.customer_name}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Date & Time</Text>
                  <br />
                  <Text strong>{dayjs(transactionData.created_at).format('MMM D, YYYY HH:mm')}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Transaction ID</Text>
                  <br />
                  <Text strong>{transactionData.reference_number}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Card UID</Text>
                  <br />
                  <Text strong>{transactionData.card_uid}</Text>
                </Col>
              </Row>
              <Divider />
              <Statistic
                title="Amount Paid"
                value={parseFloat(transactionData.amount)}
                precision={2}
                prefix="UGX"
                valueStyle={{ color: '#cf1322', fontSize: '32px' }}
              />
              <Divider />
              <Text type="secondary">New Balance: </Text>
              <Text strong style={{ fontSize: '20px', color: '#52c41a' }}>
                UGX {parseFloat(transactionData.balance_after).toLocaleString()}
              </Text>
            </Card>

            <Space style={{ marginTop: 24 }}>
              <Button icon={<PrinterOutlined />} onClick={printReceipt} size="large">
                Print Receipt
              </Button>
              <Button
                type="primary"
                onClick={handleNewTransaction}
                size="large"
                style={{
                  background: 'white',
                  color: '#667eea',
                  border: 'none',
                  fontWeight: 'bold',
                }}
              >
                New Transaction
              </Button>
            </Space>
          </div>
        )}
      </Card>

      <Card style={{ marginTop: 24 }}>
        <Text type="secondary">
          <strong>Demo Card UIDs:</strong> 04EAB38956E78F, 04CF660ADAEFF1, 04639EFFDCD83D
          <br />
          <strong>Demo PIN:</strong> 1234 (for all cards)
        </Text>
      </Card>
    </div>
  );
};
