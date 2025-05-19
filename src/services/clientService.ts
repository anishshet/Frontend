import { type Client, type ClientFormData, type CreateClientResponse } from '../types/client';

// Mock static data
const mockClients: Client[] = [
  {
    _id: "1",
    clientName: "Tech Solutions",
    hqCountry: "USA",
    clientCode: "TS001",
    clientContactNo: "1234567890",
    clientMail: "contact@techsolutions.com",
    chatId: "tech-solutions-chat",
    alternateContacts: [
      { name: "John Doe", contactNo: "9876543210", jobTitle: "Project Manager" },
      { name: "Jane Smith", contactNo: "1231231234", jobTitle: "Technical Lead" }
    ],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-02-01"),
  },
  {
    _id: "2",
    clientName: "Innovate Labs",
    hqCountry: "Canada",
    clientCode: "IL002",
    clientContactNo: "1122334455",
    clientMail: "info@innovatelabs.com",
    chatId: "innovate-labs-chat",
    alternateContacts: [
      { name: "Alice Brown", contactNo: "5566778899", jobTitle: "Operations Head" },
    ],
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-06-15"),
  }
];

export const clientService = {
  async createClient(formData: ClientFormData): Promise<CreateClientResponse> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const newClient = {
      ...formData,
      _id: `${mockClients.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockClients.push(newClient);
    return { _id: newClient._id!, message: "Client created successfully" };
  },

  async getClients(): Promise<Client[]> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClients;
  },

  async getClientById(clientId: string): Promise<Client> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const client = mockClients.find((c) => c._id === clientId);
    if (!client) throw new Error("Client not found");
    return client;
  },

  async updateClient(clientId: string, updatedData: Partial<Client>): Promise<Client> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const clientIndex = mockClients.findIndex((c) => c._id === clientId);
    if (clientIndex === -1) throw new Error("Client not found");

    mockClients[clientIndex] = {
      ...mockClients[clientIndex],
      ...updatedData,
      updatedAt: new Date(),
    };
    return mockClients[clientIndex];
  },

  async deleteClient(clientId: string): Promise<void> {
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const clientIndex = mockClients.findIndex((c) => c._id === clientId);
    if (clientIndex === -1) throw new Error("Client not found");

    mockClients.splice(clientIndex, 1);
  }
};