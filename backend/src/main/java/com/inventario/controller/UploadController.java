package com.inventario.controller;

import com.inventario.config.WebConfig;
import com.inventario.exception.RegraNegocioException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
public class UploadController {

    private static final Logger log = LoggerFactory.getLogger(UploadController.class);

    private static final Set<String> ALLOWED_TYPES = Set.of(
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "image/bmp", "image/tiff", "image/x-icon",
        "image/heic", "image/heif", "image/heic-sequence",
        "image/avif", "image/svg+xml",
        "application/octet-stream"
    );

    private final WebConfig webConfig;

    @Value("${app.upload.max-size:104857600}")
    private long maxFileSize;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECNICO')")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new RegraNegocioException("Arquivo vazio. Selecione uma imagem.");
        }

        if (file.getSize() > maxFileSize) {
            long maxMB = maxFileSize / (1024 * 1024);
            throw new RegraNegocioException("Arquivo excede " + maxMB + "MB. Tamanho atual: " + formatSize(file.getSize()));
        }

        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename();
        String ext = originalName != null && originalName.contains(".")
            ? originalName.substring(originalName.lastIndexOf(".")).toLowerCase()
            : ".jpg";

        boolean validType = contentType != null && ALLOWED_TYPES.stream().anyMatch(t -> contentType.equalsIgnoreCase(t));
        boolean validExt = Set.of(".jpg",".jpeg",".png",".gif",".webp",".bmp",".tiff",".tif",".ico",".heic",".heif",".avif",".svg").contains(ext);

        if (!validType && !validExt) {
            throw new RegraNegocioException(
                "Tipo nao permitido (" + (contentType != null ? contentType : "desconhecido") + "). " +
                "Use: JPG, PNG, GIF, WebP, BMP, TIFF, HEIC, AVIF ou SVG"
            );
        }

        try {
            Path uploadPath = webConfig.getAbsoluteUploadPath();
            Files.createDirectories(uploadPath);

            String filename = "comp_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
            Path filePath = uploadPath.resolve(filename);

            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            if (!Files.exists(filePath) || Files.size(filePath) == 0) {
                Files.deleteIfExists(filePath);
                throw new RegraNegocioException("Falha ao salvar o arquivo. Tente novamente.");
            }

            String url = "/api/uploads/" + filename;
            log.info("Upload OK: {} -> {} ({} bytes) -> {}", originalName, filename, Files.size(filePath), filePath.toAbsolutePath());
            return ResponseEntity.ok(Map.of("url", url, "filename", filename));

        } catch (IOException e) {
            log.error("Erro IO no upload: {}", e.getMessage(), e);
            throw new RegraNegocioException("Erro ao salvar arquivo. Tente novamente.");
        } catch (RegraNegocioException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erro inesperado no upload: {}", e.getMessage(), e);
            throw new RegraNegocioException("Erro no upload. Tente novamente.");
        }
    }

    private String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        return String.format("%.1f MB", bytes / (1024.0 * 1024));
    }
}
