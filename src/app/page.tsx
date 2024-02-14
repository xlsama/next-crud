'use client'

import { PlusOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components'
import { Button, Form, message } from 'antd'
import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'

type UserInfo = {
  id: number
  nickname: string
  hobbies?: string[]
  birthday: string
}

const columns: ProColumns<UserInfo>[] = [
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
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id)
        }}
      >
        编辑
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
]

export default function Home() {
  const [selectedRow, setSelectedRow] = useState<any>()
  const [form] = Form.useForm()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setToal] = useState(100)

  const { data, loading } = useRequest<UserInfo[], any>(async () => {
    const res = await fetch('/api/user')
    const data = await res.json()
    return data
  })

  return (
    <>
      <ProTable<UserInfo>
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
        dateFormatter="string"
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
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setSelectedRow(undefined),
        }}
        onFinish={async values => {
          console.log('🚀 ~ Home ~ values:', values)
          message.success('提交成功')
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
          placeholder="请选择生日"
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
