<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('produtos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->string('nome');
            $table->text('descricao')->nullable();
            $table->decimal('preco', 10, 2);
            $table->integer('estoque')->default(0);
            $table->string('categoria')->nullable();
            $table->timestamps();
            
            // index pra consulta ficar mais rapida
            $table->index(['cliente_id', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('produtos');
    }
};