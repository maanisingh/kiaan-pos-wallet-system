import { useList, useNavigation } from '@refinedev/core';
import { List, Table, Space, Button, Tag } from 'antd';
import { EyeOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export const CustomerList = () => {
  const { data, isLoading } = useList({
    resource: 'customers',
  });

  const { show } = useNavigation();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Space>
          <strong>{name}</strong>
          <Tag color="blue">{record.city || 'N/A'}</Tag>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined />
            {record.phone}
          </Space>
          {record.email && (
            <Space>
              <MailOutlined />
              {record.email}
            </Space>
          )}
        </Space>
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
      title: 'Joined',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => show('customers', record.id)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <List
      title="Customers"
      canCreate={false}
    >
      <Table
        dataSource={data?.data}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Total ${total} customers`,
        }}
      />
    </List>
  );
};
