<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$dataDir = '../data/';

try {
    $response = [];
    
    // Carregar configurações
    $configFile = $dataDir . 'config.json';
    if (file_exists($configFile)) {
        $response['config'] = json_decode(file_get_contents($configFile), true);
    }
    
    // Carregar produtos
    $produtosFile = $dataDir . 'produtos.json';
    if (file_exists($produtosFile)) {
        $response['produtos'] = json_decode(file_get_contents($produtosFile), true);
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar: ' . $e->getMessage()]);
}
?>
