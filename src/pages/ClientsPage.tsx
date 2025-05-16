import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Edit, X } from 'lucide-react';
import { CreateClientPage } from './CreateClientPage';

interface Client {
  _id: string;
  clientName: string;
  hqCountry: string;
  clientCode: string;
  createdAt: string;
}

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onSave: (updatedClient: Client) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    hqCountry: '',
    clientCode: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        clientName: client.clientName,
        hqCountry: client.hqCountry,
        clientCode: client.clientCode,
      });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      onSave({
        ...client,
        ...formData,
      });
    }
  };

  if (!isOpen || !client) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4 overflow-y-auto mt-16"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white shadow-xl rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative animate-scale-in my-auto">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg px-6 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Edit className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-800">Edit Client</h1>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1.5 rounded-full hover:bg-gray-200 fixed right-4 top-4 z-30"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto rounded-b-lg custom-scrollbar" style={{ maxHeight: "calc(80vh - 60px)" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.hqCountry}
                  onChange={(e) => setFormData({ ...formData, hqCountry: e.target.value })}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Code
                </label>
                <input
                  type="text"
                  value={formData.clientCode}
                  onChange={(e) => setFormData({ ...formData, clientCode: e.target.value })}
                  className="mt-1 block w-full h-11 px-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this client?')) {
                    // Handle delete
                    onClose();
                  }
                }}
                className="px-4 py-2 text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Delete Client
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-base border border-transparent font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

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
  const isActionAllowed = true;
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddNewClient = () => {
    const newClient: Client = {
      _id: `${clients.length + 1}`,
      clientName: 'New Client',
      hqCountry: 'United States',
      clientCode: 'NEW',
      createdAt: new Date().toISOString()
    };
    
    setClients([newClient, ...clients]);
  };

  const handleEditClient = (clientId: string) => {
    const client = clients.find(c => c._id === clientId);
    if (client) {
      setSelectedClient(client);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveClient = (updatedClient: Client) => {
    const updatedClients = clients.map(c => 
      c._id === updatedClient._id ? updatedClient : c
    );
    setClients(updatedClients);
    setIsEditModalOpen(false);
    setSelectedClient(null);
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

      <div className="overflow-x-auto">
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
          <tbody className="divide-y divide-gray-200">
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
                      onClick={() => handleEditClient(client._id)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      title="Edit client"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Client Modal */}
      {showCreateClientModal && (
        <CreateClientPage 
          isPopup={true}
          onClose={() => setShowCreateClientModal(false)}
          onSuccess={handleAddNewClient}
        />
      )}

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onSave={handleSaveClient}
      />
    </div>
  );
} 