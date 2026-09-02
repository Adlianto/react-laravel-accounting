<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\jurnal;
use App\Models\jurnalItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JurnalController extends Controller
{
    public function index()
    {
        $accounts = Account::orderBy('code', 'asc')->get();
        $jurnals = jurnal::with('items.account')
            ->orderBy('transaction_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('jurnal', [
            'accounts' => $accounts,
            'jurnals'  => $jurnals,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'transaction_date' => 'required|date',
            'reference_number' => 'required|string|unique:jurnals,reference_number',
            'description'      => 'nullable|string',
            'items'            => 'required|array|min:2',
            'items.*.account_id' => 'required|exists:accounts,id',
            'items.*.debit'      => 'required|numeric|min:0',
            'items.*.credit'     => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $jurnal = jurnal::create([
                'transaction_date' => $request->transaction_date,
                'reference_number' => $request->reference_number,
                'description'      => $request->description,
            ]);

            foreach ($request->items as $item) {
                jurnalItem::create([
                    'jurnal_id'   => $jurnal->id,
                    'account_id'  => $item['account_id'],
                    'debit'       => $item['debit'],
                    'credit'      => $item['credit'],
                ]);
            }
        });

        return redirect()->back();
    }

    public function update(Request $request, jurnal $jurnal)
    {
        $request->validate([
            'transaction_date' => 'required|date',
            'reference_number' => 'required|string|unique:jurnals,reference_number,' . $jurnal->id,
            'description'      => 'nullable|string',
            'items'            => 'required|array|min:2',
            'items.*.account_id' => 'required|exists:accounts,id',
            'items.*.debit'      => 'required|numeric|min:0',
            'items.*.credit'     => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request, $jurnal) {
            $jurnal->update([
                'transaction_date' => $request->transaction_date,
                'reference_number' => $request->reference_number,
                'description'      => $request->description,
            ]);

            $jurnal->items()->delete();

            foreach ($request->items as $item) {
                jurnalItem::create([
                    'jurnal_id'   => $jurnal->id,
                    'account_id'  => $item['account_id'],
                    'debit'       => $item['debit'],
                    'credit'      => $item['credit'],
                ]);
            }
        });

        return redirect()->back();
    }

    public function destroy(jurnal $jurnal)
    {
        DB::transaction(function () use ($jurnal) {
            $jurnal->items()->delete();
            $jurnal->delete();
        });

        return redirect()->back();
    }
}