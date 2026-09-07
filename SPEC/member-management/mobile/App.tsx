import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TextInput, Button, FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { BACKEND_URL } from "./src/config";

type Member = {
  memberNumber: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  address?: string;
  sex?: string;
  memberType?: string;
  familyAffiliation?: string;
};

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("viewer");
  const [password, setPassword] = useState("password123");
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (token) loadMembers();
  }, [token]);

  async function login() {
    try {
      const res = await axios.post(BACKEND_URL + "/auth/login", { username, password });
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert("Login failed");
    }
  }

  async function loadMembers() {
    try {
      const res = await axios.get(BACKEND_URL + "/members", { headers: { Authorization: `Bearer ${token}` } });
      setMembers(res.data);
    } catch (err) {
      alert("Failed to load members");
    }
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Telemark Members</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <Button title="Login" onPress={login} />
        <Text style={{ marginTop: 20 }}>Demo accounts: president/membership/treasurer/viewer (password123)</Text>
      </SafeAreaView>
    );
  }

  const role = user?.role;
  const canWrite = ["President", "MembershipChair", "Treasurer"].includes(role);

  const filtered = members.filter(m =>
    `${m.memberNumber} ${m.firstName} ${m.lastName}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Telemark Members</Text>
      <Text>Signed in as {user.displayName} ({role})</Text>
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        <TextInput style={styles.search} placeholder="Search" value={query} onChangeText={setQuery} />
        <Button title="Refresh" onPress={loadMembers} />
      </View>

      {canWrite && <Button title="Add Member" onPress={() => alert("Use the web admin or extend the app to add members. Example: POST /members")} />}

      <FlatList
        style={{ marginTop: 10 }}
        data={filtered}
        keyExtractor={(item) => item.memberNumber}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => alert(JSON.stringify(item, null, 2))}>
            <Text style={{ fontWeight: "600" }}>{item.memberNumber} — {item.firstName} {item.lastName}</Text>
            <Text>{item.email ?? item.phone}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 6, marginBottom: 8 },
  search: { flex: 1, borderWidth: 1, borderColor: "#ccc", marginRight: 8, padding: 8, borderRadius: 6 },
  item: { paddingVertical: 8, borderBottomWidth: 1, borderColor: "#eee" }
});
