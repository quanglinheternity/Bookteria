package com.devteria.identity.service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.Date;
import java.util.Objects;
import java.util.StringJoiner;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.devteria.identity.constant.TokenType;
import com.devteria.identity.dto.request.AuthenticationRequest;
import com.devteria.identity.dto.request.IntrospectRequest;
import com.devteria.identity.dto.request.LogoutRequest;
import com.devteria.identity.dto.request.RefreshRequest;
import com.devteria.identity.dto.response.AuthenticationResponse;
import com.devteria.identity.dto.response.IntrospectResponse;
import com.devteria.identity.entity.InvalidatedToken;
import com.devteria.identity.entity.User;
import com.devteria.identity.exception.AppException;
import com.devteria.identity.exception.ErrorCode;
import com.devteria.identity.repository.InvalidatedTokenRepository;
import com.devteria.identity.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signerKey;

    // ====================== LOGIN ======================
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        var accessTokenInfo = generateAccessToken(user);
        var refreshTokenInfo = generateRefreshToken(user);

        return AuthenticationResponse.builder()
                .token(accessTokenInfo.token()) // access token
                .refreshToken(refreshTokenInfo.token()) // refresh token
                .expiryTime(accessTokenInfo.expiryDate()) // expiry của access token
                .build();
    }

    // ====================== REFRESH TOKEN ======================
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        // Verify và đảm bảo đây là Refresh Token
        SignedJWT signedJWT = verifyToken(request.getToken(), TokenType.REFRESH_TOKEN);

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        // Invalidate refresh token cũ
        InvalidatedToken invalidatedToken =
                InvalidatedToken.builder().id(jti).expiryTime(expiryTime).build();
        try {
            invalidatedTokenRepository.save(invalidatedToken);
        } catch (DataIntegrityViolationException e) {
            log.warn("Token already invalidated: {}", jti);
        }

        String username = signedJWT.getJWTClaimsSet().getSubject();
        var user =
                userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        // Tạo cặp token mới (Rotation)
        var newAccessTokenInfo = generateAccessToken(user);
        var newRefreshTokenInfo = generateRefreshToken(user);

        log.info("Refresh token successfully for user: {}", username);

        return AuthenticationResponse.builder()
                .token(newAccessTokenInfo.token())
                .refreshToken(newRefreshTokenInfo.token())
                .expiryTime(newAccessTokenInfo.expiryDate())
                .build();
    }

    // ====================== LOGOUT ======================
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(request.getToken(), null); // không cần check type

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        try {
            invalidatedTokenRepository.save(
                    InvalidatedToken.builder().id(jti).expiryTime(expiryTime).build());
        } catch (DataIntegrityViolationException e) {
            log.warn("Token already invalidated: {}", jti);
        }
    }

    // ====================== INTROSPECT ======================
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        boolean isValid = true;
        SignedJWT jwt = null;

        try {
            jwt = verifyToken(request.getToken(), null);
        } catch (AppException e) {
            isValid = false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .userId(Objects.nonNull(jwt) ? (String) jwt.getJWTClaimsSet().getClaim("userId") : null)
                .build();
    }

    // ====================== TOKEN GENERATION ======================
    private TokenInfo generateAccessToken(User user) {
        return generateToken(user, 1, ChronoUnit.HOURS, TokenType.ACCESS_TOKEN);
    }

    private TokenInfo generateRefreshToken(User user) {
        return generateToken(user, 7, ChronoUnit.DAYS, TokenType.REFRESH_TOKEN); // bạn có thể đổi thành 14 hoặc 30 ngày
    }

    private TokenInfo generateToken(User user, long amount, TemporalUnit unit, TokenType tokenType) {
        Date issueTime = new Date();
        Date expiryTime = Date.from(Instant.ofEpochMilli(issueTime.getTime()).plus(amount, unit));

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("devteria.com")
                .issueTime(issueTime)
                .expirationTime(expiryTime)
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("userId", user.getId())
                .claim("tokenType", tokenType.name()) // quan trọng
                .build();

        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.HS512)
                .type(JOSEObjectType.JWT)
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(signerKey.getBytes()));
            return new TokenInfo(jwsObject.serialize(), expiryTime);
        } catch (JOSEException e) {
            log.error("Cannot create {} token for user: {}", tokenType, user.getUsername(), e);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    // ====================== VERIFY TOKEN ======================
    private SignedJWT verifyToken(String token, TokenType expectedType) throws JOSEException, ParseException {

        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

        // Check expiration
        Date expiryTime = claims.getExpirationTime();
        if (expiryTime == null || expiryTime.before(new Date())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Verify signature
        if (!signedJWT.verify(verifier)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Check blacklist
        String jti = claims.getJWTID();
        if (jti == null || invalidatedTokenRepository.existsById(jti)) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // Nếu có expectedType thì kiểm tra tokenType claim
        if (expectedType != null) {
            String actualType = claims.getStringClaim("tokenType");
            if (!expectedType.name().equals(actualType)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
        }

        return signedJWT;
    }

    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
                }
            });
        }
        return stringJoiner.toString();
    }

    // Record TokenInfo
    private record TokenInfo(String token, Date expiryDate) {}
}
