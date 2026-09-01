import React from 'react';
import { Head, router } from '@inertiajs/react';

interface Account {
    id: number;
    code: string;
    name: string;
    category: string;
    normal_balance: string;
    initial_balance: number;
}

interface LedgerEntry {
    date: string;
    reference_number: string;
    description: string | null;
    debit: number;
    credit: number;
    balance: number;
}

interface Props {
    accounts: Account[];
    selectedAccount: Account | null;
    ledgerEntries: LedgerEntry[];
    initialBalance: number;
}

export default function BukuBesar({
    accounts = [],
    selectedAccount,
    ledgerEntries = [],
    initialBalance = 0,
}: Props) {
    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get('/bukuBesar', { account_id: e.target.value }, { preserveState: true });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Buku Besar" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <div>
                        <h1 className="text-2xl font-bold">Buku Besar</h1>
                    </div>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="/accounts" className="text-blue-600 hover:text-blue-800 hover:underline">Account</a>
                        <a href="/jurnal" className="text-blue-600 hover:text-blue-800 hover:underline">Jurnal Umum</a>
                        <a href="/bukuBesar" className="text-blue-600 hover:text-blue-800 hover:underline">Buku Besar</a>
                        <a href="/neracaSaldo" className="text-blue-600 hover:text-blue-800 hover:underline">Neraca Saldo</a>
                        <a href="/labaRugi" className="text-blue-600 hover:text-blue-800 hover:underline">Laba Rugi</a>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium mb-2">Pilih Akun</label>
                        <select
                            value={selectedAccount?.id || ''}
                            onChange={handleAccountChange}
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                        >
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.code} - {acc.name} ({acc.category.toUpperCase()})
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedAccount && (
                        <div className="text-right border-l pl-6">
                            <span className="text-xs text-gray-500 uppercase tracking-wider block">Saldo Normal</span>
                            <span className="text-sm font-semibold capitalize bg-gray-100 px-3 py-1 rounded inline-block mt-1">
                                {selectedAccount.normal_balance}
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow space-y-4">
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="border p-2 text-left">Tanggal</th>
                                <th className="border p-2 text-left">No. Bukti</th>
                                <th className="border p-2 text-left">Keterangan</th>
                                <th className="border p-2 text-right">Debit</th>
                                <th className="border p-2 text-right">Kredit</th>
                                <th className="border p-2 text-right bg-gray-200">Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-blue-50/50 font-medium">
                                <td className="border p-2 text-center text-gray-400">-</td>
                                <td className="border p-2 text-center text-gray-400">-</td>
                                <td className="border p-2 italic text-gray-700">Saldo Awal</td>
                                <td className="border p-2 text-right">-</td>
                                <td className="border p-2 text-right">-</td>
                                <td className="border p-2 text-right font-bold text-blue-900 bg-blue-100/50">
                                    Rp {initialBalance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>

                            {ledgerEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-gray-500">
                                        Tidak ada pergerakan transaksi pada akun ini.
                                    </td>
                                </tr>
                            ) : (
                                ledgerEntries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border p-2">{entry.date}</td>
                                        <td className="border p-2 font-mono font-medium">{entry.reference_number}</td>
                                        <td className="border p-2 text-gray-600">{entry.description || '-'}</td>
                                        <td className="border p-2 text-right">
                                            {entry.debit > 0 ? `Rp ${entry.debit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}` : '-'}
                                        </td>
                                        <td className="border p-2 text-right">
                                            {entry.credit > 0 ? `Rp ${entry.credit.toLocaleString('id-ID', { minimumFractionDigits: 2 })}` : '-'}
                                        </td>
                                        <td className="border p-2 text-right font-semibold bg-gray-50">
                                            Rp {entry.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}