import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, MoreHorizontal, Search, RotateCcw, Download } from 'lucide-react';
import { mockBudgetsData } from '../../data/mockBudgets';
import QuoteSentModal from './QuoteSentModal';

const BudgetList = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState(mockBudgetsData);

  // State for filters
  const [filters, setFilters] = useState({
    employee: 'ALL',
    opportunity: '- ALL -',
    createDateFrom: '',
    createDateTill: '',
    search: ''
  });

  const [showEntries, setShowEntries] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);


  // Mock employees data
  const employees = [
    'ALL',
    'Lakshmi Kanth Pitchandi',
    'John Anderson',
    'Sarah Johnson',
    'Mike Wilson'
  ];

  // Filter budgets based on current filters
  const filteredBudgets = budgets.filter(budget => {
    const matchesEmployee = filters.employee === 'ALL' || budget.employee === filters.employee;
    const matchesSearch = filters.search === '' ||
      budget.budgetId.toLowerCase().includes(filters.search.toLowerCase()) ||
      budget.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
      budget.enquiryId.toLowerCase().includes(filters.search.toLowerCase());

    return matchesEmployee && matchesSearch;
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      employee: 'ALL',
      opportunity: '- ALL -',
      createDateFrom: '',
      createDateTill: '',
      search: ''
    });
  };

  const handleExport = () => {
    console.log('Exporting budget data...');
    // Implementation for export functionality
  };

  const handleSaveQuoteStatus = (updatedData) => {
    setBudgets(prevBudgets =>
      prevBudgets.map(b =>
        b.budgetId === selectedBudget.budgetId
          ? { ...b, quoteSentDate: updatedData.date, quoteSentStatus: updatedData.status }
          : b
      )
    );
    setIsQuoteModalOpen(false);
    setSelectedBudget(null);
  };


  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusYesNoBadge = (status) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${status === 'YES' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const handleMenuAction = (budgetId, action) => {
    // Placeholder: would update backend/state. Keeping console logs for now.
    console.log(`Action '${action}' on budget ${budgetId}`);
    // Close menu after action
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">BUDGET LIST</h1>
        <button
          onClick={() => navigate('/budget/new')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Budget
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Employee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee:</label>
            <select
              value={filters.employee}
              onChange={(e) => handleFilterChange('employee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            >
              {employees.map(emp => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </div>

          {/* Enquiry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry:</label>
            <select
              value={filters.opportunity}
              onChange={(e) => handleFilterChange('opportunity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            >
              <option value="- ALL -">- ALL -</option>
              <option value="High Priority">High Priority</option>
              <option value="Medium Priority">Medium Priority</option>
              <option value="Low Priority">Low Priority</option>
            </select>
          </div>

          {/* Create Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Date From:</label>
            <input
              type="date"
              value={filters.createDateFrom}
              onChange={(e) => handleFilterChange('createDateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="MM/DD/YYYY"
            />
          </div>

          {/* Create Date Till */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Date Till:</label>
            <input
              type="date"
              value={filters.createDateTill}
              onChange={(e) => handleFilterChange('createDateTill', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="MM/DD/YYYY"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </button>
          <button
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Table Controls */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={showEntries}
                  onChange={(e) => setShowEntries(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">Entries</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Search:</span>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9 pr-4 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENQUIRY ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLOSURE DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET VALUE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUOTE SENT DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUOTE SENT STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBudgets.slice(0, showEntries).map((budget) => (
                <tr key={budget.budgetId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <button
                      onClick={() => navigate(`/budget/${encodeURIComponent(budget.budgetId)}/view`)}
                      className="hover:underline"
                    >
                      {budget.budgetId}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.enquiryId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.closureDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.budgetDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.budgetValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.quoteSentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(budget.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusYesNoBadge(budget.quoteSentStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/budget/${encodeURIComponent(budget.budgetId)}/view`)}
                        className="text-gray-400 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/budget/${encodeURIComponent(budget.budgetId)}/edit`)}
                        className="text-gray-400 hover:text-green-600"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === budget.budgetId ? null : budget.budgetId)}
                        className="text-gray-400 hover:text-gray-600"
                        title="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                    {openMenuId === budget.budgetId && (
                      <div className="absolute right-0 mt-2 w-40 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 text-sm">
                          <button onClick={() => { setOpenMenuId(null); navigate(`/budget/${encodeURIComponent(budget.budgetId)}/edit`, { state: { isRevision: true } }); }} className="block w-full text-left px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">Revise</button>
                          <button onClick={() => { setSelectedBudget(budget); setIsQuoteModalOpen(true); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium">Quote Sent</button>
                          <button onClick={() => handleMenuAction(budget.budgetId, 'Download')} className="block w-full text-left px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium">Download</button>
                          <button onClick={() => handleMenuAction(budget.budgetId, 'Won')} className="block w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium">Won</button>
                          <button onClick={() => handleMenuAction(budget.budgetId, 'Lose')} className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium">Lose</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-700">
          Showing 1 to {Math.min(showEntries, filteredBudgets.length)} of {filteredBudgets.length} entries
        </div>
      </div>
      {isQuoteModalOpen && selectedBudget && (
        <QuoteSentModal
          budget={selectedBudget}
          onClose={() => setIsQuoteModalOpen(false)}
          onSave={handleSaveQuoteStatus}
        />
      )}
    </div>
  );
};

export default BudgetList;
