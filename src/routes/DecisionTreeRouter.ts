import { Router } from "express";
import asyncHandler from "express-async-handler";
import { DecisionTree } from "../models/DecisionTree";
import Logger from "../utils/Logger";

export const DecisionTreeRouter = Router();

// POST route to execute and serialize a decision tree
DecisionTreeRouter.post(
  "",
  asyncHandler(async (req, res) => {
    const treeData = req.body;

    Logger.info("Deserializing the decision tree...");
    const tree = DecisionTree.deserialize(treeData);

    Logger.info("Executing the decision tree...");
    tree.execute();

    Logger.info("Serializing the decision tree for response...");
    const serializedTree = tree.serialize();

    res.status(200).json({
      data: serializedTree,
    });
  })
);