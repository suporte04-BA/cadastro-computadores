package com.inventario.controller;

import com.inventario.service.PdfReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class PdfReportController {

    private final PdfReportService pdfService;

    @GetMapping("/pdf/relatorio-geral")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<byte[]> relatorioGeral() {
        byte[] pdf = pdfService.gerarRelatorioGeral();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
            .filename("Relatorio_Geral_Inventario_TI.pdf")
            .build());
        headers.setContentLength(pdf.length);
        headers.setCacheControl(CacheControl.noCache().mustRevalidate());

        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }
}
