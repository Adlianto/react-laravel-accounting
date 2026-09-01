<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurnal extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_date',
        'reference_number',
        'description',
    ];

    public function items()
    {
        return $this->hasMany(JurnalItem::class, 'jurnal_id');
    }
}