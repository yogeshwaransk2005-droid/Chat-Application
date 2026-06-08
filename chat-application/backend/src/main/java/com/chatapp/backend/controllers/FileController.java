package com.chatapp.backend.controllers;

import com.chatapp.backend.models.FileMetadata;
import com.chatapp.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Autowired
    private FileStorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy
    ) throws IOException {
        FileMetadata metadata = storageService.storeFile(file, uploadedBy);
        return ResponseEntity.ok(metadata);
    }

    @GetMapping("/download/{storedName}")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String storedName
    ) throws IOException {
        Resource resource = storageService.loadFileAsResource(storedName);
        String contentType = resource.getFilename() != null && resource.getFilename().contains(".")
                ? resource.getFilename().substring(resource.getFilename().lastIndexOf('.') + 1)
                : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
