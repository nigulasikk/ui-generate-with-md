# Table Component

## Overview
The Table component displays data in a tabular format with customizable columns and rows. It supports sorting, filtering, and pagination.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| data | Array<Object> | [] | Array of data objects to display in the table |
| columns | Array<ColumnConfig> | [] | Configuration for table columns |
| pagination | boolean | true | Whether to enable pagination |
| pageSize | number | 10 | Number of rows per page |
| sortable | boolean | true | Whether columns can be sorted |
| loading | boolean | false | Shows loading state when true |
| emptyText | string | 'No data' | Text to display when table is empty |
| rowKey | string | 'id' | Unique identifier field in data objects |
| onRowClick | function | - | Callback when a row is clicked |
| onSort | function | - | Callback when sorting changes |
| onPageChange | function | - | Callback when page changes |

## Column Configuration

```typescript
interface ColumnConfig {
  title: string;          // Column header text
  dataIndex: string;      // Field in data object to display
  key?: string;           // Unique identifier for column
  width?: number | string; // Column width
  render?: (text: any, record: any, index: number) => React.ReactNode; // Custom render function
  sorter?: boolean | ((a: any, b: any) => number); // Custom sort function
  filters?: Array<{text: string, value: any}>; // Filter options
  onFilter?: (value: any, record: any) => boolean; // Custom filter function
  align?: 'left' | 'center' | 'right'; // Text alignment
}
```

## Basic Usage

```jsx
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: true
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  }
];

const data = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' }
];

function App() {
  return <Table columns={columns} data={data} />;
}
```

## With Pagination

```jsx
<Table 
  columns={columns} 
  data={data} 
  pagination={true}
  pageSize={5}
  onPageChange={(page) => console.log('Page changed to', page)}
/>
```

## With Custom Rendering

```jsx
const columns = [
  // ... other columns
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div>
        <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
        <Button type="link" danger onClick={() => handleDelete(record)}>Delete</Button>
      </div>
    )
  }
];
```

## With Sorting and Filtering

```jsx
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    filters: [
      { text: 'John', value: 'John' },
      { text: 'Jim', value: 'Jim' }
    ],
    onFilter: (value, record) => record.name.indexOf(value) === 0
  }
  // ... other columns
];
```
