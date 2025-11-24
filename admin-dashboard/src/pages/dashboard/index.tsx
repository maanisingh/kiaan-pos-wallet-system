import { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table, Tag, Progress } from 'antd';
import {
  DollarOutlined,
  UserOutlined,
  CreditCardOutlined,
  TransactionOutlined,
  RiseOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

export const DashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:4500/api'
      : 'https://kiaan.alexandratechlab.com/api';

    fetch(`${apiUrl}/dashboard/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching stats:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <ThunderboltOutlined style={{ fontSize: 48, color: '#1890ff' }} />
      </motion.div>
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Transaction type pie chart data
  const transactionTypeData = [
    { name: 'Purchases', value: stats.recent_transactions.filter((t: any) => t.transaction_type === 'purchase').length },
    { name: 'Top-ups', value: stats.recent_transactions.filter((t: any) => t.transaction_type === 'topup').length },
  ];

  const columns = [
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
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
      render: (amount: number) => `UGX ${amount.toLocaleString()}`,
    },
    {
      title: 'Time',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('MMM D, HH:mm'),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>
          <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
          Dashboard Overview
        </h1>
      </motion.div>

      {/* Statistics Cards with Animations */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #3f8600' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Total Customers</span>}
                value={stats.statistics.total_customers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f8600', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} duration={2} />}
              />
              <Progress percent={100} strokeColor="#3f8600" showInfo={false} size="small" style={{ marginTop: 8 }} />
            </Card>
          </motion.div>
        </Col>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #1890ff' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Active Cards</span>}
                value={stats.statistics.total_active_cards}
                prefix={<CreditCardOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} duration={2} />}
              />
              <Progress percent={85} strokeColor="#1890ff" showInfo={false} size="small" style={{ marginTop: 8 }} />
            </Card>
          </motion.div>
        </Col>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #cf1322' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Today's Transactions</span>}
                value={stats.statistics.todays_transactions}
                prefix={<TransactionOutlined />}
                valueStyle={{ color: '#cf1322', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} duration={2} />}
              />
              <Progress percent={60} strokeColor="#cf1322" showInfo={false} size="small" style={{ marginTop: 8 }} />
            </Card>
          </motion.div>
        </Col>
        <Col span={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #722ed1' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Today's Revenue</span>}
                value={parseFloat(stats.statistics.todays_revenue)}
                prefix="UGX"
                suffix={<RiseOutlined />}
                valueStyle={{ color: '#722ed1', fontSize: 28 }}
                formatter={(value) => <CountUp end={value as number} separator="," duration={2.5} />}
              />
              <Progress percent={75} strokeColor="#722ed1" showInfo={false} size="small" style={{ marginTop: 8 }} />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Card hoverable style={{ borderTop: '3px solid #389e0d' }}>
              <Statistic
                title={<span style={{ fontWeight: 600 }}>Total Card Balance</span>}
                value={parseFloat(stats.statistics.total_card_balance)}
                prefix="UGX"
                valueStyle={{ color: '#389e0d', fontSize: 24 }}
                formatter={(value) => <CountUp end={value as number} separator="," duration={2.5} />}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: '#888', fontWeight: 500 }}>
                💰 Available in system
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Card title={<span style={{ fontSize: 18, fontWeight: 600 }}>📈 7-Day Revenue Trend</span>} hoverable>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.daily_revenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (UGX)" />
                  <Area type="monotone" dataKey="transaction_count" stroke="#82ca9d" fillOpacity={1} fill="url(#colorTransactions)" name="Transactions" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
        <Col span={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Card title={<span style={{ fontSize: 18, fontWeight: 600 }}>📊 Transaction Types</span>} hoverable>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Card title={<span style={{ fontSize: 18, fontWeight: 600 }}>⚡ Recent Transactions</span>} hoverable>
          <Table
            dataSource={stats.recent_transactions}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
        </Card>
      </motion.div>
    </div>
  );
};
