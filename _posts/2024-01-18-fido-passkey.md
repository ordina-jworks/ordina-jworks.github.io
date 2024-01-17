---
layout: post
authors: [nicholas_meyers]
title: 'Understanding FIDO & Passkeys: Guide for Spring Boot and Angular Apps'
image: /img/2024-01-18-fido-passkey/banner.png
tags: [Security, Spring Boot, Angular]
category: Security
comments: true
---

> What's a common vulnerability in applications? Isn't it the traditional username & password login? Perhaps it's time to embrace FIDO & Passkeys for a more secure login method.

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
Conversely, if a message is encrypted with the private key, it can be decrypted using the public key. 
This method is used in signatures, to validate the identity of the sender of the information.

So, how is this technology employed in FIDO? During registration, your device generates a unique passkey, which contains a public key and a private key.
The public key is stored on the service provider's server, while the private key remains securely on your device (smartphone, tablet, or a dedicated FIDO security key).

To register as a new user, you must send our public key to the server for validation. 
The server will return a challenge that you must sign using your private key. 
If the server can verify the signature using your public key, the registration is complete.

To authenticate a user, send your username to the server, and the server will answer with a challenge encrypted with your public key. 
On your device, we need to decrypt the challenge with your private key, solve the challenge, and return your response encrypted with your private key.
After sending the encrypted response, the server can validate the response using your public key.
If the challenge is correct, the server approves the login. 

In this way we no longer store the user's passwords, but only their public key which can be shared openly.

For a deeper understanding and visual examples, check out the video below.

{% include youtube-player.html id='lRFeuSH9t44' aspect-ratio='21:9' %}

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
The assertion contains information such as user identification, the authentication method used, cryptographic key information, and challenge to ensure the authenticity of the user.  It is rebuilt by the server when a user attempts to log in, and it will expire after a short time.
The authenticator on the client uses this information to validate the server and to solve the challenge with the private key.\
The public key JSON is generated on the server side and will be used during the registration process. It contains all the parameters and options necessary for generating a new public key for the respective user. The authenticator on the client will use these options to generate the new key.\
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

And configure the h2 database in the `application.properties` file.
```properties
spring.datasource.url=jdbc:h2:mem:db;DB_CLOSE_DELAY=-1;NON_KEYWORDS=USER
spring.datasource.driverClassName=org.h2.Driver
```

### Create utils

Because Yubico's dependency works with their own object ByteArray instead of byte[], we create a small class to easily convert between them.

Create a `ByteArrayUtils` class.

```java
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ByteArrayUtils {
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

In addition to the repositories that interact with the database, we also have an implementation of the [CredentialRepository](https://developers.yubico.com/java-webauthn-server/JavaDoc/webauthn-server-core/2.0.0/com/yubico/webauthn/CredentialRepository.html){:target="_blank" rel="noopener noreferrer"} from Yubico.\
This is used by [RelyingParty](https://developers.yubico.com/java-webauthn-server/JavaDoc/webauthn-server-core/2.0.0/com/yubico/webauthn/RelyingParty.html){:target="_blank" rel="noopener noreferrer"} to look up credentials, usernames and user handles from usernames, user handles and credential ids.

```java
@Slf4j
@RequiredArgsConstructor
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
A "Relying Party" (RP) is an entity, typically a website or an online service, that relies on FIDO-based authentication to verify the identity of users. The relying party initiates and manages the FIDO authentication process to ensure secure and user-friendly login experiences.

The `AuthenticatorSelectionCriteria` is a set of criteria used to specify preferences for the characteristics of the authenticator that should be used during the credential creation process.

The [AuthenticatorAttachment](https://developers.yubico.com/java-webauthn-server/JavaDoc/webauthn-server-core/2.0.0/com/yubico/webauthn/data/AuthenticatorAttachment.html){:target="_blank" rel="noopener noreferrer"} this enumeration’s values describe authenticators' attachment modalities.
* `CROSS_PLATFORM`: Passkey will be stored on another device. (hardware key, smartphone if you are working on a computer)
* `PLATFORM`: You need to register with a built-in biometric. (fingerprint, face id)\
**Note:** If this field is not set, both methods are activated.

The [ResidentKeyRequirement](https://developers.yubico.com/java-webauthn-server/JavaDoc/webauthn-server-core/2.0.0/com/yubico/webauthn/data/ResidentKeyRequirement.html){:target="_blank" rel="noopener noreferrer"} this enumeration's values describe the Relying Party's requirements for client-side discoverable credentials.
* `DISCOURAGED`: The client and authenticator will try to create a server-side credential if possible, and a discoverable credential otherwise.
* `PREFERRED`: The client and authenticator will try to create a discoverable credential if possible, and a server-side credential otherwise.
* `REQUIRED`: The client and authenticator will try to create a discoverable credential, and fail the registration if that is not possible.

The [UserVerificationRequirement](https://developers.yubico.com/java-webauthn-server/JavaDoc/webauthn-server-core/2.0.0/com/yubico/webauthn/data/UserVerificationRequirement.html){:target="_blank" rel="noopener noreferrer"} a WebAuthn Relying Party may require user verification for some of its operations.
* `DISCOURAGED`: This value indicates that the Relying Party does not want user verification.
* `PREFERRED`: This value indicates that the Relying Party prefers user verification for the operation if possible, but will not fail if the verification isn't available.
* `REQUIRED`: Indicates that the Relying Party requires user verification for the operation and will fail if the verification isn't available.

The `PublicKeyCredentialParameters` is a data structure used to specify the cryptographic algorithms and key types that a relying party (or website) is willing to accept during the credential creation process.


```java
@RequiredArgsConstructor
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

The `ClientExtensionOutputs` refers to the output of client extensions during the [WebAuthn](https://webauthn.guide/){:target="_blank" rel="noopener noreferrer"} process, 
such as creating a public key credential or authentication. This output may contain information specific to the used extensions.

```java
public class CustomClientExtensionOutput implements ClientExtensionOutputs {
    @Override
    public Set<String> getExtensionIds() {
        return Collections.emptySet();
    }
}
```

### Create registration web resources

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

Create a service `StartRegistrationService`.\
In the start registration service, we prepare everything for the registration of a new user. 
We create a user, challenge, registration options, and send them back in the response with the information of our application.

```java
@RequiredArgsConstructor
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

Create a service `VerifyRegistrationService`.\
In the verify registration service, we will verify the registration. 
The frontend application has processed the response from the start registration service and sends the result back to the verify service. 
If the verification is successful, the user is registered.

```java
@Slf4j
@RequiredArgsConstructor
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
@RequiredArgsConstructor
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

### Create login web resources

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

Create a service `StartLoginService`.\
In the start login service, we will check if the user is registered and prepare everything for the login. 
We create a challenge and send it back in the response along with the information of our application and the details of 
the key used in the challenge.

```java
@Slf4j
@RequiredArgsConstructor
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

Create a service `VerifyLoginService`.\
In the verify login service, we will verify the login. The frontend application has processed the response from the start login service
and sends the result back to the verify service. If the verification is successful, the user is logged in.

```java
@Slf4j
@RequiredArgsConstructor
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
@RequiredArgsConstructor
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

The `@simplewebauthn/browser` package in Angular provides a convenient and simplified way to integrate WebAuthn (Web Authentication) functionality into your Angular applications. 
By using this package, you can streamline the implementation of WebAuthn features such as secure and passwordless authentication, 
enhancing the overall security of your application. This package abstracts the complexities of the WebAuthn API, 
making it easier for developers to incorporate modern authentication methods without delving into intricate details, 
saving time and effort in the development process.

The `@ng-bootstrap/ng-bootstrap` package in Angular provides a set of native Angular directives for [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/){:target="_blank" rel="noopener noreferrer"} components.

```
npm i @simplewebauthn/browser
ng add @ng-bootstrap/ng-bootstrap
```

Complete the app modules in the `app.module.ts` file.
Add the `FormsModule` and `HttpClientModule`.

The `FormsModule` is a module that provides support for two-way data binding through the ngModel directive.
This means that changes to the model in the component are automatically reflected in the associated view, and vice versa.

The `HttpClientModule` is a module that provides the HttpClient service, which is a powerful and feature-rich HTTP client for making requests to a server.

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

Paste the following code in the `register.service.ts` file.\
In the registration service, we will be constructing a client that can send requests to our backend service for registration.

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

Paste the following code in the `login.service.ts` file.\
In the login service, we will be constructing a client that can send requests to our backend service for authentication.

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

Delete the existing content in the `app.component.html` file and fill in the following code.\
In Angular, `<router-outlet></router-outlet>` is a directive that plays a crucial role in managing the routing of your application.

```html
<router-outlet></router-outlet>
```

Complete the routing configuration in the `app.routing.module.ts` file.

```typescript
const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'user', component: UserComponent},
    {path: '', component: HomeComponent},
    {path: '**', redirectTo: 'home'}
];
```

Paste the following code in the `home.component.ts` file.

In the `register` function, we send a request to our backend service with a username for which we want to create a new account. 
If everything is okay, the response will contain the necessary result to initiate our registration with WebAuthn. 
WebAuthn will then display the appropriate screens to create the passkeys. 
The result of the WebAuthn action is then sent back to the backend service to complete the registration.

In the `login` function, we send a request to our backend service with a username for which we want to initiate a login. 
If everything is okay, the response will contain the necessary result to start the login process with WebAuthn. 
WebAuthn will then display the screens to solve the challenge with the previously created passkey. 
The result of the WebAuthn action is then sent back to the backend service to complete the authentication.

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

Paste the following code in the `home.component.html` file.\
On this page, we display an input text field for the username, a button for registration, and a button for login.

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

Paste the following code in the `user.component.html` file.\
We show this welcome screen for the user when the login is successful.

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
Curious which companies are already switched to a password less authentication? Check out [this website](https://www.passkeys.io/who-supports-passkeys){:target="_blank" rel="noopener noreferrer"}

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
