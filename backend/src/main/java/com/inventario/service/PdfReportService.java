package com.inventario.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PdfReportService {

    private final ComputadorService computadorService;
    private final ManutencaoService manutencaoService;
    private final OrdemServicoService ordemServicoService;

    private static final Color COR_PRINCIPAL = new Color(0, 184, 158);
    private static final Color COR_ESCURO = new Color(10, 22, 40);
    private static final Color COR_TEXTO = new Color(51, 65, 85);
    private static final Color COR_CINZA = new Color(100, 116, 139);
    private static final Color COR_HEADER_BG = new Color(13, 31, 60);
    private static final Color COR_LINHA = new Color(226, 232, 240);
    private static final Color COR_BG_ALT = new Color(248, 250, 252);
    private static final Color COR_VERMELHO = new Color(220, 38, 38);
    private static final Color COR_AMARELO = new Color(217, 119, 6);

    public byte[] gerarRelatorioGeral() {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 20, 20, 20, 20);

        try {
            PdfWriter writer = PdfWriter.getInstance(doc, baos);
            doc.open();

            String agora = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));

            // Coletar dados
            var comps = computadorService.listarTodos();
            var estatComp = computadorService.estatisticas();
            var estatMan = manutencaoService.estatisticas();
            var estatOS = ordemServicoService.estatisticas();

            long totalComps = ((Number) estatComp.getOrDefault("total", 0)).longValue();
            long ativos = ((Number) estatComp.getOrDefault("ativos", 0)).longValue();
            long manVencida = ((Number) estatComp.getOrDefault("manutencaoVencida", 0)).longValue();
            long pendentes = ((Number) estatMan.getOrDefault("pendentes", 0)).longValue();
            long emAndamento = ((Number) estatMan.getOrDefault("emAndamento", 0)).longValue();
            long concluidasMan = ((Number) estatMan.getOrDefault("concluidas", 0)).longValue();
            long canceladasMan = ((Number) estatMan.getOrDefault("canceladas", 0)).longValue();
            long totalMan = ((Number) estatMan.getOrDefault("total", 0)).longValue();
            long abertasOS = ((Number) estatOS.getOrDefault("abertas", 0)).longValue();
            long emAnaliseOS = ((Number) estatOS.getOrDefault("emAnalise", 0)).longValue();
            long emExecucaoOS = ((Number) estatOS.getOrDefault("emExecucao", 0)).longValue();
            long concluidasOS = ((Number) estatOS.getOrDefault("concluidas", 0)).longValue();
            long canceladasOS = ((Number) estatOS.getOrDefault("canceladas", 0)).longValue();
            long totalOS = ((Number) estatOS.getOrDefault("total", 0)).longValue();

            // ===== HEADER =====
            PdfPTable headerTable = new PdfPTable(1);
            headerTable.setWidthPercentage(100);
            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(new Color(COR_ESCURO.getRed(), COR_ESCURO.getGreen(), COR_ESCURO.getBlue()));
            headerCell.setPadding(20);
            headerCell.setBorder(0);

            Paragraph title = new Paragraph("RELATORIO GERAL - INVENTARIO DE TI", new Font(Font.HELVETICA, 18, Font.BOLD, new Color(0, 229, 199)));
            title.setSpacingAfter(4);
            headerCell.addElement(title);

            Paragraph subtitle = new Paragraph("Sistema de Gestao de Inventario de Equipamentos", new Font(Font.HELVETICA, 9, Font.NORMAL, new Color(136, 146, 168)));
            subtitle.setSpacingAfter(3);
            headerCell.addElement(subtitle);

            Paragraph dateP = new Paragraph("Gerado em: " + agora, new Font(Font.HELVETICA, 8, Font.NORMAL, new Color(90, 106, 138)));
            headerCell.addElement(dateP);

            headerTable.addCell(headerCell);
            doc.add(headerTable);

            // Barra decorativa
            PdfPTable barra = new PdfPTable(1);
            barra.setWidthPercentage(100);
            PdfPCell barraCell = new PdfPCell();
            barraCell.setBackgroundColor(COR_PRINCIPAL);
            barraCell.setFixedHeight(3);
            barraCell.setBorder(0);
            barra.addCell(barraCell);
            doc.add(barra);
            doc.add(new Paragraph(" "));

            // ===== 1. RESUMO EXECUTIVO =====
            addSectionTitle(doc, "1. RESUMO EXECUTIVO");

            PdfPTable kpiTable = new PdfPTable(4);
            kpiTable.setWidthPercentage(100);
            kpiTable.setSpacingBefore(6);
            kpiTable.setSpacingAfter(10);
            float[] kpiWidths = {25f, 25f, 25f, 25f};
            kpiTable.setWidths(kpiWidths);

            addKpiCell(kpiTable, String.valueOf(totalComps), "TOTAL EQUIP.", COR_PRINCIPAL);
            addKpiCell(kpiTable, String.valueOf(ativos), "ATIVOS", new Color(22, 163, 74));
            addKpiCell(kpiTable, String.valueOf(manVencida + pendentes + emAndamento), "EM MANUTENCAO", COR_AMARELO);
            addKpiCell(kpiTable, String.valueOf(abertasOS + emAnaliseOS), "OS ABERTAS", new Color(8, 145, 178));

            PdfPTable kpiTable2 = new PdfPTable(4);
            kpiTable2.setWidthPercentage(100);
            kpiTable2.setSpacingAfter(12);
            kpiTable2.setWidths(kpiWidths);

            addKpiCell(kpiTable2, String.valueOf(totalMan), "TOTAL MANUT.", new Color(124, 58, 237));
            addKpiCell(kpiTable2, String.valueOf(concluidasMan), "CONCLUIDAS", new Color(22, 163, 74));
            addKpiCell(kpiTable2, String.valueOf(canceladasMan), "CANCELADAS", COR_VERMELHO);
            addKpiCell(kpiTable2, String.valueOf(totalOS), "TOTAL OS", new Color(234, 88, 12));

            doc.add(kpiTable);
            doc.add(kpiTable2);

            // ===== 2. LISTAGEM DE COMPUTADORES =====
            addSectionTitle(doc, "2. LISTAGEM DE EQUIPAMENTOS (" + comps.size() + " registros)");

            if (!comps.isEmpty()) {
                PdfPTable compTable = new PdfPTable(5);
                compTable.setWidthPercentage(100);
                compTable.setSpacingBefore(6);
                float[] compWidths = {8f, 25f, 25f, 22f, 20f};
                compTable.setWidths(compWidths);

                addTableHeader(compTable, new String[]{"#", "NOME PC", "MODELO / MARCA", "RESPONSAVEL", "STATUS"});
                for (var c : comps) {
                    compTable.addCell(createCell(String.valueOf(c.getId()), 8));
                    compTable.addCell(createBoldCell(c.getNomePc() != null ? c.getNomePc() : "-", 8));
                    compTable.addCell(createCell(c.getModeloMarca() != null ? c.getModeloMarca() : "-", 8));
                    compTable.addCell(createCell(c.getUsuarioDesignado() != null ? c.getUsuarioDesignado() : "-", 8));
                    compTable.addCell(createBadgeCell(c.getStatus() != null ? c.getStatus().replace("_", " ") : "-", c.getStatus()));
                }
                doc.add(compTable);
            }

            // ===== 3. MANUTENCOES =====
            doc.newPage();
            addSectionTitle(doc, "3. MANUTENCOES");

            PdfPTable manKpiTable = new PdfPTable(5);
            manKpiTable.setWidthPercentage(100);
            manKpiTable.setSpacingBefore(6);
            manKpiTable.setSpacingAfter(10);
            float[] manKpiWidths = {20f, 20f, 20f, 20f, 20f};
            manKpiTable.setWidths(manKpiWidths);

            addKpiCell(manKpiTable, String.valueOf(totalMan), "TOTAL", new Color(124, 58, 237));
            addKpiCell(manKpiTable, String.valueOf(pendentes), "PENDENTES", COR_AMARELO);
            addKpiCell(manKpiTable, String.valueOf(emAndamento), "EM ANDAMENTO", new Color(8, 145, 178));
            addKpiCell(manKpiTable, String.valueOf(concluidasMan), "CONCLUIDAS", new Color(22, 163, 74));
            addKpiCell(manKpiTable, String.valueOf(canceladasMan), "CANCELADAS", COR_VERMELHO);

            doc.add(manKpiTable);

            // Manutencao por tipo
            var porTipo = (Map<String, Long>) estatMan.getOrDefault("porTipo", Map.of());
            if (!porTipo.isEmpty()) {
                addSubTitle(doc, "Distribuicao por Tipo");
                PdfPTable tipoTable = new PdfPTable(3);
                tipoTable.setWidthPercentage(60);
                tipoTable.setSpacingBefore(4);
                tipoTable.setSpacingAfter(10);
                tipoTable.setWidths(new float[]{40f, 20f, 40f});

                addTableHeader(tipoTable, new String[]{"TIPO", "QTD", "PERCENTUAL"});
                long totalTipo = porTipo.values().stream().mapToLong(Long::longValue).sum();
                for (var entry : porTipo.entrySet()) {
                    String tipo = entry.getKey().replace("_", " ");
                    long qtd = entry.getValue();
                    String pct = totalTipo > 0 ? Math.round(qtd * 100.0 / totalTipo) + "%" : "0%";
                    tipoTable.addCell(createCell(tipo, 9));
                    tipoTable.addCell(createCell(String.valueOf(qtd), 9));
                    tipoTable.addCell(createCell(pct, 9));
                }
                doc.add(tipoTable);
            }

            // ===== 4. ORDENS DE SERVICO =====
            addSectionTitle(doc, "4. ORDENS DE SERVICO");

            PdfPTable osKpiTable = new PdfPTable(5);
            osKpiTable.setWidthPercentage(100);
            osKpiTable.setSpacingBefore(6);
            osKpiTable.setSpacingAfter(10);
            osKpiTable.setWidths(manKpiWidths);

            addKpiCell(osKpiTable, String.valueOf(totalOS), "TOTAL", new Color(234, 88, 12));
            addKpiCell(osKpiTable, String.valueOf(abertasOS), "ABERTAS", new Color(8, 145, 178));
            addKpiCell(osKpiTable, String.valueOf(emAnaliseOS), "EM ANALISE", COR_AMARELO);
            addKpiCell(osKpiTable, String.valueOf(concluidasOS), "CONCLUIDAS", new Color(22, 163, 74));
            addKpiCell(osKpiTable, String.valueOf(canceladasOS), "CANCELADAS", COR_VERMELHO);

            doc.add(osKpiTable);

            // OS por prioridade
            var porPrioridade = (Map<String, Long>) estatOS.getOrDefault("porPrioridade", Map.of());
            if (!porPrioridade.isEmpty()) {
                addSubTitle(doc, "Distribuicao por Prioridade");
                PdfPTable priTable = new PdfPTable(3);
                priTable.setWidthPercentage(60);
                priTable.setSpacingBefore(4);
                priTable.setSpacingAfter(10);
                priTable.setWidths(new float[]{40f, 20f, 40f});

                addTableHeader(priTable, new String[]{"PRIORIDADE", "QTD", "PERCENTUAL"});
                long totalPri = porPrioridade.values().stream().mapToLong(Long::longValue).sum();
                for (var entry : porPrioridade.entrySet()) {
                    String pri = entry.getKey();
                    long qtd = entry.getValue();
                    String pct = totalPri > 0 ? Math.round(qtd * 100.0 / totalPri) + "%" : "0%";
                    priTable.addCell(createCell(pri, 9));
                    priTable.addCell(createCell(String.valueOf(qtd), 9));
                    priTable.addCell(createCell(pct, 9));
                }
                doc.add(priTable);
            }

            // ===== 5. DISTRIBUICAO POR DEPARTAMENTO =====
            doc.newPage();
            addSectionTitle(doc, "5. DISTRIBUICAO POR DEPARTAMENTO");

            Map<String, Long> deptoMap = new LinkedHashMap<>();
            for (var c : comps) {
                String depto = c.getDepartamento() != null ? c.getDepartamento() : "Sem Departamento";
                deptoMap.merge(depto, 1L, Long::sum);
            }

            if (!deptoMap.isEmpty()) {
                long maxDepts = deptoMap.values().stream().mapToLong(Long::longValue).max().orElse(1);
                PdfPTable deptoTable = new PdfPTable(3);
                deptoTable.setWidthPercentage(100);
                deptoTable.setSpacingBefore(6);
                deptoTable.setWidths(new float[]{25f, 60f, 15f});

                addTableHeader(deptoTable, new String[]{"DEPARTAMENTO", "DISTRIBUICAO", "QTD"});
                for (var entry : deptoMap.entrySet()) {
                    deptoTable.addCell(createBoldCell(entry.getKey(), 9));
                    deptoTable.addCell(createBarCell(entry.getValue(), maxDepts));
                    deptoTable.addCell(createCell(String.valueOf(entry.getValue()), 9));
                }
                doc.add(deptoTable);
            }

            // ===== 6. GARANTIAS E ALERTAS =====
            addSectionTitle(doc, "6. GARANTIAS E ALERTAS");

            PdfPTable alertasTable = new PdfPTable(2);
            alertasTable.setWidthPercentage(100);
            alertasTable.setSpacingBefore(6);
            alertasTable.setWidths(new float[]{50f, 50f});

            PdfPCell tituloVencida = new PdfPCell(new Phrase("Garantias Vencidas", new Font(Font.HELVETICA, 10, Font.BOLD, COR_VERMELHO)));
            tituloVencida.setBorder(0);
            tituloVencida.setPadding(8);
            tituloVencida.setBackgroundColor(new Color(254, 226, 226));

            PdfPCell tituloProxima = new PdfPCell(new Phrase("Garantias Vencendo em Breve", new Font(Font.HELVETICA, 10, Font.BOLD, COR_AMARELO)));
            tituloProxima.setBorder(0);
            tituloProxima.setPadding(8);
            tituloProxima.setBackgroundColor(new Color(254, 243, 199));

            alertasTable.addCell(tituloVencida);
            alertasTable.addCell(tituloProxima);

            PdfPCell vencidaContent = new PdfPCell();
            vencidaContent.setBorder(0);
            vencidaContent.setPadding(8);
            vencidaContent.addElement(new Paragraph("Nenhuma garantia vencida.", new Font(Font.HELVETICA, 9, Font.ITALIC, COR_CINZA)));

            PdfPCell proximaContent = new PdfPCell();
            proximaContent.setBorder(0);
            proximaContent.setPadding(8);
            proximaContent.addElement(new Paragraph("Nenhuma garantia vencendo em breve.", new Font(Font.HELVETICA, 9, Font.ITALIC, COR_CINZA)));

            alertasTable.addCell(vencidaContent);
            alertasTable.addCell(proximaContent);

            doc.add(alertasTable);

            // ===== FOOTER =====
            doc.add(new Paragraph(" "));
            PdfPTable footerTable = new PdfPTable(1);
            footerTable.setWidthPercentage(100);
            PdfPCell footerCell = new PdfPCell();
            footerCell.setBackgroundColor(COR_ESCURO);
            footerCell.setPadding(12);
            footerCell.setBorder(0);

            Paragraph footerText = new Paragraph("Inventario de TI  |  Relatorio Gerencial  |  " + agora,
                new Font(Font.HELVETICA, 8, Font.NORMAL, new Color(90, 106, 138)));
            footerCell.addElement(footerText);
            footerTable.addCell(footerCell);
            doc.add(footerTable);

            // Close document first to flush complete PDF to baos
            doc.close();

            // Add page numbers via PdfStamper
            byte[] pdfBytes = baos.toByteArray();
            ByteArrayOutputStream finalBaos = new ByteArrayOutputStream();
            PdfReader reader = new PdfReader(pdfBytes);
            PdfStamper stamper = new PdfStamper(reader, finalBaos);
            int totalPdfPages = reader.getNumberOfPages();

            for (int i = 1; i <= totalPdfPages; i++) {
                PdfContentByte cb = stamper.getUnderContent(i);
                cb.beginText();
                cb.setFontAndSize(BaseFont.createFont(BaseFont.HELVETICA, BaseFont.WINANSI, false), 7);
                cb.setColorFill(new Color(100, 116, 139));
                cb.showTextAligned(PdfContentByte.ALIGN_LEFT, "Pagina " + i + " de " + totalPdfPages, 20, 10, 0);
                cb.showTextAligned(PdfContentByte.ALIGN_RIGHT, "Inventario de TI - Relatorio Gerencial", PageSize.A4.getWidth() - 20, 10, 0);
                cb.endText();
            }

            stamper.close();
            reader.close();

            return finalBaos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar relatorio PDF: " + e.getMessage(), e);
        }
    }

    private void addSectionTitle(Document doc, String title) throws DocumentException {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);
        table.setSpacingBefore(14);
        table.setSpacingAfter(6);
        PdfPCell cell = new PdfPCell(new Phrase(title, new Font(Font.HELVETICA, 12, Font.BOLD, new Color(0, 100, 90))));
        cell.setBackgroundColor(new Color(240, 250, 248));
        cell.setBorder(0);
        cell.setPadding(8);
        cell.setBorderColorLeft(COR_PRINCIPAL);
        cell.setBorderWidthLeft(4);
        table.addCell(cell);
        doc.add(table);
    }

    private void addSubTitle(Document doc, String title) throws DocumentException {
        Paragraph p = new Paragraph(title, new Font(Font.HELVETICA, 10, Font.BOLD, COR_TEXTO));
        p.setSpacingBefore(8);
        p.setSpacingAfter(4);
        doc.add(p);
    }

    private void addKpiCell(PdfPTable table, String value, String label, Color color) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(247, 249, 252));
        cell.setBorderColor(COR_LINHA);
        cell.setBorderWidth(0.5f);
        cell.setPadding(10);
        cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);

        Paragraph valP = new Paragraph(value, new Font(Font.HELVETICA, 18, Font.BOLD, color));
        valP.setAlignment(Element.ALIGN_CENTER);
        valP.setSpacingAfter(2);
        cell.addElement(valP);

        Paragraph lblP = new Paragraph(label, new Font(Font.HELVETICA, 7, Font.BOLD, COR_CINZA));
        lblP.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(lblP);

        table.addCell(cell);
    }

    private void addTableHeader(PdfPTable table, String[] headers) {
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, new Font(Font.HELVETICA, 8, Font.BOLD, Color.WHITE)));
            cell.setBackgroundColor(COR_HEADER_BG);
            cell.setPadding(7);
            cell.setBorder(0);
            table.addCell(cell);
        }
    }

    private PdfPCell createCell(String text, float fontSize) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "-", new Font(Font.HELVETICA, fontSize, Font.NORMAL, COR_TEXTO)));
        cell.setPadding(6);
        cell.setBorderColor(COR_LINHA);
        cell.setBorderWidth(0.3f);
        return cell;
    }

    private PdfPCell createBoldCell(String text, float fontSize) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "-", new Font(Font.HELVETICA, fontSize, Font.BOLD, COR_TEXTO)));
        cell.setPadding(6);
        cell.setBorderColor(COR_LINHA);
        cell.setBorderWidth(0.3f);
        return cell;
    }

    private PdfPCell createBadgeCell(String text, Object status) {
        Color bgColor = new Color(241, 245, 249);
        Color textColor = new Color(71, 85, 105);
        String statusStr = status != null ? status.toString() : "";

        if (statusStr.contains("ATIVO")) { bgColor = new Color(220, 252, 231); textColor = new Color(22, 101, 52); }
        else if (statusStr.contains("MANUTENCAO") || statusStr.contains("PENDENTE")) { bgColor = new Color(254, 243, 199); textColor = new Color(146, 64, 14); }
        else if (statusStr.contains("CONCLUID")) { bgColor = new Color(220, 252, 231); textColor = new Color(22, 101, 52); }
        else if (statusStr.contains("CANCELAD")) { bgColor = new Color(254, 226, 226); textColor = new Color(153, 27, 27); }
        else if (statusStr.contains("INATIVO")) { bgColor = new Color(241, 245, 249); textColor = new Color(71, 85, 105); }
        else if (statusStr.contains("ABERTA") || statusStr.contains("EM_ANALISE")) { bgColor = new Color(224, 242, 254); textColor = new Color(7, 89, 133); }
        else if (statusStr.contains("EM_EXECUCAO")) { bgColor = new Color(224, 254, 251); textColor = new Color(13, 148, 136); }

        PdfPCell cell = new PdfPCell(new Phrase(text, new Font(Font.HELVETICA, 7, Font.BOLD, textColor)));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(4);
        cell.setHorizontalAlignment(PdfPCell.ALIGN_CENTER);
        cell.setBorder(0);
        return cell;
    }

    private PdfPCell createBarCell(long value, long max) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(0);
        cell.setPadding(4);

        float pct = max > 0 ? (float) value / max : 0;

        PdfPTable barInner = new PdfPTable(new float[]{pct * 100, (1 - pct) * 100});
        barInner.setWidthPercentage(100);
        PdfPCell filled = new PdfPCell();
        filled.setBackgroundColor(COR_PRINCIPAL);
        filled.setFixedHeight(14);
        filled.setBorder(0);
        PdfPCell empty = new PdfPCell();
        empty.setBorder(0);
        empty.setFixedHeight(14);
        barInner.addCell(filled);
        barInner.addCell(empty);

        cell.addElement(barInner);
        return cell;
    }
}
