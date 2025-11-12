
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon } from './icons/Icons';

const Access: React.FC = () => {
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const apiKey = "sk-live-••••••••••••••••••••••••GACMD3";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey.replace(/•/g, 'X')); // Copy a placeholder for security
        alert('API Key placeholder copied to clipboard!');
    };
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-brand-dark">Access & API Keys</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-brand-dark mb-2">Your API Key</h2>
                <p className="text-gray-600 mb-4">Use this key to integrate with our services. Keep it confidential!</p>
                
                <div className="flex items-center bg-gray-100 p-3 rounded-md border border-gray-200">
                    <p className="flex-grow font-mono text-gray-700 tracking-wider">
                        {apiKeyVisible ? apiKey.replace(/•/g, 'X') : apiKey}
                    </p>
                    <button onClick={() => setApiKeyVisible(!apiKeyVisible)} className="p-2 text-gray-500 hover:text-brand-blue">
                        {apiKeyVisible ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                    <button onClick={copyToClipboard} className="p-2 text-gray-500 hover:text-brand-blue">
                        <ClipboardDocumentIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md" role="alert">
                <p className="font-bold">Security Best Practices</p>
                <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Never expose your API key in client-side code (e.g., JavaScript in a browser).</li>
                    <li>Use environment variables on your server to store the API key securely.</li>
                    <li>Consider using token-based authentication (like JWT) for your application to avoid sending the raw API key with every request.</li>
                    <li>Regenerate your key immediately if you suspect it has been compromised.</li>
                </ul>
            </div>
        </div>
    );
};

export default Access;
