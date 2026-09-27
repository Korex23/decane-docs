import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { DocsCards } from "@/app/docs/components/DocsCards";
import { hl, type Lang } from "@/app/docs/components/highlight";
import { VERSIONS } from "@/lib/versions";
import type { DocPage, SearchEntry } from "@/app/docs/components/types";

// The Kotlin SDK (app.decane:decane-kit), written from sdk-native/kotlin in the
// monorepo: decane/src/main/kotlin/app/decane/kit/*.kt and the package README.

function Code({ code, lang = "kotlin", file }: { code: string; lang?: Lang; file?: string }) {
  return <CodeBlock lang={lang} file={file}>{hl(code.trim(), lang)}</CodeBlock>;
}

const IDENTITY_STATEMENT = (
  <div className="docs-callout" data-kind="security">
    <div className="ico">✓</div>
    <p>
      <strong>The identity tier&rsquo;s security statement:</strong> a wallet is exactly as safe as
      the user&rsquo;s identity-provider account plus Decane (the JWT signing key and the attested
      enclave). Anyone who can obtain a valid Decane session for the user can sign. There is no
      device-bound factor. Mitigations: a new-device email on every provision from an unseen
      device, a per-user freeze switch operated by Decane, and (follow-up) a fresh sign-in
      requirement for high-value operations.
    </p>
  </div>
);

export const PAGES: DocPage[] = [
  {
    slug: "overview", navLabel: "Introduction", group: "Get started", icon: "home",
    title: "Decane wallets in native Android apps.",
    body: (
      <>
        <p className="docs-lede">
          <strong>decane-kit</strong> is the Kotlin SDK for Decane embedded wallets on Android.
          Users sign in with email, phone or a token you already hold and get EVM, Solana and Tron
          addresses from one key. It is a Kotlin layer over the shared Rust wallet core, the same
          core as the Swift SDK, and byte-compatible with the web and Expo SDKs: a wallet made in
          one opens in the others.
        </p>
        <dl className="docs-facts">
          <div><dt>Requires</dt><dd>Android 9 (API 28)+, Kotlin, JVM 17</dd></div>
          <div><dt>Artifact</dt><dd><code>app.decane:decane-kit</code> {VERSIONS.kotlin}</dd></div>
          <div><dt>Install</dt><dd>Gradle, from GitHub Packages</dd></div>
          <div><dt>Style</dt><dd>Coroutines and <code>SharedFlow</code></dd></div>
        </dl>
        <p>
          The private key is never assembled on the phone. A 2-of-3 Shamir split puts one share on
          the device, one on the server and one sealed in the enclave, which reconstructs the key
          internally, for the moment it takes to sign.
        </p>
        <div className="docs-callout" data-kind="warn">
          <div className="ico">!</div>
          <p>
            <strong>{VERSIONS.kotlin} implements the identity tier only.</strong> Sign-in, wallet
            creation, provisioning and every kind of signing work. The device tier, passkeys,
            browser sign-in and recovery files arrive in the next release without changing this
            API. See <a href="/kotlin-docs/roadmap">What&rsquo;s not in this version</a>.
          </p>
        </div>
        <DocsCards
          items={[
            { href: "/kotlin-docs/install", title: "Install", desc: "Add the GitHub Packages repository and the dependency." },
            { href: "/kotlin-docs/quick-start", title: "Quick start", desc: "Sign a user in and sign a message." },
            { href: "/kotlin-docs/sessions", title: "Sessions and launch", desc: "Restore on launch, reconnect, and collect events." },
            { href: "/kotlin-docs/signing", title: "Signing", desc: "Messages, EVM, EIP-712, EIP-7702, Solana and Tron." },
            { href: "/kotlin-docs/platform", title: "Platform hooks", desc: "Keystore, OkHttp and attestation, replaceable." },
            { href: "/kotlin-docs/wallet", title: "API reference", desc: "Every method and property on DecaneWallet." },
          ]}
        />
      </>
    ),
  },
  {
    slug: "install", group: "Get started", title: "Install", icon: "package",
    body: (
      <>
        <p>
          The library is on GitHub Packages, which asks for a token even to read. Create a classic
          personal access token with only <code>read:packages</code> and put it in your user
          Gradle properties, never in the project:
        </p>
        <Code lang="properties" file="~/.gradle/gradle.properties" code={`
gpr.user=your-github-username
gpr.key=ghp_…`} />
        <Code file="settings.gradle.kts" code={`
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
        maven {
            url = uri("https://maven.pkg.github.com/Korex23/decane-connect-kit")
            credentials {
                username = providers.gradleProperty("gpr.user").get()
                password = providers.gradleProperty("gpr.key").get()
            }
        }
    }
}`} />
        <Code file="app/build.gradle.kts" code={`
android {
    defaultConfig {
        minSdk = 28
        // Required: the scheme of your redirect URI.
        manifestPlaceholders["decaneRedirectScheme"] = "myapp"
    }
}

dependencies {
    implementation("app.decane:decane-kit:0.1.0")
}`} />
        <p>
          The AAR carries <code>libdecane_ffi.so</code> for <code>arm64-v8a</code>,{" "}
          <code>armeabi-v7a</code> and <code>x86_64</code>, plus its R8 rules.{" "}
          <code>Decane.init(application)</code> runs automatically through{" "}
          <code>androidx.startup</code>; if your app removes the startup provider, call it from{" "}
          <code>Application.onCreate</code>.
        </p>
        <h2 id="credentials">What you need from the dashboard</h2>
        <p>
          Your project id (<code>proj_…</code>) and a publishable API key (<code>dck_live_…</code>).
          The publishable key is safe to ship in an app; never ship the project secret.
        </p>
      </>
    ),
  },
  {
    slug: "quick-start", group: "Get started", title: "Quick start", icon: "rocket",
    body: (
      <>
        <h2 id="create">1. Create the wallet</h2>
        <p>Create one <code>DecaneWallet</code> per process and keep it, for example in your <code>Application</code>.</p>
        <Code file="App.kt" code={`
import app.decane.kit.DecaneConfig
import app.decane.kit.DecaneWallet
import app.decane.kit.Protection

val wallet = DecaneWallet.create(
    context,
    DecaneConfig(
        appId = "proj_…",
        apiKey = "dck_live_…",
        chains = listOf("evm:8453", "solana:mainnet", "tron:mainnet"),
        protection = Protection.IDENTITY,   // the tier this version implements
    ),
)`} />
        <h2 id="sign-in">2. Sign the user in</h2>
        <Code code={`
lifecycleScope.launch {
    wallet.connectWithEmail("ada@example.com")
    val result = wallet.verifyEmailCode("ada@example.com", "123456")

    result.addresses.evm      // the same addresses the web SDK shows
    result.addresses.solana
    result.addresses.tron
    result.isNewUser
}`} />
        <p>
          Every call is <code>suspend</code> and can be made from any dispatcher: the core runs on
          its own threads.
        </p>
        <h2 id="sign">3. Sign</h2>
        <Code code={`val signature = wallet.signMessage("evm:8453", "hello")`} />
      </>
    ),
  },
  {
    slug: "app-setup", group: "Get started", title: "App setup", icon: "sliders",
    body: (
      <>
        <h2 id="backups">Backups</h2>
        <p>
          Point <code>android:dataExtractionRules</code> (API 31+) and{" "}
          <code>android:fullBackupContent</code> (API 28 to 30) at{" "}
          <code>@xml/decane_backup_rules</code>, or copy its two <code>&lt;exclude&gt;</code>{" "}
          lines into your own rules. The store is encrypted under a key that lives only in this
          device&rsquo;s keystore, so a restored copy would read as empty anyway.
        </p>
        <Code lang="xml" file="AndroidManifest.xml" code={`
<application
    android:dataExtractionRules="@xml/decane_backup_rules"
    android:fullBackupContent="@xml/decane_backup_rules"
    …>`} />
        <h2 id="redirect">Redirect scheme</h2>
        <p>
          For browser sign-in in the next release: set{" "}
          <code>manifestPlaceholders[&quot;decaneRedirectScheme&quot;]</code>, pass{" "}
          <code>redirectUri = &quot;myapp://auth&quot;</code> in <code>DecaneConfig</code>, and
          register that exact URL as the API key&rsquo;s <strong>first</strong> callback URL in
          the dashboard. A native app sends no Origin, so it gets the first one.
        </p>
        <h2 id="passkeys">Passkeys</h2>
        <p>
          Also next release. Set <code>rpId</code> to a domain you control and serve{" "}
          <code>https://&lt;rpId&gt;/.well-known/assetlinks.json</code> with the{" "}
          <code>delegate_permission/common.get_login_creds</code> relation for your package and
          signing-certificate SHA-256. Set <code>origin</code> to{" "}
          <code>android:apk-key-hash:&lt;base64url of that SHA-256&gt;</code>.
        </p>
        <h2 id="biometrics">Biometric prompts</h2>
        <p>
          The device tier needs the foreground activity to be a <code>FragmentActivity</code>;{" "}
          <code>AppCompatActivity</code> is one.
        </p>
      </>
    ),
  },
  {
    slug: "sign-in", group: "Sign-in", title: "Sign-in methods", navLabel: "Methods", icon: "key",
    body: (
      <>
        <p>Every method returns a <code>ConnectResult</code> with the addresses and <code>isNewUser</code>.</p>
        <h2 id="email">Email code</h2>
        <Code code={`
wallet.connectWithEmail(email)
val result = wallet.verifyEmailCode(email, code)`} />
        <h2 id="phone">Phone code</h2>
        <Code code={`
wallet.connectWithPhone("+2348012345678")   // E.164
val result = wallet.verifyPhoneCode("+2348012345678", code)`} />
        <h2 id="tokens">A token you already hold</h2>
        <Code code={`
wallet.connectWithGoogleToken(idToken)                 // from Credential Manager / Google Sign-In
wallet.connectWithKingsChatToken(accessToken)          // a KingsChat access token
wallet.connectWithToken(myJwt, providerId = "prov-1")  // your own auth`} />
        <h2 id="profile">The provider profile</h2>
        <p>
          <code>result.profile</code> carries the name, email, picture and username when the
          provider supplied them. Decane never stores it, so read it at sign-in.
        </p>
        <h2 id="not-yet">Not in this version</h2>
        <p>
          <code>connectWithGoogle()</code>, <code>connectWithX()</code>,{" "}
          <code>connectWithKingsChat()</code> (Custom Tabs) and <code>signInWithPasskey()</code>{" "}
          are on the API already and throw <code>DecaneException.CallSequence</code> or{" "}
          <code>PlatformHookMissing</code> with a message that says so.
        </p>
      </>
    ),
  },
  {
    slug: "sessions", group: "Sign-in", title: "Sessions and launch", navLabel: "Sessions", icon: "history",
    body: (
      <>
        <h2 id="launch">On launch</h2>
        <Code code={`
lifecycleScope.launch {
    wallet.initialize()
    when {
        wallet.isUnlocked -> showHome(wallet.addresses!!)
        wallet.needsReconnect -> showSignIn()
        else -> showSignIn()
    }
}`} />
        <p>
          A persisted session survives an app restart until its recorded expiry; set{" "}
          <code>persistSession = false</code> if you don&rsquo;t want that. The synchronous state
          is on properties that never block:
        </p>
        <Code code={`
wallet.isUnlocked          // a session is open and can sign
wallet.needsReconnect      // the user must sign in again
wallet.addresses           // Addresses?
wallet.accessToken         // the Decane JWT, for your own backend
wallet.sessionExpiresAtMs  // Long?`} />
        <p>
          Sessions last eight hours and are renewed automatically before they lapse, up to seven
          days after sign-in. Send <code>wallet.accessToken</code> to your backend as a bearer
          token and verify it with a <a href="/node-docs">server SDK</a>.
        </p>
        <h2 id="events">Events</h2>
        <p><code>events</code> is a <code>SharedFlow&lt;DecaneEvent&gt;</code>:</p>
        <Code code={`
lifecycleScope.launch {
    wallet.events.collect { event ->
        when (event) {
            is DecaneEvent.Connected -> render(event.result.addresses)
            DecaneEvent.SessionExpired -> showSignIn()
            else -> Log.d("decane", event.name)
        }
    }
}`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Event</th><th>Name</th><th>When</th></tr></thead>
          <tbody>
            <tr><td><code>Connected(result)</code></td><td><code>connected</code></td><td>A sign-in or resume finished</td></tr>
            <tr><td><code>Disconnected</code></td><td><code>disconnected</code></td><td><code>disconnect()</code> ran</td></tr>
            <tr><td><code>SessionStarted</code></td><td><code>session-started</code></td><td>An enclave session opened</td></tr>
            <tr><td><code>SessionRenewed</code></td><td><code>session-renewed</code></td><td>The token was refreshed</td></tr>
            <tr><td><code>SessionExpired</code></td><td><code>session-expired</code></td><td>The session ended; sign in again</td></tr>
            <tr><td><code>WalletCreating</code></td><td><code>wallet-creating</code></td><td>A new wallet is being made</td></tr>
            <tr><td><code>WalletUnlocking</code></td><td><code>wallet-unlocking</code></td><td>An existing wallet is being opened</td></tr>
            <tr><td><code>EnrolmentFailed(message)</code></td><td><code>enrolment-failed</code></td><td>Creation stopped; nothing was left behind</td></tr>
            <tr><td><code>MigratedToIdentity</code></td><td><code>migrated-to-identity</code></td><td>A device-tier wallet moved to the identity tier</td></tr>
          </tbody>
        </table></div>
        <h2 id="disconnect">Sign-out</h2>
        <Code code={`wallet.disconnect()`} />
        {IDENTITY_STATEMENT}
      </>
    ),
  },
  {
    slug: "signing", group: "Wallet", title: "Signing", icon: "shield",
    body: (
      <>
        <p>
          Signing is sign-only: transactions go in as bytes and come back signed. Broadcast them
          with your own web3 stack. Chain ids are CAIP-2 (<code>evm:8453</code>,{" "}
          <code>solana:mainnet</code>, <code>tron:mainnet</code>).
        </p>
        <h2 id="messages">Messages</h2>
        <Code code={`
val sig = wallet.signMessage("evm:8453", "hello")
val raw = wallet.signMessage("solana:mainnet", bytes)   // ByteArray overload`} />
        <h2 id="evm">EVM transactions</h2>
        <p>Legacy, EIP-2930, EIP-1559 and EIP-7702 transactions, unsigned RLP in, signed RLP out.</p>
        <Code code={`val signed: ByteArray = wallet.signEvmTransaction("evm:8453", unsignedRlp)`} />
        <h2 id="typed-data">EIP-712 typed data</h2>
        <Code code={`val sig = wallet.signTypedData("evm:8453", typedDataJson)`} />
        <h2 id="authorization">EIP-7702 authorizations</h2>
        <Code code={`val auth = wallet.signAuthorization(chainId = 8453, address = delegate, nonce = 0)`} />
        <h2 id="solana">Solana</h2>
        <Code code={`val signed: ByteArray = wallet.signSolanaTransaction(serializedTx)`} />
        <h2 id="tron">Tron</h2>
        <Code code={`val sig = wallet.signTronTransaction(rawDataHex)`} />
      </>
    ),
  },
  {
    slug: "history", group: "Wallet", title: "Transaction history", icon: "list",
    body: (
      <>
        <p>
          Record what the user sent so it shows up on every device they sign in on. The record is
          yours to fill: Decane does not watch the chain.
        </p>
        <Code code={`
val record = wallet.recordTransaction(
    RecordTransactionInput(
        chain = "evm:8453",
        txHash = "0x…",
        to = "0x…",
        value = "1000000000000000",
        kind = "transfer",
        status = "pending",
        metadataJson = """{"note":"rent"}""",
    ),
)

val history = wallet.getTransactionHistory(limit = 50)   // List<TransactionRecord>`} />
      </>
    ),
  },
  {
    slug: "platform", group: "Platform", title: "Platform hooks", icon: "server",
    body: (
      <>
        <p>
          <code>DecaneWallet.create(context, config)</code> installs the defaults below. Pass a{" "}
          <code>DecanePlatform</code> to replace any of them; leave a field null to keep its
          default.
        </p>
        <Code code={`
val wallet = DecaneWallet.create(
    context,
    config,
    DecanePlatform(http = MyTransport(sharedOkHttpClient)),
)`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Hook</th><th>Default</th></tr></thead>
          <tbody>
            <tr><td><code>http</code></td><td><code>OkHttpTransport</code></td></tr>
            <tr><td><code>secureStore</code></td><td><code>KeystoreStorage</code>, encrypted under a hardware-backed AndroidKeyStore key</td></tr>
            <tr><td><code>deviceKey</code></td><td><code>BiometricKey</code>, invalidated when biometric enrolment changes</td></tr>
            <tr><td><code>passkey</code></td><td><code>CredentialManagerPasskeyProvider</code></td></tr>
            <tr><td><code>authSession</code></td><td><code>CustomTabsAuthSession</code>, with the redirect activity</td></tr>
          </tbody>
        </table></div>
        <h2 id="attestation">Attestation</h2>
        <p>
          Without a <code>verifyAttestation</code> hook, the Decane backend verifies the
          enclave&rsquo;s quote against the pinned measurement. In production, forward the quote
          to your own backend:
        </p>
        <Code code={`DecaneConfig(…, verifyAttestation = { quote -> myApi.verifyTeeQuote(quote) })`} />
        <p><code>insecureSkipAttestation</code> is for development only.</p>
      </>
    ),
  },
  {
    slug: "wallet", group: "Reference", title: "API reference", icon: "code",
    body: (
      <>
        <p>Every call is <code>suspend</code> unless it is a property.</p>
        <h2 id="api-signin">Sign-in and session</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Member</th><th>Returns</th></tr></thead>
          <tbody>
            <tr><td><code>DecaneWallet.create(context, config, platform)</code></td><td><code>DecaneWallet</code></td></tr>
            <tr><td><code>initialize()</code></td><td>restores stored state</td></tr>
            <tr><td><code>connect()</code></td><td><code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithEmail(email)</code> / <code>verifyEmailCode(email, code)</code></td><td><code>Unit</code> / <code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithPhone(phone)</code> / <code>verifyPhoneCode(phone, code)</code></td><td><code>Unit</code> / <code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithGoogleToken(idToken)</code>, <code>connectWithKingsChatToken(accessToken)</code></td><td><code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithToken(token, providerId)</code></td><td><code>ConnectResult</code></td></tr>
            <tr><td><code>disconnect()</code></td><td><code>Unit</code></td></tr>
            <tr><td><code>events</code></td><td><code>SharedFlow&lt;DecaneEvent&gt;</code></td></tr>
            <tr><td><code>isUnlocked</code>, <code>needsReconnect</code></td><td><code>Boolean</code></td></tr>
            <tr><td><code>addresses</code>, <code>accessToken</code>, <code>sessionExpiresAtMs</code></td><td>nullable</td></tr>
          </tbody>
        </table></div>
        <h2 id="api-signing">Signing and history</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Member</th><th>Returns</th></tr></thead>
          <tbody>
            <tr><td><code>signMessage(chain, message: String | ByteArray)</code></td><td><code>String</code></td></tr>
            <tr><td><code>signEvmTransaction(chain, unsigned)</code></td><td><code>ByteArray</code></td></tr>
            <tr><td><code>signTypedData(chain, typedDataJson)</code></td><td><code>String</code></td></tr>
            <tr><td><code>signAuthorization(chainId, address, nonce)</code></td><td><code>SignedAuthorization</code></td></tr>
            <tr><td><code>signSolanaTransaction(serialized)</code></td><td><code>ByteArray</code></td></tr>
            <tr><td><code>signTronTransaction(rawDataHex)</code></td><td><code>String</code></td></tr>
            <tr><td><code>recordTransaction(tx)</code>, <code>getTransactionHistory(limit)</code></td><td><code>TransactionRecord</code>, <code>List&lt;TransactionRecord&gt;</code></td></tr>
            <tr><td><code>getCapabilities()</code></td><td><code>DeviceCapabilities</code></td></tr>
          </tbody>
        </table></div>
        <h2 id="api-later">On the API, enabled next release</h2>
        <p>
          <code>connectWithGoogle()</code>, <code>connectWithX()</code>,{" "}
          <code>connectWithKingsChat()</code>, <code>canSignInWithPasskey()</code>,{" "}
          <code>signInWithPasskey()</code>, <code>canUnlock()</code>, <code>unlock()</code>,{" "}
          <code>hasPasskey()</code>, <code>addPasskey()</code>, <code>removeDeviceUnlock()</code>,{" "}
          <code>rotateShares(password, passwordHint)</code>,{" "}
          <code>exportPortableBackup(password, passwordHint)</code>,{" "}
          <code>recoverWithFile(fileJson, password)</code>.
        </p>
      </>
    ),
  },
  {
    slug: "errors", group: "Reference", title: "Error handling", icon: "alert",
    body: (
      <>
        <p>
          Errors are subclasses of the sealed <code>DecaneException</code>. <code>code</code> is
          identical to the JS SDKs&rsquo; <code>error.code</code>, and <code>retryable</code>{" "}
          matches their <code>error.retryable</code>. Branch on the subclass, or on the code when
          sharing handling with a JS codebase.
        </p>
        <Code code={`
try {
    wallet.verifyEmailCode(email, code)
} catch (e: DecaneException.ReconnectRequired) {
    showSignIn()
} catch (e: DecaneException) {
    if (e.retryable) showRetry(e.message)
    Log.w("decane", e.code)
}`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Class</th><th>Code</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>Network</code></td><td><code>NETWORK</code></td><td>The request never completed</td></tr>
            <tr><td><code>ReconnectRequired</code></td><td><code>RECONNECT_REQUIRED</code></td><td>Sign in again</td></tr>
            <tr><td><code>SessionExpired</code></td><td><code>SESSION_EXPIRED</code></td><td>The session ended</td></tr>
            <tr><td><code>InvalidApiKey</code></td><td><code>INVALID_API_KEY</code></td><td>Key invalid or revoked</td></tr>
            <tr><td><code>WalletEnrolmentFailed</code></td><td><code>WALLET_ENROLMENT_FAILED</code></td><td>Creation stopped; nothing was left behind, sign in again</td></tr>
            <tr><td><code>WalletExists</code></td><td><code>WALLET_EXISTS</code></td><td>The account already has a wallet; it is opened instead</td></tr>
            <tr><td><code>ProvisioningRateLimited</code></td><td><code>PROVISIONING_RATE_LIMITED</code></td><td>Opened on too many devices this hour</td></tr>
            <tr><td><code>ProvisioningTimeout</code></td><td><code>PROVISIONING_TIMEOUT</code></td><td>Wallet setup took too long</td></tr>
            <tr><td><code>AttestationFailed</code></td><td><code>ATTESTATION_FAILED</code></td><td>The enclave could not be verified</td></tr>
            <tr><td><code>EnclaveHttp</code></td><td><code>ENCLAVE_HTTP</code></td><td>Any other enclave error; retryable for 5xx</td></tr>
            <tr><td><code>CallSequence</code></td><td><code>CALL_SEQUENCE</code></td><td>A call made in the wrong state, or not in this version</td></tr>
            <tr><td><code>PlatformHookMissing</code></td><td><code>NATIVE_MODULE_MISSING</code></td><td>A feature needs a hook that is not installed</td></tr>
            <tr><td><code>UserCancelled</code></td><td><code>USER_CANCELLED</code></td><td>The user dismissed a prompt</td></tr>
          </tbody>
        </table></div>
        <p>
          The device-tier, passkey and recovery errors mirror the JS SDKs: <code>UnlockRequired</code>,{" "}
          <code>WebauthnUnsupported</code>, <code>InvalidPin</code>, <code>ShareCorrupted</code>,{" "}
          <code>NewDevice</code>, <code>StaleDeviceShare</code>, <code>RecoveryFailed</code>,{" "}
          <code>InvalidRecoveryFile</code>, <code>WrongPassword</code>,{" "}
          <code>RecoveryWalletMismatch</code>, <code>ExportNotAuthorized</code>,{" "}
          <code>UnlockTokenRejected</code>, <code>BiometricUnavailable</code>,{" "}
          <code>OriginNotAllowed</code>.
        </p>
      </>
    ),
  },
  {
    slug: "config", group: "Reference", title: "Configuration", icon: "sliders",
    body: (
      <>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Field</th><th>Default</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><code>appId</code></td><td>required</td><td>Your project id</td></tr>
            <tr><td><code>apiKey</code></td><td>required</td><td>Publishable key, <code>dck_live_…</code></td></tr>
            <tr><td><code>chains</code></td><td>required</td><td>CAIP-2 chain ids the app uses</td></tr>
            <tr><td><code>protection</code></td><td><code>DEVICE</code></td><td>Set <code>IDENTITY</code>; <code>create</code> refuses <code>DEVICE</code> in this version</td></tr>
            <tr><td><code>persistSession</code></td><td><code>true</code></td><td>Keep the session across restarts</td></tr>
            <tr><td><code>sessionDurationMinutes</code></td><td>backend default</td><td>Requested session length</td></tr>
            <tr><td><code>apiBaseUrl</code>, <code>teeUrl</code></td><td>production</td><td>Override the backend and enclave URLs</td></tr>
            <tr><td><code>verifyAttestation</code></td><td>none</td><td>Forward the enclave quote to your backend</td></tr>
            <tr><td><code>redirectUri</code>, <code>kingsChatScopes</code></td><td>none</td><td>Browser sign-in (next release)</td></tr>
            <tr><td><code>rpId</code>, <code>rpName</code>, <code>origin</code></td><td>none</td><td>Passkeys (next release)</td></tr>
            <tr><td><code>unlockPreference</code>, <code>promptPin</code></td><td>empty, none</td><td>Device-tier unlock (next release)</td></tr>
            <tr><td><code>requireAssertionPerSignature</code></td><td><code>false</code></td><td>A passkey assertion per signature (device tier)</td></tr>
            <tr><td><code>offerRecoveryAtSignup</code>, <code>rotateOnNewDeviceRecovery</code>, <code>recovery</code></td><td>off</td><td>Recovery files (next release)</td></tr>
            <tr><td><code>insecureSkipAttestation</code></td><td><code>false</code></td><td>Development only</td></tr>
          </tbody>
        </table></div>
      </>
    ),
  },
  {
    slug: "roadmap", group: "Reference", title: "What's not in this version", navLabel: "Not yet", icon: "minus",
    body: (
      <>
        <p>
          {VERSIONS.kotlin} ships the identity tier: nothing is stored on the device and nothing
          is asked for; every visit is a sign-in, after which the enclave provisions a fresh device
          share against the session alone.
        </p>
        {IDENTITY_STATEMENT}
        <p>Not yet, each already on the API so enabling it will not change your code:</p>
        <ul>
          <li>The device tier (<code>Protection.DEVICE</code>), with biometric or PIN unlock.</li>
          <li>Passkeys through Credential Manager, for sign-in and unlock.</li>
          <li>Browser sign-in through Custom Tabs: <code>connectWithGoogle</code>, <code>connectWithX</code>, <code>connectWithKingsChat</code>.</li>
          <li>Recovery files: <code>rotateShares</code>, <code>exportPortableBackup</code>, <code>recoverWithFile</code>.</li>
        </ul>
        <h2 id="android-limit">A known limit on Android</h2>
        <p>
          Per-signature passkey assertions (<code>requireAssertionPerSignature</code>),{" "}
          <code>rotateShares</code> and <code>exportPortableBackup</code> need a small enclave
          change before they work on Android: the enclave derives the WebAuthn RP ID from the
          origin&rsquo;s hostname, and Android&rsquo;s <code>android:apk-key-hash:</code> origin
          has none. Until it ships, those calls fail with an error rather than a prompt. Passkey
          unlock itself is unaffected.
        </p>
      </>
    ),
  },
];

export const ANCHORS: Record<string, string> = Object.fromEntries(PAGES.map((p) => [p.slug, p.slug]));

export const SEARCH: SearchEntry[] = [
  { id: "overview", title: "Introduction", crumb: "Get started" },
  { id: "install", title: "Install", crumb: "Get started" },
  { id: "quick-start", title: "Quick start", crumb: "Get started" },
  { id: "app-setup", title: "App setup", crumb: "Get started" },
  { id: "sign-in", title: "Sign-in methods", crumb: "Sign-in" },
  { id: "sessions", title: "Sessions and events", crumb: "Sign-in" },
  { id: "signing", title: "signMessage()", crumb: "Wallet", mono: true },
  { id: "history", title: "Transaction history", crumb: "Wallet" },
  { id: "platform", title: "DecanePlatform", crumb: "Platform", mono: true },
  { id: "wallet", title: "DecaneWallet", crumb: "Reference", mono: true },
  { id: "errors", title: "DecaneException", crumb: "Reference", mono: true },
  { id: "config", title: "DecaneConfig", crumb: "Reference", mono: true },
  { id: "roadmap", title: "What's not in this version", crumb: "Reference" },
];
