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
 * @property int|null $department_id
 * @property string|null $job
 * @property string|null $pbx
 * @property string|null $phone
 * @property Carbon|null $date
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Department|null $department
 * @property-read User $creator
 */
#[Fillable([
    'name',
    'lastname',
    'username',
    'email',
    'department_id',
    'job',
    'pbx',
    'phone',
    'date',
    'created_by',
])]
class ActiveDirectoryUser extends Model
{
    public const EMAIL_DOMAIN = 'mod.gov.af';

    /** @var list<string> */
    public const LEGACY_EMAIL_DOMAINS = ['mof.gov.af', 'mov.gov.af'];

    /**
     * Canonical AD email for display and persistence (username@mod.gov.af).
     */
    public function canonicalEmail(): string
    {
        $username = trim((string) $this->username);

        if ($username !== '') {
            return $username.'@'.self::EMAIL_DOMAIN;
        }

        $email = (string) $this->email;

        foreach (self::LEGACY_EMAIL_DOMAINS as $legacyDomain) {
            $suffix = '@'.$legacyDomain;
            if (str_ends_with(strtolower($email), $suffix)) {
                return substr($email, 0, -strlen($suffix)).'@'.self::EMAIL_DOMAIN;
            }
        }

        return $email;
    }

    /**
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

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
                ->whereLike('name', $term)
                ->orWhereLike('lastname', $term)
                ->orWhereLike('username', $term)
                ->orWhereLike('email', $term)
                ->orWhereLike('job', $term)
                ->orWhereLike('pbx', $term)
                ->orWhereLike('phone', $term);
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
