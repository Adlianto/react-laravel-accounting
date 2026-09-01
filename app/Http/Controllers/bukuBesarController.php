<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\JurnalItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class bukuBesarController extends Controller
{
    public function index(Request $request)
    {
        $accounts = Account::orderBy('code', 'asc')->get();
        $selectedAccountId = $request->query('account_id', $accounts->first()?->id);

        $selectedAccount = null;
        $ledgerEntries = [];

        if ($selectedAccountId) {
            $selectedAccount = Account::find($selectedAccountId);

            if ($selectedAccount) {
                $items = JurnalItem::with('jurnal')
                    ->where('account_id', $selectedAccountId)
                    ->join('jurnals', 'jurnal_items.jurnal_id', '=', 'jurnals.id')
                    ->orderBy('jurnals.transaction_date', 'asc')
                    ->orderBy('jurnals.id', 'asc')
                    ->select('jurnal_items.*')
                    ->get();

                $currentBalance = (float) $selectedAccount->initial_balance;

                foreach ($items as $item) {
                    $debit = (float) $item->debit;
                    $credit = (float) $item->credit;

                    if ($selectedAccount->normal_balance === 'debit') {
                        $currentBalance += ($debit - $credit);
                    } else {
                        $currentBalance += ($credit - $debit);
                    }

                    $ledgerEntries[] = [
                        'date'             => $item->jurnal->transaction_date,
                        'reference_number' => $item->jurnal->reference_number,
                        'description'      => $item->jurnal->description,
                        'debit'            => $debit,
                        'credit'           => $credit,
                        'balance'          => $currentBalance,
                    ];
                }
            }
        }

        return Inertia::render('bukuBesar', [
            'accounts'        => $accounts,
            'selectedAccount' => $selectedAccount,
            'ledgerEntries'   => $ledgerEntries,
            'initialBalance'  => $selectedAccount ? (float) $selectedAccount->initial_balance : 0,
        ]);
    }
}