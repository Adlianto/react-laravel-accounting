<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JurnalItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'jurnal_id',
        'account_id',
        'debit',
        'credit',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function jurnal()
    {
        return $this->belongsTo(Jurnal::class, 'jurnal_id');
    }
}