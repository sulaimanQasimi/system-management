<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $lastname
 * @property string $username
 * @property string $email
 * @property string|null $job
 * @property string|null $pbx
 * @property string|null $phone
 * @property Carbon|null $date
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $creator
 */
#[Fillable([
    'name',
    'lastname',
    'username',
    'email',
    'job',
    'pbx',
    'phone',
    'date',
    'created_by',
])]
class ActiveDirectoryUser extends Model
{
    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @param  Builder<ActiveDirectoryUser>  $query
     * @return Builder<ActiveDirectoryUser>
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
                ->orWhere('username', 'like', $term)
                ->orWhere('email', 'like', $term)
                ->orWhere('job', 'like', $term)
                ->orWhere('pbx', 'like', $term)
                ->orWhere('phone', 'like', $term);
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
