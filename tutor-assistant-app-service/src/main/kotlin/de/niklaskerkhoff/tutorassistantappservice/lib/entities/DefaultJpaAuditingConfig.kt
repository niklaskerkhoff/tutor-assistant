package de.niklaskerkhoff.tutorassistantappservice.lib.entities

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.AuditorAware
import org.springframework.security.core.context.SecurityContextHolder
import java.util.*

@Configuration
class DefaultJpaAuditingConfig {
    @Bean
    @ConditionalOnMissingBean
    fun auditorProvider() = AuditorAware {
        Optional.ofNullable(SecurityContextHolder.getContext().authentication?.name)
    }
}
