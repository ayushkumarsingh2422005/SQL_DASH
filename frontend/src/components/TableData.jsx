import { useEffect, useMemo, useState } from "react";
import {
    FaSort,
    FaSortUp,
    FaSortDown,
    FaDatabase,
    FaTrash,
    FaCheckSquare,
    FaSquare,
    FaCross,
    FaTimes,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Error from "../ui/Error.jsx";
import Loader from "../ui/Loader.jsx";
import { getTableData, deleteRow } from "../utils/api/axios.js";
import { FaPlus } from "react-icons/fa";
import AddDataModal from "./AddDataModal.jsx";

const TableData = () => {
    const { dbName, tableName } = useParams();
    const [tableData, setTableData] = useState({ data: [], columns: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set());
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSelectMultiple, setIsSelectMultiple] = useState(false);

    const fetchTableData = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await getTableData(dbName, tableName);
            setTableData(data);
            setSelectedRows(new Set()); // Clear selection on refresh
            setIsSelectAll(false);
            toast.success(
                <span>
                    Loaded{" "}
                    <span className="font-bold text-blue-300">
                        {data.data.length}
                    </span>{" "}
                    rows from{" "}
                    <span className="font-bold text-purple-300">
                        {tableName}
                    </span>
                </span>,
                { icon: <FaDatabase className="text-blue-400" /> },
            );
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to fetch table data";
            setError(errorMsg);
            toast.error(
                <span>
                    Error loading <span className="font-bold">{tableName}</span>
                    : {errorMsg}
                </span>,
                { className: "bg-red-900/80 border border-red-700" },
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = () => fetchTableData();

    const requestSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return tableData.data;

        return [...tableData.data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle null/undefined values
            if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
            if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

            // String comparison
            return sortConfig.direction === "asc"
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });
    }, [tableData.data, sortConfig]);

    const columnColors = [
        "text-blue-300",
        "text-green-300",
        "text-purple-300",
        "text-amber-300",
        "text-pink-300",
        "text-cyan-300",
        "text-lime-300",
        "text-rose-300",
        "text-teal-300",
        "text-orange-300",
    ];

    const toggleRowSelection = (rowIndex) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(rowIndex)) {
            newSelectedRows.delete(rowIndex);
        } else {
            newSelectedRows.add(rowIndex);
        }
        setSelectedRows(newSelectedRows);
        setIsSelectAll(newSelectedRows.size === sortedData.length);
    };

    const toggleSelectAll = () => {
        if (isSelectAll) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set([...Array(sortedData.length).keys()]));
        }
        setIsSelectAll(!isSelectAll);
    };

    const handleDeleteRows = async () => {
        if (selectedRows.size === 0) return;

        try {
            setIsDeleting(true);
            const rowsToDelete = Array.from(selectedRows).map(
                (index) => sortedData[index],
            );

            await deleteRow(dbName, tableName, rowsToDelete);

            toast.success(
                <span>
                    Deleted{" "}
                    <span className="font-bold text-red-300">
                        {selectedRows.size}
                    </span>{" "}
                    row{selectedRows.size !== 1 ? "s" : ""}
                </span>,
            );

            await fetchTableData();
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to delete rows";
            toast.error(<span>Error deleting rows: {errorMsg}</span>, {
                className: "bg-red-900/80 border border-red-700",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSingleDelete = async (rowData) => {
        try {
            setIsDeleting(true);
            await deleteRow(dbName, tableName, [rowData]);

            toast.success(<span>Row deleted successfully</span>);

            await fetchTableData();
        } catch (err) {
            const errorMsg =
                err.response?.data?.message || "Failed to delete row";
            toast.error(<span>Error deleting row: {errorMsg}</span>, {
                className: "bg-red-900/80 border border-red-700",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchTableData();
    }, [dbName, tableName]);

    if (loading) return <Loader className="min-h-[400px]" />;
    if (error) return <Error message={error} className="mt-8" />;

    return (
        <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Sticky header section */}
            <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-900 to-gray-900/80 backdrop-blur-lg p-4 border-b border-gray-700/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <FaDatabase className="text-blue-400/80 text-lg" />
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                <span className="text-blue-300">{dbName}</span>
                                <span className="text-gray-500 mx-2">/</span>
                                <span className="text-white">{tableName}</span>
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-800/70 text-blue-300 px-3 py-1 rounded-full border border-blue-900/50">
                                {sortedData.length} row
                                {sortedData.length !== 1 ? "s" : ""}
                            </span>
                            <span className="text-xs bg-gray-800/70 text-purple-300 px-3 py-1 rounded-full border border-purple-900/50">
                                {tableData.columns?.length} column
                                {tableData.columns?.length !== 1 ? "s" : ""}
                            </span>
                            {selectedRows.size > 0 && (
                                <span className="text-xs bg-gray-800/70 text-red-300 px-3 py-1 rounded-full border border-red-900/50 flex items-center gap-1">
                                    {selectedRows.size} selected
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedRows.size > 0 && (
                            <button
                                onClick={handleDeleteRows}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md border border-red-700/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <FaTrash className="text-xs" />
                                Delete ({selectedRows.size})
                            </button>
                        )}
                        {!isSelectMultiple ? (
                            <button
                                onClick={() =>
                                    setIsSelectMultiple(!isSelectMultiple)
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md border border-gray-700/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <FaPlus className="text-xs" />
                                Select Multiple
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setSelectedRows(new Set());
                                    setIsSelectMultiple(!isSelectMultiple);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md border border-gray-700/50 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <FaTimes className="text-xs" />
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md border border-blue-700/50 transition-colors flex items-center gap-2"
                        >
                            <FaPlus className="text-xs" />
                            Add Data
                        </button>
                    </div>
                </div>
            </div>

            {/* Table container */}
            <div className="overflow-auto flex-1">
                <table className="min-w-full divide-y divide-gray-700/30">
                    <thead className="bg-gray-800/80 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                            {isSelectMultiple && (
                                <th className="w-10 px-3 py-3.5 text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="flex items-center justify-center w-full h-full"
                                        title="Select all"
                                    >
                                        {isSelectAll ? (
                                            <FaCheckSquare className="text-blue-400" />
                                        ) : (
                                            <FaSquare className="text-gray-500/60 hover:text-gray-400" />
                                        )}
                                    </button>
                                </th>
                            )}
                            {tableData.columns?.map((col) => (
                                <th
                                    key={col.name}
                                    className="px-6 py-3.5 min-w-50 text-xs font-semibold text-gray-300 uppercase tracking-wider group hover:bg-gray-700/40 transition-all duration-200 cursor-pointer"
                                    onClick={() => requestSort(col.name)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                                {col.name}
                                            </span>
                                            <span className="text-gray-500/80 text-xs font-mono hidden md:inline bg-gray-900/50 px-1.5 py-0.5 rounded">
                                                {col.type}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            {sortConfig.key === col.name ? (
                                                sortConfig.direction ===
                                                "asc" ? (
                                                    <FaSortUp className="text-blue-400 text-sm ml-1.5" />
                                                ) : (
                                                    <FaSortDown className="text-blue-400 text-sm ml-1.5" />
                                                )
                                            ) : (
                                                <FaSort className="text-gray-500/60 text-xs ml-1.5 group-hover:text-gray-400 transition-colors" />
                                            )}
                                        </div>
                                    </div>
                                </th>
                            ))}
                            <th className="w-10 px-3 py-3.5 text-xs font-bold text-red-500 uppercase tracking-wider">
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-900/40 divide-y divide-gray-700/20">
                        {sortedData.length > 0 ? (
                            sortedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="relative hover:bg-gray-800/50 transition-all duration-150 group"
                                >
                                    {isSelectMultiple && (
                                        <td className="px-3 py-3.5 whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() =>
                                                        toggleRowSelection(
                                                            rowIndex,
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-blue-400 transition-colors"
                                                >
                                                    {selectedRows.has(
                                                        rowIndex,
                                                    ) ? (
                                                        <FaCheckSquare className="text-blue-400" />
                                                    ) : (
                                                        <FaSquare className="opacity-60 hover:opacity-100" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                    {tableData.columns.map((col, colIndex) => (
                                        <td
                                            key={`${rowIndex}-${col.name}`}
                                            className="px-6 py-3.5 whitespace-nowrap text-sm"
                                        >
                                            <div className="flex items-center">
                                                {row[col.name] !== null ? (
                                                    <span
                                                        className={`truncate max-w-[180px] md:max-w-[240px] xl:max-w-[320px] ${
                                                            columnColors[
                                                                colIndex %
                                                                    columnColors.length
                                                            ]
                                                        }`}
                                                    >
                                                        {String(row[col.name])}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500/80 italic bg-gray-900/30 px-2 py-0.5 rounded text-xs">
                                                        NULL
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                    <td className="px-3 py-3.5 whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    handleSingleDelete(row)
                                                }
                                                disabled={isDeleting}
                                                className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-900/20 disabled:opacity-50"
                                                title="Delete row"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={
                                        tableData.columns?.length
                                            ? tableData.columns.length + 2
                                            : 1
                                    }
                                    className="px-6 py-16 text-left"
                                >
                                    <div className="flex flex-col items-center justify-center text-gray-400">
                                        <div className="relative mb-4">
                                            <FaDatabase className="h-14 w-14 text-purple-400/30" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="h-8 w-8 rounded-full bg-gray-900/80 border-2 border-dashed border-gray-700/50 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <p className="font-medium text-white/90 mb-2 text-lg">
                                            Empty Table
                                        </p>
                                        <p className="text-sm max-w-md text-center text-gray-400/90">
                                            <span className="font-medium text-blue-300">
                                                {tableName}
                                            </span>{" "}
                                            exists but doesn't contain any data
                                            yet
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Status footer */}
            <div className="sticky bottom-0 z-10 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
                <span>
                    Sorted by:{" "}
                    {sortConfig.key ? (
                        <span className="text-blue-300">
                            {sortConfig.key} ({sortConfig.direction})
                        </span>
                    ) : (
                        <span className="text-gray-400">Natural order</span>
                    )}
                </span>
                <span>Last fetched: {new Date().toLocaleTimeString()}</span>
            </div>
            {showAddModal && (
                <AddDataModal
                    columns={tableData.columns || []}
                    dbName={dbName}
                    tableName={tableName}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={handleAddSuccess}
                />
            )}
        </div>
    );
};

export default TableData;
