
function App() {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full border border-slate-200">
                <h1 className="text-2xl font-extrabold text-indigo-600 mb-2">
                    Campus Market 🛒
                </h1>
                <p className="text-slate-600 text-sm mb-4">
                    A mobile-first marketplace built with React, TypeScript, and Node.js.
                </p>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors">
                    Browse Products
                </button>
            </div>
        </div>
    );
}

export default App;