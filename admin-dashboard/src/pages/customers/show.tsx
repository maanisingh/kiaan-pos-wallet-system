import { useShow } from '@refinedev/core';
import { Show } from '@refinedev/antd';
import { Card, Col, Row, Statistic, Table, Tag, Descriptions, Typography } from 'antd';
import {
  DollarOutlined,
  CreditCardOutlined,
  TransactionOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

export const CustomerShow = () => {
  const { queryResult } = useShow({
    resource: 'customers',
  });

  const { data, isLoading } = queryResult;
  const customer = data?.data;

  if (isLoading) return <div>Loading...</div>;

  const cardColumns = [
    {
      title: 'Card UID',
      dataIndex: 'card_uid',
      key: 'card_uid',
      render: (uid: string) => <code>{uid}</code>,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <Tag color="green">UGX {parseFloat(balance).toLocaleString()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Used',
      dataIndex: 'last_used_at',
      key: 'last_used_at',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY HH:mm') : 'Never',
    },
  ];

  const transactionColumns = [
    {
      title: 'Reference',
      dataIndex: 'reference_number',
      key: 'reference_number',
      render: (ref: string) => <code style={{ fontSize: 11 }}>{ref}</code>,
    },
    {
      title: 'Card',
      dataIndex: 'card_uid',
      key: 'card_uid',
      render: (uid: string) => <code style={{ fontSize: 11 }}>{uid?.substring(0, 12)}...</code>,
    },
    {
      title: 'Type',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type: string) => (
        <Tag color={type === 'topup' ? 'green' : type === 'purchase' ? 'blue' : 'orange'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `UGX ${parseFloat(amount).toLocaleString()}`,
    },
    {
      title: 'Balance After',
      dataIndex: 'balance_after',
      key: 'balance_after',
      render: (balance: number) => `UGX ${parseFloat(balance).toLocaleString()}`,
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm'),
    },
  ];

  return (
    <Show isLoading={isLoading} title={`Customer: ${customer?.name}`}>
      {/* Customer Information */}
      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="Customer Information" bordered column={2}>
          <Descriptions.Item label="Name" span={2}>
            <strong>{customer?.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
            {customer?.phone}
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {customer?.email || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label={<><EnvironmentOutlined /> Location</>} span={2}>
            {customer?.city}, {customer?.country}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={customer?.status === 'active' ? 'green' : 'red'}>
              {customer?.status?.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {dayjs(customer?.created_at).format('MMMM D, YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={parseFloat(customer?.statistics?.total_spent || 0).toLocaleString()}
              prefix="UGX"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Top-ups"
              value={parseFloat(customer?.statistics?.total_topup || 0).toLocaleString()}
              prefix="UGX"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={customer?.statistics?.total_transactions || 0}
              prefix={<TransactionOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* NFC Cards */}
      <Card title="NFC Cards" style={{ marginBottom: 16 }}>
        <Table
          dataSource={customer?.cards || []}
          columns={cardColumns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      {/* Recent Transactions */}
      <Card title="Recent Transactions">
        <Table
          dataSource={customer?.recent_transactions || []}
          columns={transactionColumns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} transactions`,
          }}
        />
      </Card>
    </Show>
  );
};
