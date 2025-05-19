export interface AlternateContact {
    name: string;
    contactNo: string;
    jobTitle: string;
  }
  
  export interface Client {
    _id?: string;
    clientName: string;
    hqCountry: string;
    clientCode: string;
    clientContactNo: string;
    clientMail: string;
    chatId: string;
    alternateContacts: AlternateContact[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CreateClientResponse {
    _id: string;
    message: string;
  }
  
  // This interface is used for the form data on the front end.
  export interface ClientFormData extends Omit<Client, '_id' | 'createdAt' | 'updatedAt'> {}
  