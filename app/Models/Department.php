<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * @property int $id
 * @property string $name
 * @property int|null $parent_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Department|null $parent
 * @property-read Collection<int, Department> $children
 */
#[Fillable(['name', 'parent_id'])]
class Department extends Model
{
    /**
     * @return BelongsTo<Department, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    /**
     * @return HasMany<Department, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('name');
    }

    /**
     * @return HasMany<Server, $this>
     */
    public function servers(): HasMany
    {
        return $this->hasMany(Server::class);
    }

    /**
     * @return HasMany<ActiveDirectoryUser, $this>
     */
    public function activeDirectoryUsers(): HasMany
    {
        return $this->hasMany(ActiveDirectoryUser::class);
    }

    /**
     * @param  Builder<Department>  $query
     * @return Builder<Department>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (blank($search)) {
            return $query;
        }

        return $query->where('name', 'like', '%'.$search.'%');
    }

    /**
     * Flat select options with indentation depth (excludes a department and its descendants).
     *
     * @return list<array{id: int, name: string, label: string, parent_id: int|null, depth: int}>
     */
    public static function optionsForSelect(?int $excludeId = null): array
    {
        /** @var Collection<int, Department> $departments */
        $departments = self::query()
            ->orderBy('name')
            ->get(['id', 'name', 'parent_id']);

        $excludeIds = $excludeId === null
            ? []
            : array_merge([$excludeId], self::descendantIdsOf($excludeId, $departments));

        $byParent = $departments
            ->reject(fn (Department $department) => in_array($department->id, $excludeIds, true))
            ->groupBy(fn (Department $department) => $department->parent_id ?? 0);

        $options = [];

        $walk = function (int|string $parentKey, int $depth) use (&$walk, &$options, $byParent): void {
            /** @var Collection<int, Department> $children */
            $children = $byParent->get($parentKey, collect());

            foreach ($children as $department) {
                $prefix = $depth > 0 ? str_repeat('— ', $depth) : '';
                $options[] = [
                    'id' => $department->id,
                    'name' => $department->name,
                    'label' => $prefix.$department->name,
                    'parent_id' => $department->parent_id,
                    'depth' => $depth,
                ];
                $walk($department->id, $depth + 1);
            }
        };

        $walk(0, 0);

        return $options;
    }

    /**
     * @param  Collection<int, Department>|null  $departments
     * @return list<int>
     */
    public static function descendantIdsOf(int $departmentId, ?Collection $departments = null): array
    {
        $departments ??= self::query()->get(['id', 'parent_id']);
        $byParent = $departments->groupBy(fn (Department $department) => $department->parent_id ?? 0);
        $ids = [];

        $walk = function (int $parentId) use (&$walk, &$ids, $byParent): void {
            /** @var Collection<int, Department> $children */
            $children = $byParent->get($parentId, collect());

            foreach ($children as $child) {
                $ids[] = $child->id;
                $walk($child->id);
            }
        };

        $walk($departmentId);

        return $ids;
    }

    /**
     * Whether assigning $parentId to $departmentId would create a cycle.
     */
    public static function wouldCreateCycle(int $departmentId, ?int $parentId): bool
    {
        if ($parentId === null) {
            return false;
        }

        if ($parentId === $departmentId) {
            return true;
        }

        return in_array(
            $parentId,
            self::descendantIdsOf($departmentId),
            true,
        );
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public function ancestryPath(): array
    {
        $path = [];
        $current = $this;
        $guard = 0;

        while ($current !== null && $guard < 50) {
            array_unshift($path, [
                'id' => $current->id,
                'name' => $current->name,
            ]);
            $current = $current->parent_id
                ? self::query()->find($current->parent_id, ['id', 'name', 'parent_id'])
                : null;
            $guard++;
        }

        return $path;
    }

    public function pathLabel(string $separator = ' › '): string
    {
        return collect($this->ancestryPath())->pluck('name')->implode($separator);
    }
}
