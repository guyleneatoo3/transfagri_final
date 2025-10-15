# Code Citations

## License: unknown
https://github.com/algaworks/palestra-spring-security-cti/tree/a20d90a5d0eb937bf9c354017e3cf6be1579d763/src/main/java/com/algaworks/gp/config/SecurityConfig.java

```
springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
```

