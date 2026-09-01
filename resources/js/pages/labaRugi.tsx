import React from 'react';
import { Head } from '@inertiajs/react';

interface AccountItem {
    id: number;
    code: string;
    name: string;
    balance: number;
}

interface Props {
    revenues: AccountItem[];
    expenses: AccountItem[];
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
}

export default function LabaRugi({
    revenues = [],
    expenses = [],
    totalRevenue = 0,
    totalExpense = 0,
    netProfit = 0,
}: Props) {
    const isProfit = netProfit >= 0;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <Head title="Laporan Laba Rugi" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow">
                    <div>
                        <h1 className="text-2xl font-bold">Laporan Laba Rugi</h1>
                        <p className="text-sm text-gray-500 mt-1">Income Statement</p>
                    </div>
                    <div className="flex gap-4 text-sm font-medium">
                        <a href="/accounts" className="text-blue-600 hover:text-blue-800 hover:underline">Account</a>
                        <a href="/jurnal" className="text-blue-600 hover:text-blue-800 hover:underline">Jurnal Umum</a>
                        <a href="/bukuBesar" className="text-blue-600 hover:text-blue-800 hover:underline">Buku Besar</a>
                        <a href="/neracaSaldo" className="text-blue-600 hover:text-blue-800 hover:underline">Neraca Saldo</a>
                        <a href="/labaRugi" className="text-blue-600 hover:text-blue-800 hover:underline">Laba Rugi</a>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow space-y-8">
                    <div>
                        <h2 className="text-md font-bold uppercase text-gray-700 tracking-wider border-b pb-2 mb-3">
                            Pendapatan
                        </h2>
                        <div className="space-y-2">
                            {revenues.length === 0 ? (
                                <p className="text-sm text-gray-400 italic py-1">Belum ada pendapatan.</p>
                            ) : (
                                revenues.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
                                        <span className="text-gray-700">{item.code} - {item.name}</span>
                                        <span className="font-mono">Rp {item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))
                            )}
                            <div className="flex justify-between font-bold text-sm pt-2 text-emerald-800">
                                <span>Total Pendapatan</span>
                                <span className="font-mono">Rp {totalRevenue.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-md font-bold uppercase text-gray-700 tracking-wider border-b pb-2 mb-3">
                            Beban Operasional
                        </h2>
                        <div className="space-y-2">
                            {expenses.length === 0 ? (
                                <p className="text-sm text-gray-400 italic py-1">Belum ada pengeluaran.</p>
                            ) : (
                                expenses.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-100">
                                        <span className="text-gray-700">{item.code} - {item.name}</span>
                                        <span className="font-mono">Rp {item.balance.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                ))
                            )}
                            <div className="flex justify-between font-bold text-sm pt-2 text-rose-800">
                                <span>Total Beban</span>
                                <span className="font-mono">Rp {totalExpense.toLocaleString('id-ID', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>

                    <div className={`p-5 rounded-lg border-2 flex justify-between items-center ${isProfit ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-rose-50 border-rose-300 text-rose-950'
                        }`}>
                        <div>
                            <span className="text-xs uppercase tracking-wider font-semibold opacity-75 block">Hasil Akhir</span>
                            <span className="text-xl font-extrabold">
                                {isProfit ? 'Laba Bersih' : 'Rugi Bersih'}
                            </span>
                        </div>
                        <span className="text-2xl font-black font-mono">
                            Rp {Math.abs(netProfit).toLocaleString('id-ID', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}