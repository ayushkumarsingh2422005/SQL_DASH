import axios from "axios";
import { useEffect, useState } from "react";
import { FiServer, FiWifi, FiWifiOff, FiLoader, FiLink } from "react-icons/fi";
import { Link } from "react-router-dom";

const configBackendUrl = import.meta.env.VITE_CONFIG_BACKEND_URL;
const actualBackendUrl = import.meta.env.VITE_ACTUAL_BACKEND_URL;

function App() {
    const [connectionStatus, setConnectionStatus] = useState("connecting");
    const [backendMessage, setBackendMessage] = useState(
        "Attempting to connect...",
    );
    const [lastError, setLastError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let intervalId = null;

        const checkBackend = async () => {
            if (!isMounted) return;

            setConnectionStatus("connecting");
            setLastError(null);

            try {
                const response = await axios.get("/api/status", {
                    timeout: 4000,
                });

                if (isMounted) {
                    setConnectionStatus("connected");
                    setBackendMessage(
                        response.data.status || "Backend is operational",
                    );
                }
            } catch (error) {
                if (isMounted) {
                    setConnectionStatus("error");
                    let errorMsg = "Connection Error";
                    if (error.code === "ECONNABORTED")
                        errorMsg = "Connection timed out";
                    else if (error.response)
                        errorMsg = `Proxy Error: ${error.response.status}`;
                    else if (error.request)
                        errorMsg = "Backend unreachable via proxy";
                    else errorMsg = `Error: ${error.message}`;

                    setBackendMessage(errorMsg);
                    setLastError(error.message);
                }
            }
        };

        checkBackend();
        intervalId = setInterval(checkBackend, 7000);

        return () => {
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const statusConfig = {
        connecting: {
            color: "text-yellow-400",
            icon: <FiLoader className="animate-spin" />,
            bg: "bg-yellow-900/20",
        },
        connected: {
            color: "text-green-400",
            icon: <FiWifi />,
            bg: "bg-green-900/20",
        },
        error: {
            color: "text-red-400",
            icon: <FiWifiOff />,
            bg: "bg-red-900/20",
        },
    };

    return (
        <div className="min-h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex place-items-center text-gray-100">
            <div className="container mx-auto px-4 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                        Database Connection Manager
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Manage your database connections with this intuitive
                        interface
                    </p>
                </header>

                <div className="max-w-4xl mx-auto bg-gray-850 rounded-2xl shadow-xl p-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div
                                className={`p-6 rounded-xl ${statusConfig[connectionStatus].bg} border border-gray-700`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className={`text-2xl ${statusConfig[connectionStatus].color}`}
                                    >
                                        {statusConfig[connectionStatus].icon}
                                    </div>
                                    <h2 className="text-xl font-semibold">
                                        Backend Status
                                    </h2>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Status:
                                        </span>
                                        <span
                                            className={`font-medium ${statusConfig[connectionStatus].color}`}
                                        >
                                            {connectionStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            Message:
                                        </span>
                                        <span>{backendMessage}</span>
                                    </div>
                                </div>

                                {lastError && (
                                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg text-sm text-red-300">
                                        <div className="font-medium mb-1">
                                            Error Details:
                                        </div>
                                        <code className="break-all">
                                            {lastError}
                                        </code>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FiServer /> Connection URLs
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="text-gray-400 mb-1">
                                            Config Backend URL:
                                        </div>
                                        <code className="break-all bg-gray-900/50 p-2 rounded">
                                            {configBackendUrl}
                                        </code>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 mb-1">
                                            Actual Backend URL:
                                        </div>
                                        <code className="break-all bg-gray-900/50 p-2 rounded">
                                            {actualBackendUrl}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center">
                            <div className="text-center p-6">
                                <h2 className="text-2xl font-bold mb-4">
                                    Get Started
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    Connect to your database to begin managing
                                    your data
                                </p>
                                <Link
                                    to="/db-connection"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white! font-medium py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-850"
                                >
                                    <FiLink /> Connect to Database
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
