<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit;
}

$dataDir = '../data/';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

try {
    // Salvar configurações principais
    if (isset($input['config'])) {
        $configFile = $dataDir . 'config.json';
        file_put_contents($configFile, json_encode($input['config'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        // Criar backup em formato .ini
        createIniBackup($input['config'], $dataDir . 'config-backup.ini');
    }
    
    // Salvar produtos
    if (isset($input['produtos'])) {
        $produtosFile = $dataDir . 'produtos.json';
        file_put_contents($produtosFile, json_encode($input['produtos'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        // Criar backup em formato .txt
        createTxtBackup($input['produtos'], $dataDir . 'produtos-backup.txt');
    }
    
    // Log da alteração
    $logFile = $dataDir . 'changes.log';
    $logEntry = date('Y-m-d H:i:s') . " - Configurações atualizadas\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    
    echo json_encode(['success' => true, 'message' => 'Configurações salvas com sucesso']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao salvar: ' . $e->getMessage()]);
}

function createIniBackup($config, $filename) {
    $iniContent = "; Backup das Configurações - " . date('Y-m-d H:i:s') . "\n\n";
    
    // Empresa
    $iniContent .= "[EMPRESA]\n";
    $iniContent .= "nome = \"" . $config['empresa']['nome'] . "\"\n";
    $iniContent .= "telefone = \"" . $config['empresa']['telefone'] . "\"\n";
    $iniContent .= "endereco = \"" . $config['empresa']['endereco'] . "\"\n";
    $iniContent .= "instagram = \"" . $config['empresa']['instagram'] . "\"\n";
    $iniContent .= "facebook = \"" . $config['empresa']['facebook'] . "\"\n\n";
    
    // Horários
    $iniContent .= "[HORARIOS]\n";
    $iniContent .= "ativo = " . ($config['horarioFuncionamento']['ativo'] ? 'true' : 'false') . "\n";
    foreach ($config['horarioFuncionamento']['horarios'] as $dia => $horario) {
        $iniContent .= $dia . "_aberto = " . ($horario['aberto'] ? 'true' : 'false') . "\n";
        $iniContent .= $dia . "_abertura = \"" . $horario['abertura'] . "\"\n";
        $iniContent .= $dia . "_fechamento = \"" . $horario['fechamento'] . "\"\n";
    }
    $iniContent .= "\n";
    
    // Pagamento
    $iniContent .= "[PAGAMENTO]\n";
    $iniContent .= "pix_ativo = " . ($config['pagamento']['pix']['ativo'] ? 'true' : 'false') . "\n";
    $iniContent .= "pix_chave = \"" . $config['pagamento']['pix']['chave'] . "\"\n";
    $iniContent .= "dinheiro_ativo = " . ($config['pagamento']['dinheiro']['ativo'] ? 'true' : 'false') . "\n";
    $iniContent .= "cartao_ativo = " . ($config['pagamento']['cartao']['ativo'] ? 'true' : 'false') . "\n";
    $iniContent .= "delivery_ativo = " . ($config['pagamento']['delivery']['ativo'] ? 'true' : 'false') . "\n";
    $iniContent .= "delivery_taxa = " . $config['pagamento']['delivery']['taxa'] . "\n";
    $iniContent .= "delivery_tempo = \"" . $config['pagamento']['delivery']['tempoEntrega'] . "\"\n";
    
    file_put_contents($filename, $iniContent);
}

function createTxtBackup($produtos, $filename) {
    $txtContent = "BACKUP DOS PRODUTOS - " . date('Y-m-d H:i:s') . "\n";
    $txtContent .= str_repeat("=", 50) . "\n\n";
    
    foreach ($produtos as $categoria => $itens) {
        $txtContent .= strtoupper($categoria) . ":\n";
        $txtContent .= str_repeat("-", 20) . "\n";
        
        foreach ($itens as $item) {
            $txtContent .= "• " . $item['name'] . "\n";
            $txtContent .= "  Preço: R$ " . number_format($item['price'], 2, ',', '.') . "\n";
            $txtContent .= "  Descrição: " . $item['description'] . "\n";
            $txtContent .= "  Disponível: " . ($item['disponivel'] ? 'SIM' : 'NÃO') . "\n\n";
        }
        $txtContent .= "\n";
    }
    
    file_put_contents($filename, $txtContent);
}
?>
