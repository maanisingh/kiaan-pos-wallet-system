import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Show } from '@refinedev/antd';
import { Card, Col, Row, Statistic, Table, Tag, Descriptions, Typography, Alert } from 'antd';
import {
  DollarOutlined,
  TransactionOutlined,
  ClockCircleOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;

export const CardShow = () => {
  const { id } = useParams();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4500/api/cards/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setCard(data.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const transactionColumns = [
    {
      title: 'Reference',
      dataIndex: 'reference_number',
      key: 'reference_number',
      render: (ref: string) => <code style={{ fontSize: 11 }}>{ref}</code>,
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
      title: 'Balance Before',
      dataIndex: 'balance_before',
      key: 'balance_before',
      render: (balance: number) => `UGX ${parseFloat(balance).toLocaleString()}`,
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
      render: (date: string) => dayjs(date).format('MMM D, HH:mm'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <Show isLoading={loading} title={`Card: ${card?.card_uid}`}>
      {/* Card Information */}
      {card?.blocked_at && (
        <Alert
          message="Card Blocked"
          description={`This card was blocked on ${dayjs(card.blocked_at).format('MMMM D, YYYY HH:mm')}. Reason: ${card.blocked_reason || 'N/A'}`}
          type="error"
          icon={<WarningOutlined />}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card style={{ marginBottom: 16 }}>
        <Descriptions title="Card Information" bordered column={2}>
          <Descriptions.Item label="Card UID" span={2}>
            <code style={{ fontSize: 14, fontWeight: 'bold' }}>{card?.card_uid}</code>
          </Descriptions.Item>
          <Descriptions.Item label={<><UserOutlined /> Customer</>}>
            {card?.customer_name || 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Currency">
            {card?.currency}
          </Descriptions.Item>
          <Descriptions.Item label="Current Balance">
            <Tag color="green" style={{ fontSize: 16 }}>
              UGX {parseFloat(card?.balance || 0).toLocaleString()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={card?.status === 'active' ? 'green' : 'red'}>
              {card?.status?.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={<><ClockCircleOutlined /> Last Used</>}>
            {card?.last_used_at ? dayjs(card.last_used_at).format('MMMM D, YYYY HH:mm') : 'Never'}
          </Descriptions.Item>
          <Descriptions.Item label="Issued On">
            {dayjs(card?.issued_at).format('MMMM D, YYYY')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={parseFloat(card?.statistics?.total_spent || 0).toLocaleString()}
              prefix="UGX"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Top-ups"
              value={parseFloat(card?.statistics?.total_topup || 0).toLocaleString()}
              prefix="UGX"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Transactions"
              value={card?.statistics?.total_transactions || 0}
              prefix={<TransactionOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Transaction History */}
      <Card title="Transaction History">
        <Table
          dataSource={card?.transactions || []}
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
