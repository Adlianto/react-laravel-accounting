<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = Account::orderBy('code', 'asc')->get();

        return Inertia::render('welcome', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:accounts,code|max:20',
            'name' => 'required|string|max:255',
            'category' => 'required|in:asset,liability,equity,revenue,expense',
            'normal_balance' => 'required|in:debit,credit',
            'initial_balance' => 'nullable|numeric|min:0',
        ]);

        Account::create($validated);

        return redirect()->route('accounts.index')->with('success', 'Akun berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'code' => 'required|unique:accounts,code,'.$account->id,
            'name' => 'required|string|max:255',
            'category' => 'required|in:asset,liability,equity,revenue,expense',
            'normal_balance' => 'required|in:debit,credit',
            'initial_balance' => 'required|numeric',
        ]);

        $account->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {   
        if ($account->jurnalItems()->exists()) {
            return redirect()->back()->withErrors([
                'delete' => 'Akun ini tidak dapat dihapus karena sudah memiliki histori transaksi jurnal!',
            ]);
        }

        $account->delete();

        return redirect()->back();
    }
}
