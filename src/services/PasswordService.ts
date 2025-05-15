// userService.ts
import axios from "axios";

export interface UpdatePasswordPayload {
  email: string;
  prooftype: string;
  proof: string;
  newPassword: string;
  confirmNewPassword: string;
}

export async function updatePasswordService(payload: UpdatePasswordPayload) {
  const { email, prooftype, proof, newPassword, confirmNewPassword } = payload;
  // Adjust the endpoint as needed, e.g., `/api/users/${email}/password`
  const response = await axios.put(`/api/user/${email}/password`, {
    prooftype,
    proof,
    newPassword,
    confirmNewPassword,
  });
  return response.data;
}
