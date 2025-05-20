import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, Edit, X, Mail, Phone, Globe, Hash, Users, MessageSquare } from 'lucide-react';
import { CreateClientPage } from './CreateClientPage';
import { ModalLayout } from '../components/ModalLayout';
import { EditButton } from '../components/EditButton';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Client {
  _id: string;
  clientName: string;
  hqCountry: string;
  clientCode: string;
  createdAt: string;
  clientMail: string;
  clientContactNo: string;
  chatId: string;
  alternateContacts: {
    name: string;
    contactNo: string;
    jobTitle: string;
  }[];
}

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onSave: (updatedClient: Client) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState<Client>({
    _id: '',
    clientName: '',
    hqCountry: '',
    clientCode: '',
    createdAt: '',
    clientMail: '',
    clientContactNo: '',
    chatId: '',
    alternateContacts: []
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!client) return null;

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Client Details"
      icon={<Edit className="w-6 h-6 text-blue-500" />}
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Email', name: 'clientMail', icon: <Mail className="w-5 h-5 text-blue-500" /> },
            { label: 'Contact', name: 'clientContactNo', icon: <Phone className="w-5 h-5 text-green-500" /> },
            { label: 'HQ Country', name: 'hqCountry', icon: <Globe className="w-5 h-5 text-indigo-500" /> },
            { label: 'Client Code', name: 'clientCode', icon: <Hash className="w-5 h-5 text-gray-500" /> },
            { label: 'Chat ID', name: 'chatId', icon: <MessageSquare className="w-5 h-5 text-orange-500" /> },
          ].map(({ label, name, icon }) => (
            <div key={name} className="flex items-center space-x-3">
              {icon}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                {name === 'clientContactNo' ? (
                  <PhoneInput
                    international
                    defaultCountry="US"
                    value={formData[name] as string}
                    onChange={(value) => setFormData(prev => ({ ...prev, [name]: value || '' }))}
                    className="border p-2 rounded-md w-full"
                  />
                ) : (
                  <input
                    type="text"
                    name={name}
                    value={formData[name as keyof Client] as string}
                    onChange={handleChange}
                    className="border p-2 rounded-md w-full"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Alternate Contacts Section */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-bold">Alternate Contacts</h3>
          </div>
          <div className="space-y-4">
            {formData.alternateContacts?.map((contact, index) => (
              <div key={index} className="p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => {
                        const updatedContacts = [...formData.alternateContacts];
                        updatedContacts[index] = { ...updatedContacts[index], name: e.target.value };
                        setFormData(prev => ({ ...prev, alternateContacts: updatedContacts }));
                      }}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <PhoneInput
                      international
                      defaultCountry="US"
                      value={contact.contactNo}
                      onChange={(value) => {
                        const updatedContacts = [...formData.alternateContacts];
                        updatedContacts[index] = { ...updatedContacts[index], contactNo: value || '' };
                        setFormData(prev => ({ ...prev, alternateContacts: updatedContacts }));
                      }}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={contact.jobTitle}
                      onChange={(e) => {
                        const updatedContacts = [...formData.alternateContacts];
                        updatedContacts[index] = { ...updatedContacts[index], jobTitle: e.target.value };
                        setFormData(prev => ({ ...prev, alternateContacts: updatedContacts }));
                      }}
                      className="border p-2 rounded-md w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const updatedContacts = [...formData.alternateContacts];
                updatedContacts.push({ name: '', contactNo: '', jobTitle: '' });
                setFormData(prev => ({ ...prev, alternateContacts: updatedContacts }));
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Alternate Contact
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </ModalLayout>
  );
};

const mockClients: Client[] = [
  {
    _id: '1',
    clientName: 'Acme Corporation',
    hqCountry: 'United States',
    clientCode: 'ACME',
    createdAt: '2023-01-15T12:00:00Z',
    clientMail: 'acme@example.com',
    clientContactNo: '+1-555-1234',
    chatId: 'acme_chat',
    alternateContacts: [
      { name: 'John Doe', contactNo: '+1-555-5678', jobTitle: 'Sales Manager' },
      { name: 'Jane Smith', contactNo: '+1-555-9012', jobTitle: 'Marketing Specialist' },
    ]
  },
  {
    _id: '2',
    clientName: 'TechGlobal Industries',
    hqCountry: 'Germany',
    clientCode: 'TGI',
    createdAt: '2023-02-20T14:30:00Z',
    clientMail: 'tgi@example.com',
    clientContactNo: '+49-30-1234567',
    chatId: 'tgi_chat',
    alternateContacts: [
      { name: 'Hans Müller', contactNo: '+49-30-2345678', jobTitle: 'Sales Representative' },
      { name: 'Erika Schmidt', contactNo: '+49-30-3456789', jobTitle: 'Technical Support' },
    ]
  },
  {
    _id: '3',
    clientName: 'Sakura Solutions',
    hqCountry: 'Japan',
    clientCode: 'SKRS',
    createdAt: '2023-03-10T09:15:00Z',
    clientMail: 'sakura@example.com',
    clientContactNo: '+81-3-1234-5678',
    chatId: 'sakura_chat',
    alternateContacts: [
      { name: 'Yumi Tanaka', contactNo: '+81-3-2345-6789', jobTitle: 'Project Manager' },
      { name: 'Taro Sato', contactNo: '+81-3-3456-7890', jobTitle: 'Software Developer' },
    ]
  },
  {
    _id: '4',
    clientName: 'Nordic Innovations',
    hqCountry: 'Sweden',
    clientCode: 'NRDI',
    createdAt: '2023-04-05T16:45:00Z',
    clientMail: 'nordic@example.com',
    clientContactNo: '+46-8-1234567',
    chatId: 'nordic_chat',
    alternateContacts: [
      { name: 'Erik Karlsson', contactNo: '+46-8-2345678', jobTitle: 'Sales Manager' },
      { name: 'Elin Andersson', contactNo: '+46-8-3456789', jobTitle: 'Marketing Specialist' },
    ]
  },
  {
    _id: '5',
    clientName: 'Sahara Enterprises',
    hqCountry: 'UAE',
    clientCode: 'SHRA',
    createdAt: '2023-05-22T11:20:00Z',
    clientMail: 'sahara@example.com',
    clientContactNo: '+971-50-1234567',
    chatId: 'sahara_chat',
    alternateContacts: [
      { name: 'Mohamed Al-Farsi', contactNo: '+971-50-2345678', jobTitle: 'Sales Manager' },
      { name: 'Aisha Al-Farsi', contactNo: '+971-50-3456789', jobTitle: 'Marketing Specialist' },
    ]
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
      createdAt: new Date().toISOString(),
      clientMail: '',
      clientContactNo: '',
      chatId: '',
      alternateContacts: []
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
                    <EditButton onClick={() => handleEditClient(client._id)} />
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