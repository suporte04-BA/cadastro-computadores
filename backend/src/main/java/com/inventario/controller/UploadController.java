package com.inventario.controller;

import com.inventario.config.WebConfig;
import com.inventario.exception.RegraNegocioException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
        "image/bmp", "image/tiff", "image/tif", "image/x-icon",
        "image/heic", "image/heif", "image/heic-sequence",
        "image/avif", "image/svg+xml", "image/x-tiff"
    );

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
        ".jpg", ".jpeg", ".jfif", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif",
        ".ico", ".heic", ".heif", ".avif", ".svg"
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
        boolean validExt = ALLOWED_EXTENSIONS.contains(ext);

        if (!validExt) {
            throw new RegraNegocioException(
                "Extensao nao permitida (" + ext + "). " +
                "Use: JPG, JFIF, PNG, GIF, WebP, BMP, TIFF, HEIC, AVIF ou SVG"
            );
        }

        if (!validType && contentType != null && !contentType.equals("application/octet-stream")) {
            log.warn("MIME type nao reconhecido: {} para extensao {}", contentType, ext);
        }

        try {
            Path uploadPath = webConfig.getAbsoluteUploadPath();
            Files.createDirectories(uploadPath);

            String filename = "comp_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
            Path filePath = uploadPath.resolve(filename);

            long fileSize;
            try (var inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            if (!Files.exists(filePath) || (fileSize = Files.size(filePath)) == 0) {
                Files.deleteIfExists(filePath);
                throw new RegraNegocioException("Falha ao salvar o arquivo. Tente novamente.");
            }

            String url = "/api/uploads/" + filename;
            String safeName = originalName != null ? originalName.replaceAll("[\\p{Cntrl}\\u2028\\u2029]", "_") : "desconhecido";
            log.info("Upload OK: {} -> {} ({} bytes)", safeName, filename, fileSize);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", url, "filename", filename));

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
