<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('servers', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->index();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->foreignId('server_model_id')->constrained()->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('ip_address', 45)->index();
            $table->string('subnet_mask', 45)->nullable();
            $table->string('default_gateway', 45)->nullable();
            $table->text('description')->nullable();
            $table->foreignId('it_support_id')->nullable()->constrained('it_supports')->nullOnDelete();
            $table->string('it_support_phone')->nullable();
            $table->string('idrac_ip_address', 45)->nullable()->index();
            $table->string('idrac_subnet_mask', 45)->nullable();
            $table->string('idrac_default_gateway', 45)->nullable();
            $table->string('username')->nullable();
            $table->text('password')->nullable();
            $table->string('status')->default('active')->index();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['name', 'site_name']);
            $table->index('created_at');
        });

        Schema::create('server_server_service', function (Blueprint $table) {
            $table->id();
            $table->foreignId('server_id')->constrained()->cascadeOnDelete();
            $table->foreignId('server_service_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['server_id', 'server_service_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server_server_service');
        Schema::dropIfExists('servers');
    }
};
