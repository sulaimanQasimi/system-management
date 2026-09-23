<?php

namespace App\Enums;

enum ServerStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Maintenance = 'maintenance';
    case Decommissioned = 'decommissioned';

    public function label(): string
    {
        return match ($this) {
            self::Active => __('Active'),
            self::Inactive => __('Inactive'),
            self::Maintenance => __('Maintenance'),
            self::Decommissioned => __('Decommissioned'),
        };
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            self::cases(),
        );
    }
}
