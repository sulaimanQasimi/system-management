<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $lastname
 * @property string|null $pbx
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'lastname', 'pbx'])]
class ItSupport extends Model
{
    /**
     * @param  Builder<ItSupport>  $query
     * @return Builder<ItSupport>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (blank($search)) {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $builder) use ($term): void {
            $builder
                ->where('name', 'like', $term)
                ->orWhere('lastname', 'like', $term)
                ->orWhere('pbx', 'like', $term);
        });
    }
}
