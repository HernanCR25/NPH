package pe.edu.vallegrande.foods.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Arrays.asList(
                "https://4200-vallegrande-vgwebdashbo-mvhhv12wpdh.ws-us118.gitpod.io",
                "https://nph-ciclodevida.onrender.com/cicloVida",
                "https://4200-vallegrande-vgwebdashbo-8a58inu3ult.ws-us118.gitpod.io",
                "https://4200-vallegrande-vgwebdashbo-7wz0tlpfi8q.ws-us118.gitpod.io",
                "https://4200-vallegrande-vgwebdashbo-r6vfykaqkjn.ws-us119.gitpod.io",
                "http://localhost:4200"
        ));
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
        corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
