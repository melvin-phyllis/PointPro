<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Créer la table des entreprises (tenants).
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->string('email', 255);
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('logo_path', 500)->nullable();
            // Paramètres de l'entreprise (horaires, tolérance, etc.)
            $table->json('settings')->nullable();
            $table->enum('plan', ['starter', 'business', 'enterprise', 'custom'])->default('starter');
            $table->timestamp('subscription_ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Supprimer la table des entreprises.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
