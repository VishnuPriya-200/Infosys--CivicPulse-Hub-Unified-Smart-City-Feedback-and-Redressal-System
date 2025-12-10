import { useNavigate } from "react-router-dom";

export default function Citizen() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
            <h2 className="text-3xl font-bold text-blue-800 mb-10">Citizen Dashboard</h2>

            <div className="flex flex-col gap-6">
                <button
                    onClick={() => navigate("/submit-complaint")}
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition"
                >
                    📝 Submit Complaint
                </button>
                <button
                    onClick={() => navigate("/track-complaint")}
                    className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg hover:bg-gray-900 transition"
                >
                    🔍 Track Complaint
                </button>
            </div>
        </div>
    );
}
