package de.niklaskerkhoff.tutorassistantappservice.lib.security

import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken

/**
 * @param authority which is required.
 * @returns true if this JwtAuthenticationToken has a given authority, false otherwise.
 */
fun JwtAuthenticationToken.hasAuthority(authority: String) = authorities.contains(SimpleGrantedAuthority(authority))
