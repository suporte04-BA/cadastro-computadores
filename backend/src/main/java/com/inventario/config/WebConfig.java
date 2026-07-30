package com.inventario.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(WebConfig.class);

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    private Path absoluteUploadPath;

    @PostConstruct
    public void init() {
        try {
            absoluteUploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(absoluteUploadPath);
            log.info("Diretorio de uploads: {}", absoluteUploadPath.toUri());
        } catch (Exception e) {
            log.error("Erro ao criar diretorio de uploads: {}", e.getMessage());
            absoluteUploadPath = Paths.get(System.getProperty("user.dir"), uploadDir).toAbsolutePath().normalize();
            try { Files.createDirectories(absoluteUploadPath); } catch (Exception ignored) {}
        }
    }

    public Path getAbsoluteUploadPath() {
        return absoluteUploadPath;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3030", "http://127.0.0.1:3030", "http://[::1]:3030", "http://localhost:8080", "http://127.0.0.1:8080")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(false)
            .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadLocation = absoluteUploadPath.toUri().toString();
        if (!uploadLocation.endsWith("/")) {
            uploadLocation += "/";
        }

        // Handler 1: Uploaded files - MAIS ESPECIFICO (verificado PRIMEIRO pelo Spring MVC)
        registry.addResourceHandler("/api/uploads/**")
            .addResourceLocations(uploadLocation)
            .setCacheControl(org.springframework.http.CacheControl.maxAge(java.time.Duration.ofHours(1)));
        log.info("ResourceHandler: /api/uploads/** -> {}", uploadLocation);

        // Handler 2: Frontend static files (classpath:/static/) - REGISTRADO POR ULTIMO
        registry.addResourceHandler("/**")
            .addResourceLocations("classpath:/static/")
            .setCachePeriod(0);
        log.info("ResourceHandler: /** -> classpath:/static/");
    }
}
