package com.example.TRANSFAGRI.Configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class SchemaFixRunner implements CommandLineRunner {
    private static final Logger log = LoggerFactory.getLogger(SchemaFixRunner.class);
    private final JdbcTemplate jdbc;

    public SchemaFixRunner(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Override
    public void run(String... args) {
        try {
            Integer len = jdbc.queryForObject(
                "SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.columns WHERE table_schema = database() AND table_name = 'utilisateur' AND column_name = 'role'",
                Integer.class
            );
            if (len == null || len < 20) {
                log.info("Adjusting utilisateur.role column length to VARCHAR(20) (was: {})", len);
                jdbc.execute("ALTER TABLE utilisateur MODIFY role VARCHAR(20)");
            }
        } catch (Exception e) {
            // Don't block startup; just log
            log.warn("Schema fix check failed (non-fatal): {}", e.getMessage());
        }
    }
}
