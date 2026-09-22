<?php

namespace App\Models;

use App\Enums\ServerStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $site_name
 * @property int $department_id
 * @property int $server_model_id
 * @property string $name
 * @property string $ip_address
 * @property string|null $subnet_mask
 * @property string|null $default_gateway
 * @property string|null $description
 * @property int|null $it_support_id
 * @property string|null $it_support_phone
 * @property string|null $idrac_ip_address
 * @property string|null $idrac_subnet_mask
 * @property string|null $idrac_default_gateway
 * @property string|null $username
 * @property string|null $password
 * @property ServerStatus $status
 * @property bool $is_vm
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Department $department
 * @property-read ServerModel $serverModel
 * @property-read ItSupport|null $itSupport
 * @property-read User $creator
 */
#[Fillable([
    'site_name',
    'department_id',
    'server_model_id',
    'name',
    'ip_address',
    'subnet_mask',
    'default_gateway',
    'description',
    'it_support_id',
    'it_support_phone',
    'idrac_ip_address',
    'idrac_subnet_mask',
    'idrac_default_gateway',
    'username',
    'password',
    'status',
    'is_vm',
    'created_by',
])]
#[Hidden(['password'])]
class Server extends Model
{
    /**
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * @return BelongsTo<ServerModel, $this>
     */
    public function serverModel(): BelongsTo
    {
        return $this->belongsTo(ServerModel::class);
    }

    /**
     * @return BelongsToMany<ServerService, $this>
     */
    public function services(): BelongsToMany
    {
        return $this->belongsToMany(ServerService::class)->withTimestamps();
    }

    /**
     * @return BelongsTo<ItSupport, $this>
     */
    public function itSupport(): BelongsTo
    {
        return $this->belongsTo(ItSupport::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @param  Builder<Server>  $query
     * @return Builder<Server>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (blank($search)) {
            return $query;
        }

        $term = '%'.$search.'%';

        return $query->where(function (Builder $builder) use ($term): void {
            $builder
                ->where('site_name', 'like', $term)
                ->orWhere('name', 'like', $term)
                ->orWhere('ip_address', 'like', $term)
                ->orWhere('idrac_ip_address', 'like', $term)
                ->orWhere('username', 'like', $term)
                ->orWhere('description', 'like', $term)
                ->orWhere('it_support_phone', 'like', $term);
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ServerStatus::class,
            'password' => 'encrypted',
            'is_vm' => 'boolean',
        ];
    }
}
