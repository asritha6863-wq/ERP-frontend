import express from "express";
import {
  createRequest,
  deptAction,
  accountsAction
} from "../controllers/requestController.js";

const router = express.Router();

router.post("/create", createRequest);
router.put("/dept/:id", deptAction);
router.put("/accounts/:id", accountsAction);

export default router;