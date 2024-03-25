package com.a305.travelmaker.global.util;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import java.io.IOException;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {

  @Autowired
  AmazonS3Client amazonS3Client;

  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

  @Value("${cloud.aws.s3.base-url}")
  private String baseUrl;

  public String uploadFile(MultipartFile file) {

    try {
      String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
      ObjectMetadata metadata = new ObjectMetadata();
      metadata.setContentType(file.getContentType());
      metadata.setContentLength(file.getSize());

      PutObjectRequest putObjectRequest = new PutObjectRequest(
          bucket, fileName, file.getInputStream(), metadata
      );
      putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
      amazonS3Client.putObject(putObjectRequest);
      return baseUrl + fileName;
    } catch (IOException e) {
    }
    return null;
  }

  public void deleteFile(String fileName) {
    try {
      amazonS3Client.deleteObject(bucket, fileName);
    } catch (AmazonServiceException e) {
      // Handle exception
    }
  }
}
