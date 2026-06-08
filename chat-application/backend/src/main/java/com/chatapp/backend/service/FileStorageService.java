package com.chatapp.backend.service;

import com.chatapp.backend.models.FileMetadata;
import com.chatapp.backend.repositories.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDirectory;

    @Autowired
    private FileMetadataRepository fileMetadataRepository;

    public FileStorageService(
            @Value("${file.upload.dir:uploads}") String uploadDir
    ) throws IOException {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.uploadDirectory);
    }

    public FileMetadata storeFile(MultipartFile file, String uploadedBy) throws IOException {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        String storedName = UUID.randomUUID().toString() + "_" + originalName;

        if (originalName.contains("..")) {
            throw new IOException("Invalid file path sequence " + originalName);
        }

        Path targetLocation = uploadDirectory.resolve(storedName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        FileMetadata metadata = new FileMetadata();
        metadata.setOriginalName(originalName);
        metadata.setStoredName(storedName);
        metadata.setContentType(file.getContentType());
        metadata.setSize(file.getSize());
        metadata.setUploadedBy(uploadedBy);
        metadata.setDownloadUrl("/api/files/download/" + storedName);
        metadata.setUploadedAt(Instant.now());

        return fileMetadataRepository.save(metadata);
    }

    public Resource loadFileAsResource(String storedName) throws MalformedURLException {
        Path filePath = uploadDirectory.resolve(storedName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        }
        throw new MalformedURLException("File not found " + storedName);
    }
}
