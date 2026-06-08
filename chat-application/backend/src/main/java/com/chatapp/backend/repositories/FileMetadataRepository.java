package com.chatapp.backend.repositories;

import com.chatapp.backend.models.FileMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileMetadataRepository extends MongoRepository<FileMetadata, String> {
}
