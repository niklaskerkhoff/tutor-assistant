package de.niklaskerkhoff.tutorassistantappservice.config

import de.niklaskerkhoff.tutorassistantappservice.lib.security.KeycloakJwtAuthenticationConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.env.Environment
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.invoke
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
class SecurityConfig {
    @Bean
    fun securityFilterChain(http: HttpSecurity, env: Environment): SecurityFilterChain {
        http {
            csrf { disable() }
            if (!env.activeProfiles.contains("prod")) {
                cors { }
            }
            authorizeRequests {
                authorize(anyRequest, authenticated)
            }
            oauth2ResourceServer {
                jwt {
                    jwtAuthenticationConverter = KeycloakJwtAuthenticationConverter()
                }
            }
            sessionManagement {
                sessionCreationPolicy = SessionCreationPolicy.STATELESS
            }
        }
        return http.build()
    }

    @Bean
    @Profile("!prod")
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.allowedOrigins = listOf(
            "http://localhost:5173",
            "http://localhost:5174",
        )
        config.allowedHeaders = listOf(
            "Origin", "Content-Type", "Accept", "Authorization",
            "Access-Control-Allow-Origin"
        )
        config.allowedMethods =
            listOf("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}
