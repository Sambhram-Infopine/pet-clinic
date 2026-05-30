package com.petclinic.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petclinic.backend.entity.Login;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    @Test
    void generateAndValidate_token_isValidAndUsernameMatches() {
        JwtUtil util = new JwtUtil("test-secret", 3600_000L);
        Login login = Login.builder().id(1L).username("alice").email("a@x.com").password("p").build();

        String token = util.generateToken(login);
        assertNotNull(token);
        assertTrue(util.validateToken(token));
        assertEquals("alice", util.getUsername(token));
    }

    @Test
    void tamperedToken_isInvalid() throws Exception {
        JwtUtil util = new JwtUtil("secret-1", 3600_000L);
        Login login = Login.builder().id(1L).username("bob").email("b@x.com").password("p").build();

        String token = util.generateToken(login);
        // tamper payload by flipping a char
        String[] parts = token.split("\\.");
        byte[] payload = Base64.getUrlDecoder().decode(parts[1]);
        String payloadStr = new String(payload, StandardCharsets.UTF_8);
        String tampered = payloadStr.replace("bob", "boB");
        String encodedTampered = Base64.getUrlEncoder().withoutPadding().encodeToString(tampered.getBytes(StandardCharsets.UTF_8));
        String tamperedToken = parts[0] + "." + encodedTampered + "." + parts[2];

        assertFalse(util.validateToken(tamperedToken));
    }

    @Test
    void expiredToken_isInvalid() {
        JwtUtil util = new JwtUtil("secret-2", -1000L); // negative expiration => already expired
        Login login = Login.builder().id(1L).username("carl").email("c@x.com").password("p").build();

        String token = util.generateToken(login);
        assertFalse(util.validateToken(token));
    }

    @Test
    void concurrentGenerate_tokensAreValidAndSessionIdsUnique() throws Exception {
        JwtUtil util = new JwtUtil("concurrent-secret", 3600_000L);
        Login login = Login.builder().id(2L).username("dave").email("d@x.com").password("p").build();

        int threads = 12;
        ExecutorService ex = Executors.newFixedThreadPool(threads);
        List<Callable<String>> tasks = java.util.stream.IntStream.range(0, threads)
                .mapToObj(i -> (Callable<String>) () -> util.generateToken(login))
                .collect(Collectors.toList());

        List<String> tokens = ex.invokeAll(tasks).stream().map(f -> {
            try {
                return f.get();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).collect(Collectors.toList());
        ex.shutdownNow();

        assertEquals(threads, tokens.size());
        // all tokens valid and username matches
        for (String t : tokens) {
            assertTrue(util.validateToken(t));
            assertEquals("dave", util.getUsername(t));
        }

        // ensure session_id values are unique
        ObjectMapper mapper = new ObjectMapper();
        Set<String> sessionIds = new HashSet<>();
        for (String t : tokens) {
            String payloadB64 = t.split("\\.")[1];
            byte[] decoded = Base64.getUrlDecoder().decode(payloadB64);
            Map map = mapper.readValue(decoded, Map.class);
            sessionIds.add((String) map.get("session_id"));
        }
        assertEquals(threads, sessionIds.size());
    }
}
