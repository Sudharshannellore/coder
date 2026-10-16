import type { SqlTable } from '@/types'

export const sqlTables: SqlTable[] = [
  {
    name: 'employees',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'department', type: 'VARCHAR' },
      { name: 'salary', type: 'DECIMAL' },
    ],
    rows: [
      { id: 1, name: 'Alice Chen', department: 'Engineering', salary: 112000 },
      { id: 2, name: 'Brian Kim', department: 'Engineering', salary: 98000 },
      { id: 3, name: 'Carla Diaz', department: 'Sales', salary: 76000 },
      { id: 4, name: 'Derek Osei', department: 'Sales', salary: 81000 },
      { id: 5, name: 'Elena Novak', department: 'Marketing', salary: 72000 },
    ],
  },
  {
    name: 'users',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'email', type: 'VARCHAR' },
      { name: 'created_at', type: 'DATE' },
    ],
    rows: [
      { id: 1, email: 'ava@codequest.dev', created_at: '2026-01-14' },
      { id: 2, email: 'liam@codequest.dev', created_at: '2026-02-02' },
      { id: 3, email: 'noah@codequest.dev', created_at: '2026-03-21' },
    ],
  },
  {
    name: 'orders',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'user_id', type: 'INT' },
      { name: 'product_id', type: 'INT' },
      { name: 'total', type: 'DECIMAL' },
    ],
    rows: [
      { id: 1, user_id: 1, product_id: 2, total: 49.99 },
      { id: 2, user_id: 2, product_id: 1, total: 19.99 },
      { id: 3, user_id: 1, product_id: 3, total: 99.0 },
    ],
  },
  {
    name: 'products',
    columns: [
      { name: 'id', type: 'INT' },
      { name: 'name', type: 'VARCHAR' },
      { name: 'price', type: 'DECIMAL' },
    ],
    rows: [
      { id: 1, name: 'CodeQuest Pro', price: 19.99 },
      { id: 2, name: 'CodeQuest Team', price: 49.99 },
      { id: 3, name: 'CodeQuest Lifetime', price: 99.0 },
    ],
  },
]
