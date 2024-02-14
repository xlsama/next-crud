'use client'

import { PlusOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components'
import { Button, Form, Space, message } from 'antd'
import { useState } from 'react'
import { useRequest } from 'ahooks'
import { User } from '@prisma/client'

export default function Home() {
  const [selectedRow, setSelectedRow] = useState<any>()
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setToal] = useState(100)

  const { data, run, loading } = useRequest<User[], any>(async () => {
    const res = await fetch('/api/user')
    const data = await res.json()
    return data
  })

  const createUser = async (values: any) => {
    const res = await fetch('/api/user/create', {
      body: JSON.stringify(values),
      method: 'POST',
    })
    await res.json()
    message.success('提交成功')
    setSelectedRow(undefined)
    run()
  }

  const deleteUser = async (id: number) => {
    const res = await fetch('/api/user/delete', {
      body: JSON.stringify({ id }),
      method: 'POST',
    })
    await res.json()
    message.success('删除成功')
    run()
  }

  const columns: ProColumns<User>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
    },
    {
      title: '爱好',
      dataIndex: 'hobbies',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        all: { text: '超长'.repeat(50) },
        running: '跑步',
        swimming: '游泳',
        gaming: '游戏',
      },
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (_, record) => (
        <Space>
          <Button type="text">编辑</Button>
          <Button type="text" onClick={() => deleteUser(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <ProTable<User>
        dataSource={data}
        loading={loading}
        columns={columns}
        cardBordered
        rowKey="id"
        search={{ labelWidth: 'auto' }}
        pagination={{
          onChange: (page, pageSize) => {
            setCurrentPage(page)
            setPageSize(pageSize)
          },
          pageSize,
          total,
        }}
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setSelectedRow({})}
            type="primary"
          >
            新建
          </Button>,
        ]}
      />

      <ModalForm
        title="添加用户"
        open={selectedRow}
        form={form}
        autoFocusFirstInput
        dateFormatter={false}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setSelectedRow(undefined),
        }}
        onFinish={async values => {
          await createUser(values)
          return true
        }}
      >
        <ProFormText
          name="nickname"
          label="昵称"
          placeholder="请输入昵称"
          rules={[{ required: true, message: '请输入昵称' }]}
        />
        <ProFormDatePicker
          name="birthday"
          label="生日"
          placeholder="请选择日期"
        />
        <ProFormSelect
          name="hobbies"
          label="爱好"
          valueEnum={{
            running: '跑步',
            swimming: '游泳',
            gaming: '游戏',
          }}
          placeholder="请选择爱好"
          rules={[{ required: true, message: '请选择爱好' }]}
          mode="multiple"
        />
      </ModalForm>
    </>
  )
}
