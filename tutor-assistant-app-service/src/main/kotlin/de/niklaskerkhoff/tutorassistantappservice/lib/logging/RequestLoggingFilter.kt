package de.niklaskerkhoff.tutorassistantappservice.lib.logging

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

/**
 * OncePerRequestFilter for logging base information about incoming requests and outgoing responses.
 */
@Component
class RequestLoggingFilter : OncePerRequestFilter(), Logger {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val method = request.method
        val url = request.requestURL.toString()

        log.info("Incoming request: Method=$method, URL=$url")

        filterChain.doFilter(request, response)

        val statusCode = response.status
        logger.info("Outgoing response: StatusCode=$statusCode, Method=$method, URL=$url")
    }
}
