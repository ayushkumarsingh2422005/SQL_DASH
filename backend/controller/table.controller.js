import {
    addColumnsToTable,
    addConstraintToTable,
    createTable,
    deleteDataFromTable,
    dropColumnsFromTable,
    dropConstraintFromTable,
    dropTable,
    dumpDatabase,
    exportTable,
    getTableCode,
    getTableConstraints,
    getTableDetails,
    getTableSchema,
    insertDataIntoTable,
    renameTable,
    truncateTable,
    updateDataInTable,
    viewTableData,
} from "../services/tableOperations.service.js";
import asyncHandler from "../utils/asyncHandler.js";

const handleGetTableDetails = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await getTableDetails(dbName, tableName);
    return res.status(200).json(result);
});

const handleGetTableSchema = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await getTableSchema(dbName, tableName);
    return res.status(200).json(result);
});

const handleCreateTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { columns } = req.body;
    const results = await createTable(dbName, tableName, columns);
    return res.status(201).json(results);
});

const handleViewTableData = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await viewTableData(dbName, tableName);
    return res.status(200).json(result);
});

const handleAddColumns = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { columns } = req.body;
    const result = await addColumnsToTable(dbName, tableName, columns);
    return res.status(201).json(result);
});

const handleDeleteColumns = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { columns } = req.body;
    const result = await dropColumnsFromTable(dbName, tableName, columns);
    return res.status(201).json(result);
});

const handleDropTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await dropTable(dbName, tableName);
    return res.status(200).json(result);
});

const handleExportTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const result = await exportTable(dbName, tableName, limit);
    return res.status(200).json(result);
});

const handleTruncateTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await truncateTable(dbName, tableName);
    return res.status(200).json(result);
});

const handleGetConstraints = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await getTableConstraints(dbName, tableName);
    return res.status(200).json(result);
});

const handleAddConstraints = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { constraints } = req.body;
    const result = await addConstraintToTable(dbName, tableName, constraints);
    return res.status(201).json(result);
});

const handleDropConstraints = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { constraint } = req.body;
    const result = await dropConstraintFromTable(dbName, tableName, constraint);
    return res.status(201).json(result);
});

const handleGetTableCode = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const result = await getTableCode(dbName, tableName);
    return res.status(200).json(result);
});

const handleInsertDataIntoTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { data } = req.body;
    const result = await insertDataIntoTable(dbName, tableName, data);
    return res.status(201).json(result);
});

const handleUpdateDataInTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { data, conditions } = req.body;
    const result = await updateDataInTable(dbName, tableName, data, conditions);
    return res.status(200).json(result);
});

const handleDeleteDataFromTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { conditions } = req.body;
    const result = await deleteDataFromTable(dbName, tableName, conditions);
    return res.status(200).json(result);
});

const handleDumpDatabase = asyncHandler(async (req, res, next) => {
    const { dbName, tableName } = req.params;
    const { password } = req.query;

    const sql = await dumpDatabase(dbName, tableName, password);
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${dbName}_${tableName || "dump"}.sql"`,
    );
    res.setHeader("Content-Type", "application/sql");
    res.send(sql);
});

const handleRenameTable = asyncHandler(async (req, res) => {
    const { dbName, tableName } = req.params;
    const { newTableName } = req.body;
    const result = await renameTable(dbName, tableName, newTableName);
    return res.status(200).json(result);
});

export {
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
};
