import React, { useState } from 'react';
import { Plus, Edit, History, Sliders, Eye, Search } from 'lucide-react';
import DataTable from '../ui/DataTable';
import { faker } from '@faker-js/faker';

const InventoryMaster = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'card'

  const products = Array.from({ length: 50 }, (_, index) => {
    const available = faker.number.int({ min: 0, max: 500 });
    const blocked = faker.number.int({ min: 0, max: 50 });
    const allocated = faker.number.int({ min: 0, max: 100 });
    const reorderLevel = faker.number.int({ min: 10, max: 50 });

    return {
      id: `SKU-${String(index + 1).padStart(4, '0')}`,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      category: faker.helpers.arrayElement(['Steel Products', 'Cement & Concrete', 'Electrical', 'Plumbing', 'Hardware']),
      location: `WH-${faker.helpers.arrayElement(['A', 'B', 'C'])}, Rack ${faker.number.int({ min: 1, max: 20 })}, Shelf ${faker.number.int({ min: 1, max: 5 })}`,
      availableQty: available,
      blockedQty: blocked,
      allocatedQty: allocated,
      totalQty: available + blocked + allocated,
      reorderLevel,
      unitPrice: faker.number.float({ min: 5, max: 500, multipleOf: 0.01 }),
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'INR']),
      supplier: faker.company.name(),
      lastUpdated: faker.date.recent({ days: 30 }).toLocaleDateString(),
      status: available <= reorderLevel ? 'Low Stock' : available === 0 ? 'Out of Stock' : 'In Stock'
    };
  });

  const handleViewProduct = (product) => {
    alert(`Viewing product: ${product.name}\nSKU: ${product.id}\nAvailable: ${product.availableQty}`);
  };

  const handleEditProduct = (product) => {
    alert(`Edit product: ${product.name}`);
  };

  const handleAdjustStock = (product) => {
    alert(`Adjust stock for: ${product.name}`);
  };

  const handleViewHistory = (product) => {
    alert(`View history for: ${product.name}`);
  };

  const getStatusBadge = (status) => {
    const colors = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-yellow-100 text-yellow-800',
      'Out of Stock': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const columns = [
    {
      key: 'id',
      label: 'SKU',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.category}</div>
        </div>
      )
    },
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{row.description}</div>
        </div>
      )
    },
    { key: 'location', label: 'Location', sortable: true },
    {
      key: 'availableQty',
      label: 'Available',
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="font-medium text-gray-900">{value.toLocaleString()}</div>
          <div className="text-xs text-gray-500">of {row.totalQty.toLocaleString()}</div>
        </div>
      )
    },
    {
      key: 'blockedQty',
      label: 'Blocked',
      sortable: true,
      render: (value) => (
        <span className={`font-medium ${value > 0 ? 'text-red-600' : 'text-gray-900'}`}>
          {value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'allocatedQty',
      label: 'Allocated',
      sortable: true,
      render: (value) => (
        <span className={`font-medium ${value > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
          {value.toLocaleString()}
        </span>
      )
    },
    {
      key: 'reorderLevel',
      label: 'Reorder Level',
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="font-medium">{value.toLocaleString()}</div>
          {row.availableQty <= value && (
            <div className="text-xs text-red-600 font-medium">Below Level!</div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-1">
          <button
            onClick={() => handleViewProduct(row)}
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditProduct(row)}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
            title="Edit Product"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleAdjustStock(row)}
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
            title="Adjust Stock"
          >
            <Sliders className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewHistory(row)}
            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md"
            title="View History"
          >
            <History className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Master</h1>
          <p className="text-gray-600">View and manage all product stock levels.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </button>
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">T</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">S</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-green-600">{products.filter(p => p.status === 'In Stock').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">L</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600">{products.filter(p => p.status === 'Low Stock').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-semibold text-sm">O</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{products.filter(p => p.status === 'Out of Stock').length}</p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products}
        searchable={true}
        filterable={true}
        exportable={true}
        selectable={false}
      />
    </div>
  );
};

export default InventoryMaster;
