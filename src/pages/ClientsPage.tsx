import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Trash2 } from 'lucide-react';
import { CreateClientPage } from './CreateClientPage';

interface Client {
  _id: string;
  clientName: string;
  hqCountry: string;
  clientCode: string;
  createdAt: string;
}
const mockClients: Client[] = [
  {
    _id: '1',
    clientName: 'Acme Corporation',
    hqCountry: 'United States',
    clientCode: 'ACME',
    createdAt: '2023-01-15T12:00:00Z'
  },
  {
    _id: '2',
    clientName: 'TechGlobal Industries',
    hqCountry: 'Germany',
    clientCode: 'TGI',
    createdAt: '2023-02-20T14:30:00Z'
  },
  {
    _id: '3',
    clientName: 'Sakura Solutions',
    hqCountry: 'Japan',
    clientCode: 'SKRS',
    createdAt: '2023-03-10T09:15:00Z'
  },
  {
    _id: '4',
    clientName: 'Nordic Innovations',
    hqCountry: 'Sweden',
    clientCode: 'NRDI',
    createdAt: '2023-04-05T16:45:00Z'
  },
  {
    _id: '5',
    clientName: 'Sahara Enterprises',
    hqCountry: 'UAE',
    clientCode: 'SHRA',
    createdAt: '2023-05-22T11:20:00Z'
  },
];

export function ClientsPage() {
  // For static demo, assuming admin view
  const isActionAllowed = true;
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);

  const handleAddNewClient = () => {
    // In a real implementation, we would add the new client to the list
    // For this demo, we'll just simulate by adding a generic new client
    const newClient: Client = {
      _id: `${clients.length + 1}`,
      clientName: 'New Client',
      hqCountry: 'United States',
      clientCode: 'NEW',
      createdAt: new Date().toISOString()
    };
    
    setClients([newClient, ...clients]);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        </div>
        {isActionAllowed && (
          <button
            onClick={() => setShowCreateClientModal(true)}
            className="inline-flex items-center px-8 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Client
          </button>
        )}
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Code</th>
              <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Created</th>
              {isActionAllowed && (
                <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {clients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-sm text-gray-500">{client._id}</td>
                <td className="px-3 py-4 text-sm">
                  <Link to={`/clients/${client._id}`} className="font-medium text-blue-600 hover:underline">
                    {client.clientName}
                  </Link>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">{client.hqCountry}</td>
                <td className="px-3 py-4 text-sm">
                  <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {client.clientCode}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                {isActionAllowed && (
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => alert('Delete functionality not implemented in static demo')}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Use the CreateClientPage component as a popup */}
      {showCreateClientModal && (
        <CreateClientPage 
          isPopup={true}
          onClose={() => setShowCreateClientModal(false)}
          onSuccess={handleAddNewClient}
        />
      )}
    </div>
  );
} 