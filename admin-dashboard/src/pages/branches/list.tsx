import { List, useTable, EditButton, ShowButton, DeleteButton } from '@refinedev/antd';
import { Table, Space, Tag, Card, Statistic, Row, Col } from 'antd';
import { ShopOutlined, UserOutlined, CreditCardOutlined, DollarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export const BranchesList = () => {
  const { tableProps } = useTable({
    resource: 'branches',
    syncWithLocation: true,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Branch Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <strong style={{ fontSize: 16 }}>
          <ShopOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {name}
        </strong>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <span>📍 {location}</span>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'contact_number',
      key: 'contact_number',
      render: (contact: string) => (
        <span>📞 {contact || 'N/A'}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status?.toUpperCase() || 'ACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <ShowButton hideText size="small" recordItemId={record.id} />
          <EditButton hideText size="small" recordItemId={record.id} />
        </Space>
      ),
    },
  ];

  // Mock statistics - in real app, fetch from API
  const stats = {
    totalBranches: tableProps.dataSource?.length || 1,
    activeBranches: 1,
    totalCustomers: 10,
    totalRevenue: 1245000,
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
          <ShopOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          Branch Management
        </h1>
      </motion.div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #1890ff' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Total Branches</span>}
                value={stats.totalBranches}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} duration={2} />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #52c41a' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Active Branches</span>}
                value={stats.activeBranches}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} duration={2} />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #722ed1' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Total Customers</span>}
                value={stats.totalCustomers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} duration={2} />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #fa8c16' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Total Revenue</span>}
                value={stats.totalRevenue}
                prefix="UGX"
                valueStyle={{ color: '#fa8c16', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} separator="," duration={2.5} />}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Branches Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <List>
          <Table
            {...tableProps}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} branches`,
            }}
          />
        </List>
      </motion.div>
    </div>
  );
};
