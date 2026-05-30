package com.petclinic.backend.service;

import com.petclinic.backend.config.SmsNotificationProperties;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SmsNotificationService implements NotificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(SmsNotificationService.class);
    private static final String OWNER_REGISTRATION_MESSAGE =
            "You have successfully registered to Pet Clinic.";
    private static final String TWILIO_MESSAGES_URL =
            "https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json";

    private final SmsNotificationProperties properties;
    private final HttpClient httpClient;

    public SmsNotificationService(SmsNotificationProperties properties) {
        this.properties = properties;
        this.httpClient = HttpClient.newHttpClient();
    }

    @Override
    public void sendOwnerRegistrationNotification(String telephoneNumber) {
        if (!properties.isEnabled()) {
            LOGGER.info("SMS notification skipped for {} because notification.sms.enabled=false", telephoneNumber);
            return;
        }

        SmsNotificationProperties.Twilio twilio = properties.getTwilio();
        if (!hasTwilioConfig(twilio)) {
            LOGGER.warn("SMS notification skipped for {} because Twilio configuration is incomplete", telephoneNumber);
            return;
        }

        String recipient = toE164Number(telephoneNumber);
        try {
            sendTwilioMessage(twilio, recipient, OWNER_REGISTRATION_MESSAGE);
            LOGGER.info("SMS notification sent to {}", recipient);
        } catch (IOException e) {
            LOGGER.error("Failed to send SMS notification to {}", recipient, e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            LOGGER.error("SMS notification interrupted for {}", recipient, e);
        }
    }

    private boolean hasTwilioConfig(SmsNotificationProperties.Twilio twilio) {
        return StringUtils.hasText(twilio.getAccountSid())
                && StringUtils.hasText(twilio.getAuthToken())
                && StringUtils.hasText(twilio.getFromNumber());
    }

    private String toE164Number(String telephoneNumber) {
        String normalized = telephoneNumber.trim();
        if (normalized.startsWith("+")) {
            return normalized;
        }

        return properties.getDefaultCountryCode() + normalized;
    }

    private void sendTwilioMessage(
            SmsNotificationProperties.Twilio twilio,
            String recipient,
            String message) throws IOException, InterruptedException {
        String body = formField("To", recipient)
                + "&" + formField("From", twilio.getFromNumber())
                + "&" + formField("Body", message);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(TWILIO_MESSAGES_URL.formatted(twilio.getAccountSid())))
                .header("Authorization", "Basic " + basicAuth(twilio))
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("Twilio returned status " + response.statusCode() + ": " + response.body());
        }
    }

    private String formField(String name, String value) {
        return URLEncoder.encode(name, StandardCharsets.UTF_8)
                + "="
                + URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String basicAuth(SmsNotificationProperties.Twilio twilio) {
        String credentials = twilio.getAccountSid() + ":" + twilio.getAuthToken();
        return Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }
}
