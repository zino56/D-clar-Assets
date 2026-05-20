import { Router, type IRouter } from "express";
import {
  getDocument,
  listDocuments,
  listFollowups,
  type DocumentStatus,
  type FollowUpStatus,
  type Severity,
} from "../data/store";

const router: IRouter = Router();

router.get("/documents", (req, res) => {
  const status = req.query.status as DocumentStatus | undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const sort = typeof req.query.sort === "string" ? req.query.sort : undefined;
  const data = listDocuments({ status, search, sort });
  res.json(data);
});

router.get("/documents/:id", (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ message: "Document not found" });
    return;
  }
  res.json(doc);
});

router.get("/documents/:id/followups", (req, res) => {
  const doc = getDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ message: "Document not found" });
    return;
  }
  res.json({ items: doc.followups });
});

router.get("/followups", (req, res) => {
  const status = req.query.status as FollowUpStatus | undefined;
  const severity = req.query.severity as Severity | undefined;
  const language =
    req.query.language === "fr" || req.query.language === "ar"
      ? req.query.language
      : undefined;
  const items = listFollowups({ status, severity, language });
  res.json({ items });
});

export default router;
