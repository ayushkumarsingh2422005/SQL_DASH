import { Router } from "express";
import {
    handleAddColumns,
    handleAddConstraints,
    handleCreateTable,
    handleDeleteColumns,
    handleDeleteDataFromTable,
    handleDropConstraints,
    handleDropTable,
    handleDumpDatabase,
    handleExportTable,
    handleGetConstraints,
    handleGetTableCode,
    handleGetTableDetails,
    handleGetTableSchema,
    handleInsertDataIntoTable,
    handleRenameTable,
    handleTruncateTable,
    handleUpdateDataInTable,
    handleViewTableData,
} from "../controller/table.controller.js";

const router = Router({ mergeParams: true });

router.get("/details", handleGetTableDetails);
router.post("/create", handleCreateTable);
router.get("/data", handleViewTableData);
router.get("/schema", handleGetTableSchema);

router.get("/code", handleGetTableCode);
router.patch("/add-columns", handleAddColumns);
router.patch("/delete-columns", handleDeleteColumns);
router
    .route("/constraints")
    .get(handleGetConstraints)
    .post(handleAddConstraints)
    .delete(handleDropConstraints);

router.delete("/drop", handleDropTable);
router.put("/rename", handleRenameTable);
router.get("/export", handleExportTable);
router.delete("/truncate", handleTruncateTable);

router
    .route("/data-manipulate")
    .post(handleInsertDataIntoTable)
    .patch(handleUpdateDataInTable)
    .delete(handleDeleteDataFromTable);

router.route("/dump").get(handleDumpDatabase);

export default router;
