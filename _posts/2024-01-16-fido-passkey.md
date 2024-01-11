---
layout: post
authors: [nicholas_meyers]
title: 'Understanding FIDO & Passkeys: Guide for Spring Boot and Angular Apps'
image: /img/2024-01-16-fido-passkey/banner.png
tags: [Security, Spring Boot, Angular]
category: Security
comments: true
---

> What's a common vulnerability in applications? Isn't it the traditional username/password login? Perhaps it's time to embrace FIDO/Passkeys for a more secure login method.

- [Introduction](#introduction)
- [How does it work](#how-does-it-work)
- [Create a new Spring Boot application](#create-a-new-spring-boot-application)
- [Create a new Angular application](#create-a-new-angular-application)
- [Conclusion](#conclusion)
- [Extra](#extra)

## Introduction

Every week, we encounter articles detailing stolen user login credentials, hacked databases with compromised usernames and passwords ([Car maintenance company leaks 12.7k US phone numbers, emails and MD5 unsalted passwords](https://cybernews.com/security/xado-leaks-us-phone-numbers-emails-md5-unsalted-passwords/){:target="_blank" rel="noopener noreferrer"}, [COMB: largest breach of all time leaked online with 3.2 billion records](https://cybernews.com/news/largest-compilation-of-emails-and-passwords-leaked-free/){:target="_blank" rel="noopener noreferrer"}). 
Users often reuse the same password across multiple platforms, fail to rotate passwords, or use weak ones. Have you explored the website '[have i been pwned?](https://haveibeenpwned.com/){:target="_blank" rel="noopener noreferrer"}'? 
Take a look; you'll be surprised at how many of your passwords have already been leaked.

It appears to be high time to address the vulnerabilities associated with traditional username and password logins and transition towards the use of FIDO.

FIDO (Fast IDentity Online) is a set of open authentication standards that aims to replace traditional passwords with more secure and convenient methods.

Key benefits of FIDO authentication:
* Strong Security: FIDO Authentication utilises public-key cryptography, which is more secure than traditional passwords against phishing attacks, keyloggers, and other threats.
* Convenience: Passkeys, the credential type enabled by FIDO Authentication, are stored on your device and can be unlocked using biometrics like fingerprint or face recognition, eliminating the need to remember or type passwords repeatedly.

## How does it work

To understand how passkeys work, let's take a step back and delve into the realm of asymmetric cryptography. In asymmetric cryptography, 
we deal with a key pair consisting of a private key, which must remain private and undisclosed, and a public key, which can be shared openly.

Through asymmetric encryption, a message encrypted with the public key can only be deciphered by the possessor of the private key. 
Conversely, if a message is encrypted with the private key, it can be read using the public key (signature).

So, how is this technology employed in FIDO? During registration, your device generates a unique passkey, which contains a public key and a private key.
The public key is stored on the service provider's server, while the private key remains securely on your device (smartphone, tablet, or a dedicated FIDO security key).

To register as a new user, we must send our public key to the server and have it validated. 
The server will send us a challenge that we must sign using our private key. 
If the server can verify the signature using our public key, the registration is complete.

To authenticate a user, we send our username to the server, and the server will answer with a challenge encrypted with our public key.
On our device, we need to decrypt the challenge with our private key, solve the challenge, and return our response encrypted with our private key.
After sending the encrypted response, the server is able to validate the response with our public key and check if the login succeeded.

So, in this way, we no longer store the user's password, but only a public key that can be shared openly.

## Create a new Spring Boot application

In our Spring Boot application, we are going to handle the registration and login.

### Add the needed dependencies

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>com.yubico</groupId>
    <artifactId>webauthn-server-core</artifactId>
    <version>2.5.0</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
</dependency>

<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Database
We use Flyway to set up our database; we need to keep track of our users and their passkeys.

We need to save the following data for the user.

The username is the identifier specified by the user, and the user handle is the unique identifier generated by the system, used to streamline communication between the FIDO server and the authenticator.\
The assertion contains information such as user identification, the authentication method used, and cryptographic signatures to ensure the authenticity of the claim. It is used to confirm that the user has been successfully authenticated and that the authenticator is indeed trustworthy. It is also rebuilt every time a user attempts to log in.\
The public key JSON is used when creating a new public key for a user, typically during the registration process. It contains all the parameters and options necessary for generating a new public key for the respective user. The authenticator will use these options to generate the new key.\
We keep a boolean registration complete, indicating whether the registration has been successfully completed.


We need to save the following data for the passkey.

The key id is a unique identifier assigned to a registered key and is used to identify that specific key.\
The public key is the user's public key generated during the registration process with an authenticator.\
The signature count refers to a counter indicating the number of signatures with a specific FIDO authenticator. With this value, the server can verify if the counter has been correctly updated compared to the previous value. If the value is not correctly updated, it may indicate the possibility of a replay or an attack.\
Transport refers to the manner in which communication occurs between the FIDO client (for example, an authenticator like a USB security key) and the FIDO server during the authentication process. The transport mechanism determines how data is exchanged between the authenticator and the server.\
The type refers to the type of authenticator used to perform FIDO-based authentication.

There are various transport mechanisms defined in FIDO, including:

* USB: The authenticator is physically connected to the device through a USB port.
* NFC (Near Field Communication): The authenticator and the device communicate wirelessly via NFC technology, which is convenient for mobile devices.
* Bluetooth: Communication between the authenticator and the device occurs wirelessly via Bluetooth.
* Internal: The authenticator is embedded within the device itself, such as a built-in fingerprint reader in a laptop.
* Platform: Communication takes place through the platform itself, for example, between a mobile app on a smartphone and the authenticator.

Create a SQL file `V1__init.sql`.
```sql
CREATE TABLE user
(
    id                      CHAR(36)                NOT NULL,
    username                CHARACTER VARYING(255)  NOT NULL,
    user_handle             VARBINARY(255)          NOT NULL,
    assertion               MEDIUMTEXT,
    public_key_json         MEDIUMTEXT,
    registration_complete   BIT                     NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE passkey
(
    id              CHAR(36)                NOT NULL,
    key_id          VARBINARY(255)          NOT NULL,
    public_key      VARBINARY(255)          NOT NULL,
    signature_count INTEGER(20)             NOT NULL,
    transport       CHARACTER VARYING(255)  NOT NULL,
    type            CHARACTER VARYING(255)  NOT NULL,
    user_handle     VARBINARY(255)          NOT NULL,
    PRIMARY KEY (id)
);
```

And configure the database in the `application.properties` file.
```properties
spring.datasource.url=jdbc:h2:mem:db;DB_CLOSE_DELAY=-1;MODE=MySQL;NON_KEYWORDS=USER
spring.datasource.driverClassName=org.h2.Driver
```

### Create utils
Because Yubico's dependency works with their own object ByteArray instead of byte[], we create a small class to easily convert between them.

Create a `ByteArrayUtils` class.
```java
public class ByteArrayUtils {
    private ByteArrayUtils() {
    }

    public static byte[] byteArrayToBytes(ByteArray byteArray) {
        return byteArray.getBytes();
    }

    public static ByteArray bytesToByteArray(byte[] bytes) {
        return new ByteArray(bytes);
    }
}
```

### Models
Create a model `User` and a model `Passkey`.

```java
@Getter
@Setter
@Entity
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    @JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "id")
    private UUID id;
    private String username;
    @Column(length = 1000000)
    @Lob
    private String publicKeyJson;
    @Column(length = 1000000)
    @Lob
    private String assertion;
    private byte[] userHandle;
    private boolean registrationComplete;
}
```

```java
@Getter
@Setter
@Entity
public class Passkey {
    @Id
    @GeneratedValue(generator = "UUID")
    @JdbcTypeCode(java.sql.Types.VARCHAR)
    @Column(name = "id")
    private UUID id;
    private byte[] userHandle;
    private byte[] publicKey;
    private byte[] keyId;
    private String type;
    private String transport;
    private long signatureCount;
}
```

### Repositories
Create a repository `UserRepository`, `PasskeyRepository` and `MyCredentialRepository`.

```java
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByUserHandle(byte[] userHandle);
}
```

```java
public interface PasskeyRepository extends JpaRepository<Passkey, UUID> {
    List<Passkey> findAllByUserHandle(byte[] userHandle);

    List<Passkey> findAllByKeyId(byte[] keyId);

    Optional<Passkey> findByUserHandleAndKeyId(byte[] userHandle, byte[] keyId);
}
```

```java
@Slf4j
@AllArgsConstructor
public class MyCredentialRepository implements CredentialRepository {

    private final UserRepository userRepository;
    private final PasskeyRepository passkeyRepository;

    @Override
    public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
        log.info("Get credentials id's for {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            log.info("Username {} found", username);
            Set<PublicKeyCredentialDescriptor> descriptors = new HashSet<>();
            passkeyRepository.findAllByUserHandle(user.get().getUserHandle())
                    .forEach(descriptor -> {
                        log.info("Found credential for {}", username);
                        descriptors.add(PublicKeyCredentialDescriptor.builder()
                                .id(bytesToByteArray(descriptor.getKeyId()))
                                .transports(getTransports(descriptor.getTransport()))
                                .build());
                    });
            return descriptors;
        }
        return Collections.emptySet();
    }

    @Override
    public Optional<ByteArray> getUserHandleForUsername(String username) {
        log.info("Get user handle for {}", username);
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            log.info("User handle found for {}", username);
            return Optional.of(bytesToByteArray(user.get().getUserHandle()));
        }
        return Optional.empty();
    }

    @Override
    public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
        log.info("Get username for user handle");
        Optional<User> user = userRepository.findByUserHandle(byteArrayToBytes(userHandle));
        if (user.isPresent()) {
            log.info("Username: {} found for user handle", user.get().getUsername());
            return Optional.of(user.get().getUsername());
        }
        return Optional.empty();
    }

    @Override
    public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
        log.info("Get key for credential id and user handle");
        Optional<Passkey> key = passkeyRepository
                .findByUserHandleAndKeyId(byteArrayToBytes(userHandle), byteArrayToBytes(credentialId));
        if (key.isPresent()) {
            log.info("Key found for credential id and user handle");
            RegisteredCredential db = RegisteredCredential.builder()
                    .credentialId(bytesToByteArray(key.get().getKeyId()))
                    .userHandle(bytesToByteArray(key.get().getUserHandle()))
                    .publicKeyCose(bytesToByteArray(key.get().getPublicKey()))
                    .signatureCount(key.get().getSignatureCount())
                    .build();
            return Optional.of(db);
        }
        return Optional.empty();
    }

    @Override
    public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
        log.info("Get keys for credential id");
        List<Passkey> passkeys = passkeyRepository.findAllByKeyId(byteArrayToBytes(credentialId));
        if (passkeys.isEmpty()) {
            log.info("No keys found for credential id");
        } else {
            log.info("Keys found for credential id");
        }

        Set<RegisteredCredential> registeredCredentials = new HashSet<>();
        passkeys.forEach(passkey -> {
            RegisteredCredential db = RegisteredCredential.builder()
                    .credentialId(bytesToByteArray(passkey.getKeyId()))
                    .userHandle(bytesToByteArray(passkey.getUserHandle()))
                    .publicKeyCose(bytesToByteArray(passkey.getPublicKey()))
                    .signatureCount(passkey.getSignatureCount())
                    .build();
            registeredCredentials.add(db);
        });
        return registeredCredentials;
    }

    private Set<AuthenticatorTransport> getTransports(String transport) {
        Set<AuthenticatorTransport> transports = new HashSet<>();
        String[] transportAsArray = transport.split(",");
        Arrays.stream(transportAsArray).toList().forEach(t -> {
            transports.add(AuthenticatorTransport.of(t));
        });
        return transports;
    }
}
```

### Server Configuration
Create a configuration class `ServerConfiguration`.

The term "Relying Party Identity" refers to the identification information of the relying party.\
A "Relying Party" (RP) is an entity, typically a website or an online service, that relies on FIDO-based authentication to verify the identity of users. The relying party initiates and manages the FIDO authentication process to ensure secure and user-friendly login experiences.\
The `AuthenticatorSelectionCriteria` is a set of criteria used to specify preferences for the characteristics of the authenticator that should be used during the credential creation process.\
The `PublicKeyCredentialParameters` is a data structure used to specify the cryptographic algorithms and key types that a relying party (or website) is willing to accept during the credential creation process.


```java
@AllArgsConstructor
@Configuration
public class ServerConfiguration {

    private final UserRepository userRepository;
    private final PasskeyRepository passkeyRepository;

    @Bean
    public RelyingPartyIdentity relyingPartyIdentity() {
        RelyingPartyIdentity rpIdentity = RelyingPartyIdentity.builder()
                .id("localhost")
                .name("WebAuthn - Nicholas Meyers")
                .build();
        return rpIdentity;
    }

    @Bean
    public RelyingParty relyingParty() {
        RelyingParty rp = RelyingParty.builder()
                .identity(relyingPartyIdentity())
                .credentialRepository(new MyCredentialRepository(userRepository, passkeyRepository))
                .allowOriginPort(true)
                .build();
        return rp;
    }

    @Bean
    public AuthenticatorSelectionCriteria authenticatorSelectionCriteria() {
        AuthenticatorAttachment authenticatorAttachment = AuthenticatorAttachment.CROSS_PLATFORM;
        ResidentKeyRequirement residentKeyRequirement = ResidentKeyRequirement.PREFERRED;
        UserVerificationRequirement userVerificationRequirement = UserVerificationRequirement.PREFERRED;

        return AuthenticatorSelectionCriteria.builder()
                .authenticatorAttachment(authenticatorAttachment)
                .residentKey(residentKeyRequirement)
                .userVerification(userVerificationRequirement)
                .build();
    }

    @Bean
    public List<PublicKeyCredentialParameters> publicKeyCredentialParameters() {
        List<PublicKeyCredentialParameters> pubKeyCredParams = new ArrayList<>();

        PublicKeyCredentialParameters param1 = PublicKeyCredentialParameters.ES256;
        PublicKeyCredentialParameters param2 = PublicKeyCredentialParameters.RS256;
        pubKeyCredParams.add(param1);
        pubKeyCredParams.add(param2);
        return pubKeyCredParams;
    }
}
```

### Create Extension Output
The `ClientExtensionOutputs` refers to the output of client extensions during the WebAuthn process, such as creating a public key credential or authentication. This output may contain information specific to the used extensions.

```java
public class CustomClientExtensionOutput implements ClientExtensionOutputs {
    @Override
    public Set<String> getExtensionIds() {
        return Collections.emptySet();
    }
}
```

### Create registration resources

```java
public record StartRegisterCredentialResponseResource(ByteArray id, String type, String[] transports) {
}
```

```java
public record StartRegisterRequestResource(String username) {
}
```

```java
public record StartRegisterResponseResource(String challenge, RelyingPartyIdentity rp, UserIdentity user,
                                            List<PublicKeyCredentialParameters> pubKeyCredParams, 
                                            long timeout, String attestation, 
                                            List<StartRegisterCredentialResponseResource> excludeCredentials,
                                            AuthenticatorSelectionCriteria authenticatorSelection) {
}
```

```java
public record VerifyClientRequestResource(ByteArray attestationObject, ByteArray clientDataJSON, 
                                          List<String> transports) {
}
```

```java
public record VerifyAttestationRequestResource(ByteArray id, ByteArray rawId, 
                                               VerifyClientRequestResource response, String type, 
                                               Object clientExtensionResults, String authenticatorAttachment) {
}
```

```java
public record VerifyRegistrationRequestResource(String username, VerifyAttestationRequestResource response) {
}
```

```java
public record VerifyRegistrationResponseResource(boolean verified) {
}
```

### Start Registration Service
Create a service `StartRegistrationService`.

```java
@AllArgsConstructor
@Service
public class StartRegistrationService {

    private final UserRepository userRepository;
    private final AuthenticatorSelectionCriteria authenticatorSelection;
    private final RelyingPartyIdentity relyingPartyIdentity;
    private final RelyingParty relyingParty;
    private final List<PublicKeyCredentialParameters> publicKeyCredentialParameters;
    private final Random random = new Random();

    public StartRegisterResponseResource startRegistration(StartRegisterRequestResource resource) throws JsonProcessingException {
        UUID userId = UUID.randomUUID();
        byte[] userHandle = new byte[36];
        random.nextBytes(userHandle);

        UserIdentity userIdentity = createUserIdentity(resource.username(), bytesToByteArray(userHandle));
        StartRegistrationOptions startRegistrationOptions = createStartRegistrationOptions(userIdentity);
        PublicKeyCredentialCreationOptions pbOptions = relyingParty.startRegistration(startRegistrationOptions);

        User user = createUser(userId, resource.username(), pbOptions.toJson(), userHandle);
        userRepository.save(user);

        return new StartRegisterResponseResource(pbOptions.getChallenge().getBase64Url(), relyingPartyIdentity,
                userIdentity, publicKeyCredentialParameters, 60000, "none", Collections.emptyList(), authenticatorSelection);
    }

    private UserIdentity createUserIdentity(String username, ByteArray userHandle) {
        return UserIdentity.builder()
                .name(username)
                .displayName(username)
                .id(userHandle)
                .build();
    }

    private StartRegistrationOptions createStartRegistrationOptions(UserIdentity userIdentity) {
        return StartRegistrationOptions.builder()
                .user(userIdentity)
                .timeout(60000)
                .authenticatorSelection(authenticatorSelection)
                .build();
    }

    private User createUser(UUID userId, String username, String publicKey, byte[] userHandle) {
        User user = new User();
        user.setId(userId);
        user.setUsername(username);
        user.setPublicKeyJson(publicKey);
        user.setUserHandle(userHandle);
        user.setRegistrationComplete(false);
        return user;
    }
}
```

### Verify Registration Service
Create a service `VerifyRegistrationService`.

```java
@Slf4j
@AllArgsConstructor
@Service
public class VerifyRegistrationService {

    private final RelyingParty relyingParty;
    private final UserRepository userRepository;
    private final PasskeyRepository passkeyRepository;
    
    public VerifyRegistrationResponseResource verify(VerifyRegistrationRequestResource resource) throws Base64UrlException, IOException {
        Optional<User> user = userRepository.findByUsername(resource.username());

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        AuthenticatorAttestationResponse authenticatorAttestationResponse
                = createAuthenticatorAttestationResponse(resource.response().response());

        PublicKeyCredentialCreationOptions publicKeyCredentials = createPublicKeyCredentialCreationOptions(user.get().getPublicKeyJson());
        PublicKeyCredential publicKeyCredential = createPublicKeyCredential(resource.response().id(), authenticatorAttestationResponse);

        FinishRegistrationOptions finishRegistrationOptions = createFinishRegistrationOptions(publicKeyCredentials, publicKeyCredential);

        RegistrationResult registrationResult;
        try {
            registrationResult = relyingParty.finishRegistration(finishRegistrationOptions);
        } catch (RegistrationFailedException e) {
            user.get().setPublicKeyJson(null);
            user.get().setRegistrationComplete(false);
            userRepository.save(user.get());
            return new VerifyRegistrationResponseResource(false);
        }

        user.get().setPublicKeyJson(null);
        user.get().setRegistrationComplete(true);
        userRepository.save(user.get());

        byte[] publicKey = byteArrayToBytes(registrationResult.getPublicKeyCose());
        byte[] keyId = byteArrayToBytes(registrationResult.getKeyId().getId());
        String type = registrationResult.getKeyId().getType().getId();
        String transport = "";
        long signatureCount = registrationResult.getSignatureCount();


        Optional<SortedSet<AuthenticatorTransport>> transports = registrationResult.getKeyId().getTransports();
        if (transports.isPresent()) {
            List<String> transportList = transports.get().stream().map(AuthenticatorTransport::getId).toList();
            transport = String.join(",", transportList);
        }

        Passkey passkey = new Passkey();
        passkey.setId(UUID.randomUUID());
        passkey.setUserHandle(user.get().getUserHandle());
        passkey.setPublicKey(publicKey);
        passkey.setKeyId(keyId);
        passkey.setType(type);
        passkey.setTransport(transport);
        passkey.setSignatureCount(signatureCount);

        log.info("Save passkey for transports {}", transport);
        passkeyRepository.save(passkey);

        return new VerifyRegistrationResponseResource(true);
    }

    private AuthenticatorAttestationResponse createAuthenticatorAttestationResponse(VerifyClientRequestResource client) throws Base64UrlException, IOException {
        Set<AuthenticatorTransport> transports = new HashSet<>();
        client.transports().forEach(transport -> {
            transports.add(AuthenticatorTransport.of(transport));
        });

        return AuthenticatorAttestationResponse.builder()
                .attestationObject(client.attestationObject())
                .clientDataJSON(client.clientDataJSON())
                .transports(transports)
                .build();
    }

    private PublicKeyCredentialCreationOptions createPublicKeyCredentialCreationOptions(String json) throws JsonProcessingException {
        return PublicKeyCredentialCreationOptions.fromJson(json);
    }

    private PublicKeyCredential createPublicKeyCredential(ByteArray id, AuthenticatorAttestationResponse authenticator) {
        CustomClientExtensionOutput extensionOutput = new CustomClientExtensionOutput();

        return PublicKeyCredential.builder()
                .id(id)
                .response(authenticator)
                .clientExtensionResults(extensionOutput)
                .build();
    }

    private FinishRegistrationOptions createFinishRegistrationOptions(PublicKeyCredentialCreationOptions publicKey, PublicKeyCredential credential) {
        return FinishRegistrationOptions.builder()
                .request(publicKey)
                .response(credential)
                .build();
    }
}
```

### Registration Controller
Create a controller `RegistrationController` with 2 endpoints, the `start registration` and `verify registration`.

```java
@AllArgsConstructor
@RestController
@RequestMapping("/register")
@CrossOrigin("http://localhost:4200")
public class RegistrationController {

    private final StartRegistrationService startRegistrationService;
    private final VerifyRegistrationService verifyRegistrationService;

    @PostMapping("/start")
    public ResponseEntity<StartRegisterResponseResource> startRegistration(@RequestBody StartRegisterRequestResource resource) throws JsonProcessingException {
        return ResponseEntity.ok(startRegistrationService.startRegistration(resource));
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyRegistrationResponseResource> verifyRegistration(@RequestBody VerifyRegistrationRequestResource resource) throws Base64UrlException, IOException {
        return ResponseEntity.ok(verifyRegistrationService.verify(resource));
    }
}
```

### Create login resources

```java
public record AllowCredentialsResponseResource(ByteArray id, String type, 
                                               Set<AuthenticatorTransport> transports) {
}
```

```java
public record AssertionRequestResource(ByteArray id, ByteArray rawId, AssertionResource response,
                                       String type, Object clientExtensionResults, 
                                       String authenticatorAttachment) {
}
```

```java
public record AssertionResource(ByteArray authenticatorData, ByteArray clientDataJSON, ByteArray signature) {
}
```

```java
public record LoginRequestResource(String username) {
}
```

```java
public record LoginResponseResource(String challenge, List<AllowCredentialsResponseResource> allowCredentials,
                                    int timeout, String userVerification, String rpId) {
}
```

```java
public record VerifyLoginRequestResource(String username, AssertionRequestResource response) {
}
```

```java
public record VerifyLoginResponseResource(boolean verified) {
}
```


### Start Login Service
Create a service `StartLoginService`.

```java
@Slf4j
@AllArgsConstructor
@Service
public class StartLoginService {

    private final RelyingParty relyingParty;
    private final UserRepository userRepository;

    public LoginResponseResource startLogin(LoginRequestResource resource) throws JsonProcessingException {
        User user = getUser(resource.username());

        StartAssertionOptions assertionOptions = createStartAssertionOptions(user.getUsername());
        AssertionRequest assertionRequest = relyingParty.startAssertion(assertionOptions);
        List<AllowCredentialsResponseResource> credentials = getAllowCredentials(assertionRequest);

        user.setAssertion(assertionRequest.toJson());
        userRepository.save(user);

        return new LoginResponseResource(assertionRequest.getPublicKeyCredentialRequestOptions().getChallenge().getBase64Url(),
                credentials, 60000, "preferred", relyingParty.getIdentity().getId());
    }

    private User getUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty() || !user.get().isRegistrationComplete()) {
            if (user.isEmpty()) {
                log.error("User with username {} not found", username);
            } else {
                log.error("Registration for username {} is not complete", username);
            }
            throw new RuntimeException(String.format("User with username %s not registered", username));
        }
        return user.get();
    }

    private StartAssertionOptions createStartAssertionOptions(String username) {
        return StartAssertionOptions.builder()
                .timeout(60000)
                .username(username)
                .userVerification(UserVerificationRequirement.PREFERRED)
                .build();
    }

    private List<AllowCredentialsResponseResource> getAllowCredentials(AssertionRequest assertionRequest) {
        List<AllowCredentialsResponseResource> allowCredentialsList = new ArrayList<>();

        Optional<List<PublicKeyCredentialDescriptor>> keys = assertionRequest.getPublicKeyCredentialRequestOptions().getAllowCredentials();
        if (keys.isPresent()) {
            keys.get().forEach(key -> {
                if (key.getTransports().isPresent()) {
                    log.info("Transports found");
                    Set<AuthenticatorTransport> transports = key.getTransports().get();
                    allowCredentialsList.add(new AllowCredentialsResponseResource(key.getId(), key.getType().getId(), transports));
                } else {
                    log.error("Transports not found");
                }
            });
        }
        return allowCredentialsList;
    }
}
```

### Verify Login Service
Create a service `VerifyLoginService`.

```java
@Slf4j
@AllArgsConstructor
@Service
public class VerifyLoginService {

    private final RelyingParty relyingParty;
    private final UserRepository userRepository;

    public VerifyLoginResponseResource verify(VerifyLoginRequestResource resource) throws IOException, Base64UrlException {
        User user = getUser(resource.username());

        AssertionRequest assertionRequest = createAssertionRequest(user.getAssertion());
        AuthenticatorAssertionResponse assertionResponse = createAuthenticatorAssertionResponse(resource);

        PublicKeyCredential publicKeyCredential = createPublicKeyCredential(resource, assertionResponse);

        FinishAssertionOptions finishAssertionOptions = createFinishAssertionOptions(assertionRequest, publicKeyCredential);

        AssertionResult result;
        try {
            result = relyingParty.finishAssertion(finishAssertionOptions);
        } catch (AssertionFailedException e) {
            user.setAssertion(null);
            userRepository.save(user);
            return new VerifyLoginResponseResource(false);
        }

        user.setAssertion(null);
        userRepository.save(user);
        if (result.isSuccess()) {
            return new VerifyLoginResponseResource(true);
        } else {
            return new VerifyLoginResponseResource(false);
        }

    }

    private User getUser(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty() || !user.get().isRegistrationComplete()) {
            if (user.isEmpty()) {
                log.error("User with username {} not found", username);
            } else {
                log.error("Registration for username {} is not complete", username);
            }
            throw new RuntimeException(String.format("User with username %s not registered", username));
        }
        return user.get();
    }

    private AssertionRequest createAssertionRequest(String json) throws JsonProcessingException {
        return AssertionRequest.fromJson(json);
    }

    private AuthenticatorAssertionResponse createAuthenticatorAssertionResponse(VerifyLoginRequestResource resource) throws Base64UrlException, IOException {
        return AuthenticatorAssertionResponse.builder()
                .authenticatorData(resource.response().response().authenticatorData())
                .clientDataJSON(resource.response().response().clientDataJSON())
                .signature(resource.response().response().signature())
                .build();
    }

    private PublicKeyCredential createPublicKeyCredential(VerifyLoginRequestResource resource, AuthenticatorAssertionResponse response) {
        CustomClientExtensionOutput customClientExtensionOutput = new CustomClientExtensionOutput();

        return PublicKeyCredential.builder()
                .id(resource.response().id())
                .response(response)
                .clientExtensionResults(customClientExtensionOutput)
                .build();
    }

    private FinishAssertionOptions createFinishAssertionOptions(AssertionRequest assertionRequest, PublicKeyCredential publicKeyCredential) {
        return FinishAssertionOptions.builder()
                .request(assertionRequest)
                .response(publicKeyCredential)
                .build();
    }
}
```

### Login Controller
Create a controller `LoginController` with 2 endpoints, the `start login` and `verify login`.

```java
@AllArgsConstructor
@RestController
@RequestMapping("/login")
@CrossOrigin("http://localhost:4200")
public class LoginController {
    private final StartLoginService startLoginService;
    private final VerifyLoginService verifyLoginService;

    @PostMapping("/start")
    public ResponseEntity<LoginResponseResource> startLogin(@RequestBody LoginRequestResource resource) throws JsonProcessingException {
        return ResponseEntity.ok(startLoginService.startLogin(resource));
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyLoginResponseResource> verifyLogin(@RequestBody VerifyLoginRequestResource resource) throws Base64UrlException, IOException {
        return ResponseEntity.ok(verifyLoginService.verify(resource));
    }
}
```

## Create a new Angular application

Create a new Angular project with routing enabled.
```bash
ng new frontend --routing true --style css
```

Install the needed packages.
```
npm i @simplewebauthn/browser
ng add @ng-bootstrap/ng-bootstrap
```

Complete the app modules in the `app.module.ts` file.
Add the `FormsModule` and `HttpClientModule`.

```typescript
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

### Create services
We are going to create 2 services, the `RegisterService` and `LoginService`.

```bash
ng generate service service/register
ng generate service service/login
```

Paste the following code in the `register.service.ts` file.
```typescript
export class RegisterService {

    constructor(private http: HttpClient) { }

    register(username: string): Observable<PublicKeyCredentialCreationOptionsJSON> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        };

        const body = {
            'username': username
        };

        return this.http.post<PublicKeyCredentialCreationOptionsJSON>('http://localhost:8080/register/start', body, httpOptions).pipe();
    }

    verify(username: any, attestationResponse: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        };

        const body = {
            'username': username,
            'response': attestationResponse
        };

        return this.http.post('http://localhost:8080/register/verify', body, httpOptions).pipe();
    }
}
```

Paste the following code in the `login.service.ts` file.
```typescript
export class LoginService {

    constructor(private http: HttpClient) { }

    login(username: string): Observable<PublicKeyCredentialRequestOptionsJSON> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        };

        const body = {
            'username': username
        };

        return this.http.post<PublicKeyCredentialRequestOptionsJSON>('http://localhost:8080/login/start', body, httpOptions).pipe();
    }

    verify(username: string, assertionResponse: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
        };

        const body = {
            'username': username,
            'response': assertionResponse
        };

        return this.http.post('http://localhost:8080/login/verify', body, httpOptions).pipe();
    }
}
```

### Create components

```bash
ng generate component component/home -s
ng generate component component/user -s
```

Delete the existing content in the `app.component.html` file and fill in the following code.
```html
<router-outlet></router-outlet>
```

Complete the routing configuration in the `app.routing.module.ts` file
```typescript
const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'user', component: UserComponent},
    {path: '', component: HomeComponent},
    {path: '**', redirectTo: 'home'}
];
```

Paste the following code in the `home.component.ts` file.
```typescript
import {Component} from '@angular/core';
import {LoginService} from "../../service/login.service";
import {RegisterService} from "../../service/register.service";
import {startAuthentication, startRegistration} from "@simplewebauthn/browser";
import {Router} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [
    ]
})
export class HomeComponent {

    username: string;

    constructor(private registerService: RegisterService, private loginService: LoginService, private router: Router) {
        this.username = '';
    }

    register() {
        this.registerService.register(this.username).subscribe(result => {
            startRegistration(result).then(result => {
                this.registerService.verify(this.username, result).subscribe(result => {
                    type ObjectKey = keyof typeof result;

                    const verifiedVar = 'verified' as ObjectKey;
                    const verified = result[verifiedVar].toString();

                    if (verified === 'true') {
                        alert('Registration success.');
                    } else {
                        alert('Registration failed.');
                    }
                });
            }, error => {
                console.error(error);
                alert('Registration failed.');
            });
        });
    }

    login() {
        this.loginService.login(this.username).subscribe(result => {
            startAuthentication(result).then(result => {
                this.loginService.verify(this.username, result).subscribe(result => {
                    type ObjectKey = keyof typeof result;

                    const verifiedVar = 'verified' as ObjectKey;
                    const verified = result[verifiedVar].toString();

                    if (verified === 'false') {
                        alert('Login failed.');
                    } else {
                        this.router.navigateByUrl('/user');
                    }
                });
            }, error => {
                console.error(error);
                alert('Login failed.');
            });
        });
    }
}
```

Paste the following code in the `home.component.html` file.
```html
<div class="container mt-5">
    <div class="row">
        <div class="col-sm-12 col-md-8 info-text mt-5">
            <p>Experience a new era of online security with FIDO Passwordless Authentication. Say goodbye to the hassle of remembering and managing passwords. 
            Our cutting-edge technology ensures a seamless and secure login process for users, making online interactions effortless and worry-free.</p>
        </div>

        <div class="col-sm-12 col-md-4">
            <form>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" aria-describedby="usernameHelp"
                           [(ngModel)]="username" [ngModelOptions]="{standalone: true}">
                    <div id="usernameHelp" class="form-text">We'll never share your info with anyone else.</div>
                </div>
                <button type="submit" class="btn btn-primary" (click)="register()">Register</button>
                <button type="submit" class="btn btn-primary ms-2" (click)="login()">Login</button>
            </form>
        </div>
    </div>
</div>
```

Paste the following code in the `user.component.html` file.
```html
<p>Welcome</p>
```

## Conclusion
Embracing FIDO and Passkeys represents a leap forward in security and user-friendliness. 
By shifting away from traditional password-based authentication methods, users benefit from heightened security measures while enjoying a more seamless and user-friendly experience. 
The combination of FIDO's robust security protocols and the convenience of passkeys not only enhances protection against cyber threats but also simplifies the user authentication process, 
contributing to a more secure and user-centric online environment. Embracing these advancements not only aligns with the evolving landscape of digital security 
but also empowers users with a more efficient and trustworthy means of safeguarding their online identities. 
It's a win-win that positions FIDO and passkeys as a compelling choice for the future of secure and user-friendly authentication.


## Extra
If you're interested in exploring the implementation details, you can access the frontend and backend code on GitHub.
* [Backend](https://github.com/nicholasM95/passwordless-backend){:target="_blank" rel="noopener noreferrer"}
* [Frontend](https://github.com/nicholasM95/passwordless-frontend){:target="_blank" rel="noopener noreferrer"}

If you want to start the application locally, you can start the Docker containers and visit [the project locally](http://localhost:4200){:target="_blank" rel="noopener noreferrer"}.
```bash
docker run -p 8080:8080 nicholas95/passwordless-backend:v1
docker run -p 4200:80 nicholas95/passwordless-frontend:v1
```

**Note:** I encountered issues with local development when testing in a browser with the Bitwarden extension enabled.
