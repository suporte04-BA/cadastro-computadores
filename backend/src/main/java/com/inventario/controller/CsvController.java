package com.inventario.controller;

import com.inventario.dto.ComputadorDTO;
import com.inventario.exception.RegraNegocioException;
import com.inventario.service.ComputadorService;
import com.inventario.service.LogAtividadeService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/computadores")
@RequiredArgsConstructor
public class CsvController {

    private final ComputadorService computadorService;
    private final LogAtividadeService logService;

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public void exportCsv(HttpServletResponse response) throws Exception {
        response.setContentType("text/csv;charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=computadores_export.csv");

        PrintWriter writer = response.getWriter();
        writer.println("Nome PC,Modelo/Marca,Numero Serie,Usuario Designado,Departamento,Status,IP,Data Aquisicao,Localizacao,SO");

        computadorService.listarTodos().forEach(c -> {
            writer.println(join(
                c.getNomePc(),
                c.getModeloMarca(),
                c.getNumeroSerie(),
                c.getUsuarioDesignado() != null ? c.getUsuarioDesignado() : "",
                c.getDepartamento() != null ? c.getDepartamento() : "",
                c.getStatus() != null ? c.getStatus() : "",
                c.getIpAddress() != null ? c.getIpAddress() : "",
                c.getDataAquisicao() != null ? c.getDataAquisicao().toString() : "",
                c.getLocalizacao() != null ? c.getLocalizacao() : "",
                c.getSistemaOperacional() != null ? c.getSistemaOperacional() : ""
            ));
        });
        writer.flush();
    }

    @PostMapping("/import/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> importCsv(@RequestParam("file") MultipartFile file, Authentication auth) {
        Map<String, Object> result = new HashMap<>();
        int imported = 0, skipped = 0, errors = 0;
        List<String> errorMessages = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean header = true;
            while ((line = reader.readLine()) != null) {
                if (header) { header = false; continue; }
                String[] parts = line.split(",", -1);
                if (parts.length < 2) { errors++; errorMessages.add("Linha com menos de 2 colunas: " + line); continue; }

                try {
                    ComputadorDTO dto = new ComputadorDTO();
                    dto.setNomePc(parts.length > 0 ? parts[0].trim() : "");
                    dto.setModeloMarca(parts.length > 1 ? parts[1].trim() : "");
                    dto.setNumeroSerie(parts.length > 2 ? parts[2].trim() : "");
                    dto.setUsuarioDesignado(parts.length > 3 ? parts[3].trim() : null);
                    dto.setDepartamento(parts.length > 4 ? parts[4].trim() : null);
                    dto.setStatus(parts.length > 5 ? parts[5].trim() : "ATIVO");
                    dto.setIpAddress(parts.length > 6 ? parts[6].trim() : null);
                    dto.setDataAquisicao(parts.length > 7 && !parts[7].trim().isEmpty() ? LocalDate.parse(parts[7].trim()) : null);
                    dto.setLocalizacao(parts.length > 8 ? parts[8].trim() : null);
                    dto.setSistemaOperacional(parts.length > 9 ? parts[9].trim() : null);
                    dto.setProcessador(parts.length > 10 ? parts[10].trim() : "N/D");
                    dto.setMemoriaRam(parts.length > 11 ? parts[11].trim() : "N/D");
                    dto.setArmazenamento(parts.length > 12 ? parts[12].trim() : "N/D");

                    if (dto.getNomePc().isEmpty()) { skipped++; continue; }

                    try {
                        computadorService.cadastrar(dto);
                        imported++;
                    } catch (RegraNegocioException e) {
                        if (e.getMessage().contains("ja cadastrado")) {
                            skipped++;
                        } else {
                            errors++;
                            errorMessages.add("Erro na linha: " + e.getMessage());
                        }
                    }
                } catch (Exception e) {
                    errors++;
                    errorMessages.add("Erro na linha: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Erro ao ler CSV: " + e.getMessage()));
        }

        logService.registrar(auth.getName(), "IMPORTACAO", "COMPUTADOR", null,
            "Importacao CSV: " + imported + " importados, " + skipped + " ignorados, " + errors + " erros");

        result.put("importados", imported);
        result.put("ignorados", skipped);
        result.put("erros", errors);
        result.put("mensagensErro", errorMessages.stream().limit(10).toList());
        return ResponseEntity.ok(result);
    }

    private String join(String... vals) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < vals.length; i++) {
            if (i > 0) sb.append(",");
            String v = vals[i] != null ? vals[i] : "";
            v = sanitizeCsvValue(v);
            if (v.contains(",") || v.contains("\"") || v.contains("\n")) {
                sb.append("\"").append(v.replace("\"", "\"\"")).append("\"");
            } else {
                sb.append(v);
            }
        }
        return sb.toString();
    }

    private String sanitizeCsvValue(String v) {
        if (v.isEmpty()) return v;
        char first = v.charAt(0);
        if (first == '=' || first == '+' || first == '-' || first == '@' || first == '\t') {
            return "'" + v;
        }
        return v;
    }
}