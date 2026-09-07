import express from "express";
import { getMembersFile, updateMembersFile } from "../githubClient";
import { ensureAuthenticated, ensureRole, AuthRequest } from "../middleware/auth";

const router = express.Router();

// Read-only: anyone authenticated can read; you may relax to public if desired
router.get("/", ensureAuthenticated, async (req: AuthRequest, res) => {
  try {
    const { parsed } = await getMembersFile();
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const writeRoles = ["President", "MembershipChair", "Treasurer"] as const;

// Add member
router.post("/", ensureAuthenticated, ensureRole(writeRoles as any), async (req: AuthRequest, res) => {
  try {
    const newMember = req.body;
    if (!newMember.memberNumber) return res.status(400).json({ error: "memberNumber required" });
    const { parsed, sha } = await getMembersFile();
    // ensure uniqueness of memberNumber
    if ((parsed as any[]).some(m => m.memberNumber === newMember.memberNumber)) {
      return res.status(409).json({ error: "memberNumber already exists" });
    }
    const updated = [...parsed, newMember];
    await updateMembersFile(updated, `Add member ${newMember.memberNumber} by ${req.user?.username}`, sha);
    res.status(201).json(newMember);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update member by memberNumber
router.put("/:memberNumber", ensureAuthenticated, ensureRole(writeRoles as any), async (req: AuthRequest, res) => {
  try {
    const { memberNumber } = req.params;
    const patch = req.body;
    const { parsed, sha } = await getMembersFile();
    const idx = (parsed as any[]).findIndex(m => m.memberNumber === memberNumber);
    if (idx === -1) return res.status(404).json({ error: "Member not found" });
    const updated = [...parsed];
    updated[idx] = { ...updated[idx], ...patch };
    await updateMembersFile(updated, `Update member ${memberNumber} by ${req.user?.username}`, sha);
    res.json(updated[idx]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:memberNumber", ensureAuthenticated, ensureRole(writeRoles as any), async (req: AuthRequest, res) => {
  try {
    const { memberNumber } = req.params;
    const { parsed, sha } = await getMembersFile();
    const filtered = (parsed as any[]).filter(m => m.memberNumber !== memberNumber);
    if (filtered.length === (parsed as any[]).length) return res.status(404).json({ error: "Member not found" });
    await updateMembersFile(filtered, `Delete member ${memberNumber} by ${req.user?.username}`, sha);
    res.json({ deleted: memberNumber });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
