<?php

use App\Models\ActiveDirectoryUser;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (ActiveDirectoryUser::LEGACY_EMAIL_DOMAINS as $legacyDomain) {
            DB::table('active_directory_users')
                ->where('email', 'like', '%@'.$legacyDomain)
                ->update([
                    'email' => DB::raw(
                        "REPLACE(email, '@{$legacyDomain}', '@".ActiveDirectoryUser::EMAIL_DOMAIN."')"
                    ),
                ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Irreversible: multiple legacy domains collapsed into mod.gov.af.
    }
};
