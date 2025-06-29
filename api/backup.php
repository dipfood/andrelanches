<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataDir = '../data/';
$backupDir = $dataDir . 'backups/';

if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

$timestamp = date('Y-m-d_H-i-s');

try {
    // Criar backup completo
    $backupData = [];
    
    if (file_exists($dataDir . 'config.json')) {
        $backupData['config'] = json_decode(file_get_contents($dataDir . 'config.json'), true);
    }
    
    if (file_exists($dataDir . 'produtos.json')) {
        $backupData['produtos'] = json_decode(file_get_contents($dataDir . 'produtos.json'), true);
    }
    
    // Salvar backup JSON
    $backupFile = $backupDir . 'backup_' . $timestamp . '.json';
    file_put_contents($backupFile, json_encode($backupData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    // Criar backup legível em TXT
    $txtBackup = $backupDir . 'backup_' . $timestamp . '.txt';
    createReadableBackup($backupData, $txtBackup);
    
    echo json_encode([
        'success' => true,
        'message' => 'Backup criado com sucesso',
        'files' => [
            'json' => 'backups/backup_' . $timestamp . '.json',
            'txt' => 'backups/backup_' . $timestamp . '.txt'
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao criar backup: ' . $e->getMessage()]);
}

function createReadableBackup($data, $filename) {
    $content = "BACKUP COMPLETO DO CARDÁPIO DIGITAL\n";
    $content .= "Data: " . date('d/m/Y H:i:s') . "\n";
    $content .= str_repeat("=", 60) . "\n\n";
    
    if (isset($data['config'])) {
        $config = $data['config'];
        
        $content .= "INFORMAÇÕES DA EMPRESA:\n";
        $content .= "Nome: " . $config['empresa']['nome'] . "\n";
        $content .= "Telefone: " . $config['empresa']['telefone'] . "\n";
        $content .= "Endereço: " . $config['empresa']['endereco'] . "\n";
        $content .= "Instagram: " . $config['empresa']['instagram'] . "\n";
        $content .= "Facebook: " . $config['empresa']['facebook'] . "\n\n";
        
        $content .= "HORÁRIOS DE FUNCIONAMENTO:\n";
        $content .= "Sistema ativo: " . ($config['horarioFuncionamento']['ativo'] ? 'SIM' : 'NÃO') . "\n";
        $dias = [
            'segunda' => 'Segunda-feira',
            'terca' => 'Terça-feira',
            'quarta' => 'Quarta-feira',
            'quinta' => 'Quinta-feira',
            'sexta' => 'Sexta-feira',
            'sabado' => 'Sábado',
            'domingo' => 'Domingo'
        ];
        
        foreach ($config['horarioFuncionamento']['horarios'] as $dia => $horario) {
            $content .= $dias[$dia] . ": ";
            if ($horario['aberto']) {
                $content .= $horario['abertura'] . " às " . $horario['fechamento'];
            } else {
                $content .= "FECHADO";
            }
            $content .= "\n";
        }
        $content .= "\n";
        
        $content .= "FORMAS DE PAGAMENTO:\n";
        $content .= "PIX: " . ($config['pagamento']['pix']['ativo'] ? 'ATIVO' : 'INATIVO');
        if ($config['pagamento']['pix']['ativo']) {
            $content .= " - Chave: " . $config['pagamento']['pix']['chave'];
        }
        $content .= "\n";
        $content .= "Dinheiro: " . ($config['pagamento']['dinheiro']['ativo'] ? 'ATIVO' : 'INATIVO') . "\n";
        $content .= "Cartão: " . ($config['pagamento']['cartao']['ativo'] ? 'ATIVO' : 'INATIVO') . "\n";
        $content .= "Delivery: " . ($config['pagamento']['delivery']['ativo'] ? 'ATIVO' : 'INATIVO');
        if ($config['pagamento']['delivery']['ativo']) {
            $content .= " - Taxa: R$ " . number_format($config['pagamento']['delivery']['taxa'], 2, ',', '.');
            $content .= " - Tempo: " . $config['pagamento']['delivery']['tempoEntrega'];
        }
        $content .= "\n\n";
    }
    
    if (isset($data['produtos'])) {
        $content .= "PRODUTOS DO CARDÁPIO:\n";
        $content .= str_repeat("-", 40) . "\n\n";
        
        foreach ($data['produtos'] as $categoria => $produtos) {
            $content .= strtoupper($categoria) . ":\n";
            foreach ($produtos as $produto) {
                $content .= "• " . $produto['name'] . " - R$ " . number_format($produto['price'], 2, ',', '.');
                $content .= " [" . ($produto['disponivel'] ? 'DISPONÍVEL' : 'INDISPONÍVEL') . "]\n";
                $content .= "  " . $produto['description'] . "\n\n";
            }
        }
    }
    
    file_put_contents($filename, $content);
}
?>
