import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, Clock, TrendingUp, DollarSign, 
  Users, Package, AlertTriangle, FileText
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const SalesManagerDashboard = () => {
  const stats = [
    {
      name: 'Pending Approvals',
      value: '7',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/approvals'
    },
    {
      name: 'Team Performance',
      value: '92%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/team-performance'
    },
    {
      name: 'Monthly Revenue',
      value: '$45.2K',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/revenue'
    },
    {
      name: 'Block Requests',
      value: '3',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/blocking?status=pending'
    }
  ];

  const pendingApprovals = [
    {
      id: 1,
      type: 'Budget',
      item: 'B-2024-001',
      customer: 'ABC Corp',
      amount: '$12,500',
      submittedBy: 'John Smith',
      submittedAt: '2 hours ago',
      priority: 'High'
    },
    {
      id: 2,
      type: 'FPO',
      item: 'F-2024-003',
      vendor: 'XYZ Supplies',
      amount: '$8,750',
      submittedBy: 'Jane Doe',
      submittedAt: '4 hours ago',
      priority: 'Medium'
    },
    {
      id: 3,
      type: 'Block Request',
      item: 'SO-2024-015',
      customer: 'DEF Ltd',
      quantity: '50 units',
      submittedBy: 'Mike Johnson',
      submittedAt: '6 hours ago',
      priority: 'High'
    }
  ];

  const teamActivity = [
    {
      name: 'John Smith',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff',
      action: 'Submitted budget B-2024-001',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      name: 'Jane Doe',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=10b981&color=fff',
      action: 'Created quotation Q-2024-018',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      name: 'Mike Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
      action: 'Requested inventory block',
      time: '5 hours ago',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
              <Link
                to="/approvals"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {approval.type} {approval.item}
                      </span>
                      <StatusBadge 
                        status={approval.priority === 'High' ? 'awaiting approval' : 'pending'} 
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {approval.customer || approval.vendor} • {approval.amount || approval.quantity}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      By {approval.submittedBy} • {approval.submittedAt}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                      Approve
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teamActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={activity.avatar}
                    alt={activity.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.name}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard;
