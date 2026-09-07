// NOTE: Example user store. Replace with real user management in production.
export type Role = "President" | "MembershipChair" | "Treasurer" | "Member" | "Viewer";

export interface User {
  username: string;
  password: string; // plain for demo only. Use a hash in prod
  role: Role;
  displayName?: string;
}

const users: User[] = [
  { username: "president", password: "password123", role: "President", displayName: "Club President" },
  { username: "membership", password: "password123", role: "MembershipChair", displayName: "Membership Chair" },
  { username: "treasurer", password: "password123", role: "Treasurer", displayName: "Treasurer" },
  { username: "viewer", password: "password123", role: "Viewer", displayName: "Read Only" }
];

export function findUser(username: string) {
  return users.find(u => u.username === username);
}
