package com.example.demo_prj_intern.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CloudinaryUploadService {

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    public String uploadAttachment(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        if (!isAllowedAttachment(file)) {
            throw new IllegalArgumentException("Chỉ hỗ trợ upload file ảnh hoặc PDF");
        }

        if (cloudName == null || cloudName.isBlank()
                || apiKey == null || apiKey.isBlank()
                || apiSecret == null || apiSecret.isBlank()) {
            throw new IllegalStateException("Cloudinary config is missing. Fill cloudinary.cloud-name, cloudinary.api-key, cloudinary.api-secret in application.properties.");
        }

        try {
            long timestamp = Instant.now().getEpochSecond();
            String signature = sign(timestamp);
            String resourceType = isPdf(file) ? "raw" : "auto";
            String endpoint = "https://api.cloudinary.com/v1_1/" + cloudName + "/" + resourceType + "/upload";

            HttpURLConnection connection = (HttpURLConnection) URI.create(endpoint).toURL().openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            String boundary = "----CopilotCloudinaryBoundary";
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            try (var outputStream = connection.getOutputStream()) {
                writePart(outputStream, boundary, "api_key", apiKey);
                writePart(outputStream, boundary, "timestamp", String.valueOf(timestamp));
                writePart(outputStream, boundary, "signature", signature);
                writeFilePart(outputStream, boundary, "file", file.getOriginalFilename(), file.getBytes(), file.getContentType());
                outputStream.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
            }

            int status = connection.getResponseCode();
            InputStream responseStream = status >= 200 && status < 300 ? connection.getInputStream() : connection.getErrorStream();
            String responseBody = readAll(responseStream);

            if (status < 200 || status >= 300) {
                throw new IllegalStateException("Cloudinary upload failed: " + responseBody);
            }

            String secureUrl = extractSecureUrl(responseBody);
            if (secureUrl == null || secureUrl.isBlank()) {
                throw new IllegalStateException("Cloudinary response does not contain secure_url");
            }

            return secureUrl;
        } catch (IOException e) {
            throw new RuntimeException("Không thể upload file lên Cloudinary", e);
        }
    }

    private String extractSecureUrl(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            return null;
        }
        Pattern pattern = Pattern.compile("\"secure_url\"\\s*:\\s*\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(responseBody);
        return matcher.find() ? matcher.group(1) : null;
    }

    private String sign(long timestamp) {
        // TODO: nếu thêm folder/transformation thì đưa các param đó vào chuỗi ký theo Cloudinary rules.
        String toSign = "timestamp=" + timestamp + apiSecret;
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-1");
            byte[] hash = digest.digest(toSign.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Không thể tạo Cloudinary signature", e);
        }
    }

    private void writePart(java.io.OutputStream outputStream, String boundary, String name, String value) throws IOException {
        outputStream.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        outputStream.write(("Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        outputStream.write((value + "\r\n").getBytes(StandardCharsets.UTF_8));
    }

    private void writeFilePart(java.io.OutputStream outputStream, String boundary, String name, String filename, byte[] bytes, String contentType) throws IOException {
        outputStream.write(("--" + boundary + "\r\n").getBytes(StandardCharsets.UTF_8));
        outputStream.write(("Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n").getBytes(StandardCharsets.UTF_8));
        outputStream.write(("Content-Type: " + (contentType == null || contentType.isBlank() ? "application/octet-stream" : contentType) + "\r\n\r\n").getBytes(StandardCharsets.UTF_8));
        outputStream.write(bytes);
        outputStream.write("\r\n".getBytes(StandardCharsets.UTF_8));
    }

    private String readAll(InputStream inputStream) throws IOException {
        if (inputStream == null) {
            return "";
        }
        try (inputStream; ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {
            byte[] data = new byte[4096];
            int nRead;
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            return buffer.toString(StandardCharsets.UTF_8);
        }
    }

    private boolean isAllowedAttachment(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null) {
            if (contentType.startsWith("image/")) {
                return true;
            }
            if ("application/pdf".equalsIgnoreCase(contentType)) {
                return true;
            }
        }

        String filename = file.getOriginalFilename();
        if (filename == null) {
            return false;
        }

        String lowerName = filename.toLowerCase();
        return lowerName.endsWith(".pdf")
                || lowerName.endsWith(".png")
                || lowerName.endsWith(".jpg")
                || lowerName.endsWith(".jpeg")
                || lowerName.endsWith(".gif")
                || lowerName.endsWith(".webp")
            || lowerName.endsWith(".bmp");
    }

    private boolean isPdf(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null && "application/pdf".equalsIgnoreCase(contentType)) {
            return true;
        }

        String filename = file.getOriginalFilename();
        return filename != null && filename.toLowerCase().endsWith(".pdf");
    }
}