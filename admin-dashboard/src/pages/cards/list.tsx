import { useList, useNavigation } from '@refinedev/core';
import { List, Table, Space, Button, Tag } from 'antd';
import { EyeOutlined, CreditCardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export const CardList = () => {
  const { data, isLoading } = useList({
    resource: 'cards',
  });

  const { show } = useNavigation();

  const columns = [
    {
      title: 'Card UID',
      dataIndex: 'card_uid',
      key: 'card_uid',
      render: (uid: string) => (
        <Space>
          <CreditCardOutlined />
          <code>{uid}</code>
        </Space>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (name: string) => name || 'N/A',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => (
        <Tag color={balance > 10000 ? 'green' : balance > 5000 ? 'orange' : 'red'}>
          UGX {parseFloat(balance).toLocaleString()}
        </Tag>
      ),
      sorter: (a: any, b: any) => a.balance - b.balance,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'blocked' ? 'red' : 'default'}>
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
    {
      title: 'Issued',
      dataIndex: 'issued_at',
      key: 'issued_at',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => show('cards', record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <List
      title="NFC Cards"
      canCreate={false}
    >
      <Table
        dataSource={data?.data}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} cards`,
        }}
      />
    </List>
  );
};
