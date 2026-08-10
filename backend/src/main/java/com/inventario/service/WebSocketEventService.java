package com.inventario.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventService {

    private final SimpMessagingTemplate messagingTemplate;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    private void notify(String topic, String tipo, String action, Object data) {
        try {
            Map<String, Object> event = new LinkedHashMap<>();
            event.put("tipo", tipo);
            event.put("acao", action != null ? action : "UNKNOWN");
            event.put("dados", data != null ? data : Map.of());
            event.put("timestamp", LocalDateTime.now().format(FORMATTER));
            messagingTemplate.convertAndSend(topic, event);
            log.debug("WS notify {}: {}", topic, action);
        } catch (Exception e) {
            log.warn("Falha ao enviar notificacao WS para {}: {}", topic, e.getMessage());
        }
    }

    public void notifyComputadores(String action, Object data) {
        notify("/topic/computadores", "COMPUTADOR", action, data);
    }

    public void notifyManutencoes(String action, Object data) {
        notify("/topic/manutencoes", "MANUTENCAO", action, data);
    }

    public void notifyOrdensServico(String action, Object data) {
        notify("/topic/ordens-servico", "ORDEM_SERVICO", action, data);
    }

    public void notifyCheckinCheckout(String action, Object data) {
        notify("/topic/checkin-checkout", "CHECKIN_CHECKOUT", action, data);
    }

    public void notifyDepartamentos(String action, Object data) {
        notify("/topic/departamentos", "DEPARTAMENTO", action, data);
    }

    public void notifyUsuarios(String action, Object data) {
        notify("/topic/usuarios", "USUARIO", action, data);
    }

    public void notifyLogs(String action, Object data) {
        notify("/topic/logs", "LOG", action, data);
    }

    public void notifySoftwareLicencas(String action, Object data) {
        notify("/topic/software-licencas", "SOFTWARE_LICENCA", action, data);
    }

    public void notifyFornecedores(String action, Object data) {
        notify("/topic/fornecedores", "FORNECEDOR", action, data);
    }
}
