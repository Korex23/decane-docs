import { CodeBlock } from "@/app/docs/components/CodeBlock";
import { DocsCards } from "@/app/docs/components/DocsCards";
import { hl, type Lang } from "@/app/docs/components/highlight";
import { VERSIONS, REGISTRY } from "@/lib/versions";
import type { DocPage, SearchEntry } from "@/app/docs/components/types";

// The Swift SDK (DecaneKit), written from sdk-native/swift in the monorepo:
// Sources/DecaneKit/{DecaneWallet,DecaneConfig,DecaneError,Events,Hooks,Types}.swift,
// Sources/DecaneKitUI/DecaneObservable.swift, and the package README.

function Code({ code, lang = "swift", file }: { code: string; lang?: Lang; file?: string }) {
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
    title: "Decane wallets in native iOS and macOS apps.",
    body: (
      <>
        <p className="docs-lede">
          <strong>DecaneKit</strong> is the Swift SDK for Decane embedded wallets. Users sign in
          with email, phone or a token you already hold and get EVM, Solana and Tron addresses
          from one key. The wallet logic is the shared Rust core, linked as an XCFramework and
          byte-compatible with the web and Expo SDKs: a wallet opened here is the same wallet, at
          the same addresses, as on the web.
        </p>
        <dl className="docs-facts">
          <div><dt>Requires</dt><dd>iOS 16+ or macOS 13+, Swift 6</dd></div>
          <div><dt>Package</dt><dd><code>DecaneKit</code> {VERSIONS.swift}, MIT</dd></div>
          <div><dt>Install</dt><dd>Swift Package Manager</dd></div>
          <div><dt>SwiftUI</dt><dd><code>DecaneKitUI</code>, iOS 17+</dd></div>
        </dl>
        <p>
          The private key is never assembled on the phone. A 2-of-3 Shamir split puts one share on
          the device, one on the server and one sealed in the enclave, which reconstructs the key
          internally, for the moment it takes to sign.
        </p>
        <div className="docs-callout" data-kind="warn">
          <div className="ico">!</div>
          <p>
            <strong>{VERSIONS.swift} implements the identity tier only.</strong> Sign-in, wallet
            creation, provisioning and every kind of signing work. The device tier, passkeys,
            redirect sign-in and recovery files arrive in the next release without changing this
            API. See <a href="/swift-docs/roadmap">What&rsquo;s not in this version</a>.
          </p>
        </div>
        <div className="docs-agent">
          <p>
            Wiring up a coding agent? <code>kit.decane.app/llms-swift.txt</code> is a
            self-contained spec for this package with real signatures, and{" "}
            <a href="/llms-version.json" target="_blank" rel="noreferrer"><code>llms-version.json</code></a>{" "}
            tracks its freshness under the <code>swift</code> key.
          </p>
          <div className="docs-agent-actions">
            <a href="/llms-swift.txt" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">llms-swift.txt</a>
          </div>
        </div>
        <DocsCards
          items={[
            { href: "/swift-docs/quick-start", title: "Quick start", desc: "Sign a user in and sign a message." },
            { href: "/swift-docs/sessions", title: "Sessions and launch", desc: "Resume on launch, reconnect, and listen for events." },
            { href: "/swift-docs/signing", title: "Signing", desc: "Messages, EVM, EIP-712, EIP-7702, Solana and Tron." },
            { href: "/swift-docs/swiftui", title: "SwiftUI", desc: "An @Observable model for your views." },
            { href: "/swift-docs/platform", title: "Platform hooks", desc: "Keychain, networking and attestation, replaceable." },
            { href: "/swift-docs/wallet", title: "API reference", desc: "Every method and property on DecaneWallet." },
          ]}
        />
      </>
    ),
  },
  {
    slug: "install", group: "Get started", title: "Install", icon: "package",
    body: (
      <>
        <p>Add the package in Xcode (File, Add Package Dependencies) or in <code>Package.swift</code>:</p>
        <Code file="Package.swift" code={`
dependencies: [
    .package(url: "https://github.com/Korex23/decane-swift", from: "0.1.0"),
],
targets: [
    .target(name: "MyApp", dependencies: [
        .product(name: "DecaneKit", package: "decane-swift"),
        .product(name: "DecaneKitUI", package: "decane-swift"), // optional, SwiftUI
    ]),
]`} />
        <p>
          The Rust core arrives as a prebuilt <code>DecaneFFI.xcframework</code> from the matching
          GitHub release, with its checksum pinned in the manifest. The package is at{" "}
          <a href={REGISTRY.swift} target="_blank" rel="noreferrer">github.com/Korex23/decane-swift</a>.
        </p>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Product</th><th>What it is</th><th>Minimum</th></tr></thead>
          <tbody>
            <tr><td><code>DecaneKit</code></td><td><code>DecaneWallet</code>, config, errors, events, platform hooks</td><td>iOS 16, macOS 13</td></tr>
            <tr><td><code>DecaneKitUI</code></td><td><code>DecaneObservable</code>, an <code>@Observable</code> wrapper</td><td>iOS 17, macOS 14</td></tr>
          </tbody>
        </table></div>
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
        <p>Create one <code>DecaneWallet</code> for the app and keep it.</p>
        <Code file="Wallet.swift" code={`
import DecaneKit

let wallet = try DecaneWallet(config: DecaneConfig(
    appId: "proj_…",
    apiKey: "dck_live_…",
    chains: ["evm:8453", "solana:mainnet", "tron:mainnet"],
    protection: .identity          // the tier this version implements
))`} />
        <h2 id="sign-in">2. Sign the user in</h2>
        <Code code={`
try await wallet.connectWithEmail("user@example.com")
let result = try await wallet.verifyEmailCode(email: "user@example.com", code: "123456")

result.addresses.evm      // the same addresses the web SDK shows
result.addresses.solana
result.addresses.tron
result.isNewUser`} />
        <p>
          A first sign-in creates the wallet in the enclave before the session opens; a returning
          user gets a fresh device share for the wallet they already have.
        </p>
        <h2 id="sign">3. Sign</h2>
        <Code code={`let signature = try await wallet.signMessage(chain: "evm:8453", text: "Hello")`} />
        <p>
          On the next launch, <code>try await wallet.connect()</code> resumes a session that is
          still live. See <a href="/swift-docs/sessions">Sessions and launch</a>.
        </p>
      </>
    ),
  },
  {
    slug: "app-setup", group: "Get started", title: "App setup", icon: "sliders",
    body: (
      <>
        <p>
          The identity tier needs no entitlements or Info.plist keys: sign-in by code or token and
          signing work in any app. The settings below are for the device tier and redirect
          sign-in, which arrive in the next release; setting them up now means nothing changes
          later.
        </p>
        <h2 id="passkeys">Passkeys</h2>
        <ul>
          <li>Set <code>rpId</code> to a domain you control.</li>
          <li>Add <code>webcredentials:&lt;rpId&gt;</code> to the app&rsquo;s Associated Domains entitlement.</li>
          <li>Serve <code>/.well-known/apple-app-site-association</code> listing your app under <code>webcredentials</code>. The origin the backend sees is <code>https://&lt;rpId&gt;</code>.</li>
        </ul>
        <h2 id="biometrics">Biometrics</h2>
        <p>Add <code>NSFaceIDUsageDescription</code> to Info.plist.</p>
        <h2 id="redirect">Google and X redirect sign-in</h2>
        <ul>
          <li>Set <code>redirectURI</code>, for example <code>myapp://auth</code>.</li>
          <li>Register that exact URL as the API key&rsquo;s callback URL in the dashboard, first in the list: a native app sends no Origin, so it gets the first.</li>
          <li>Declare the scheme under <code>CFBundleURLTypes</code>.</li>
        </ul>
      </>
    ),
  },
  {
    slug: "sign-in", group: "Sign-in", title: "Sign-in methods", navLabel: "Methods", icon: "key",
    body: (
      <>
        <p>Every method resolves to a <code>ConnectResult</code> with the addresses and <code>isNewUser</code>.</p>
        <h2 id="email">Email code</h2>
        <Code code={`
try await wallet.connectWithEmail(email)
let result = try await wallet.verifyEmailCode(email: email, code: code)`} />
        <h2 id="phone">Phone code</h2>
        <Code code={`
try await wallet.connectWithPhone("+2348012345678")   // E.164
let result = try await wallet.verifyPhoneCode(phone: "+2348012345678", code: code)`} />
        <h2 id="tokens">A token you already hold</h2>
        <Code code={`
try await wallet.connectWithGoogleToken(idToken)            // from Google Sign-In for iOS
try await wallet.connectWithKingsChatToken(accessToken)     // a KingsChat access token
try await wallet.connectWithToken(myJWT, providerId: "prov-1")  // your own auth`} />
        <h2 id="profile">The provider profile</h2>
        <p>
          <code>result.profile</code> carries <code>name</code>, <code>email</code>,{" "}
          <code>picture</code> and <code>username</code> when the provider supplied them. Decane
          never stores it, so read it at sign-in.
        </p>
        <h2 id="not-yet">Not in this version</h2>
        <p>
          <code>connectWithGoogle()</code>, <code>connectWithX()</code> and{" "}
          <code>connectWithKingsChat()</code> (the redirect flows) and{" "}
          <code>signInWithPasskey()</code> are on the API already and throw{" "}
          <code>DecaneError.callSequence</code> or <code>.platformHookMissing</code> with a
          message that says so.
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
do {
    let result = try await wallet.connect()     // resume a live session
    showHome(result.addresses)
} catch DecaneError.reconnectRequired {
    showSignIn()
}`} />
        <p>
          The session is kept in the Keychain until its recorded expiry; set{" "}
          <code>persistSession: false</code> to keep it in memory only. The synchronous state is on
          properties:
        </p>
        <Code code={`
wallet.isUnlocked         // a session is open and can sign
wallet.needsReconnect     // the user must sign in again
wallet.addresses          // Addresses?
wallet.accessToken        // the Decane JWT, for your own backend
wallet.sessionExpiresAt   // Date?`} />
        <p>
          Sessions last eight hours and are renewed automatically before they lapse, up to seven
          days after sign-in. Send <code>wallet.accessToken</code> to your backend as a bearer
          token and verify it with a <a href="/node-docs">server SDK</a>.
        </p>
        <h2 id="events">Events</h2>
        <p><code>events</code> is an <code>AsyncStream&lt;DecaneEvent&gt;</code>:</p>
        <Code code={`
Task {
    for await event in wallet.events {
        switch event {
        case .connected(let result): print(result.addresses.evm)
        case .sessionExpired: showSignIn()
        default: print(event.name)   // "session-renewed", "wallet-creating", …
        }
    }
}`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Case</th><th>Name</th><th>When</th></tr></thead>
          <tbody>
            <tr><td><code>.connected(ConnectResult)</code></td><td><code>connected</code></td><td>A sign-in or resume finished</td></tr>
            <tr><td><code>.disconnected</code></td><td><code>disconnected</code></td><td><code>disconnect()</code> ran</td></tr>
            <tr><td><code>.sessionStarted</code></td><td><code>session-started</code></td><td>An enclave session opened</td></tr>
            <tr><td><code>.sessionRenewed</code></td><td><code>session-renewed</code></td><td>The token was refreshed</td></tr>
            <tr><td><code>.sessionExpired</code></td><td><code>session-expired</code></td><td>The session ended; sign in again</td></tr>
            <tr><td><code>.walletCreating</code></td><td><code>wallet-creating</code></td><td>A new wallet is being made</td></tr>
            <tr><td><code>.walletUnlocking</code></td><td><code>wallet-unlocking</code></td><td>An existing wallet is being opened</td></tr>
            <tr><td><code>.enrolmentFailed(message:)</code></td><td><code>enrolment-failed</code></td><td>Creation stopped; nothing was left behind</td></tr>
            <tr><td><code>.migratedToIdentity</code></td><td><code>migrated-to-identity</code></td><td>A device-tier wallet moved to the identity tier</td></tr>
          </tbody>
        </table></div>
        <h2 id="disconnect">Sign-out</h2>
        <Code code={`try await wallet.disconnect()`} />
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
let sig = try await wallet.signMessage(chain: "evm:8453", text: "Hello")
let raw = try await wallet.signMessage(chain: "solana:mainnet", bytes: data)`} />
        <h2 id="evm">EVM transactions</h2>
        <p>Legacy, EIP-2930, EIP-1559 and EIP-7702 transactions, unsigned RLP in, signed RLP out.</p>
        <Code code={`let signed: Data = try await wallet.signEVMTransaction(chain: "evm:8453", unsigned: unsignedRLP)`} />
        <h2 id="typed-data">EIP-712 typed data</h2>
        <Code code={`let sig = try await wallet.signTypedData(chain: "evm:8453", typedDataJSON: json)`} />
        <h2 id="authorization">EIP-7702 authorizations</h2>
        <Code code={`
let auth = try await wallet.signAuthorization(chainId: 8453, address: delegate, nonce: 0)
auth.yParity; auth.r; auth.s`} />
        <h2 id="solana">Solana</h2>
        <Code code={`let signed: Data = try await wallet.signSolanaTransaction(serializedTx)`} />
        <h2 id="tron">Tron</h2>
        <Code code={`let sig = try await wallet.signTronTransaction(rawDataHex: tx.rawDataHex)`} />
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
let record = try await wallet.recordTransaction(RecordTransactionInput(
    chain: "evm:8453",
    txHash: "0x…",
    to: "0x…",
    value: "1000000000000000",
    kind: "transfer",
    status: "pending",
    metadataJSON: #"{"note":"rent"}"#
))

let history = try await wallet.transactionHistory(limit: 50)   // [TransactionRecord]`} />
        <p>
          <code>TransactionRecord</code> has <code>id</code>, <code>chain</code>,{" "}
          <code>kind</code>, <code>txHash</code>, <code>to</code>, <code>value</code>,{" "}
          <code>status</code>, <code>metadata</code>, <code>createdAt</code> and{" "}
          <code>updatedAt</code>.
        </p>
      </>
    ),
  },
  {
    slug: "swiftui", group: "Platform", title: "SwiftUI", icon: "layers",
    body: (
      <>
        <p>
          <code>DecaneKitUI</code> wraps the wallet in an <code>@Observable</code> model for iOS 17
          and macOS 14. Its state updates on the main actor from the wallet&rsquo;s events, and its
          actions catch errors into <code>lastError</code> instead of throwing.
        </p>
        <Code file="SignInView.swift" code={`
import SwiftUI
import DecaneKitUI

struct SignInView: View {
    @State var model = try! DecaneObservable(config: config)
    @State var email = ""
    @State var code = ""

    var body: some View {
        if let addresses = model.addresses {
            Text(addresses.evm)
        } else {
            TextField("Email", text: $email)
            Button("Send code") { Task { await model.sendEmailCode(to: email) } }
            TextField("Code", text: $code)
            Button("Sign in") { Task { await model.verifyEmailCode(email: email, code: code) } }
                .disabled(model.isBusy)
        }
        if let error = model.lastError { Text(error.localizedDescription) }
    }
}`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>State</th><th>Type</th></tr></thead>
          <tbody>
            <tr><td><code>addresses</code></td><td><code>Addresses?</code></td></tr>
            <tr><td><code>isUnlocked</code>, <code>needsReconnect</code>, <code>isBusy</code></td><td><code>Bool</code></td></tr>
            <tr><td><code>sessionExpiresAt</code></td><td><code>Date?</code></td></tr>
            <tr><td><code>profile</code></td><td><code>AuthProfile?</code></td></tr>
            <tr><td><code>lastError</code></td><td><code>DecaneError?</code></td></tr>
            <tr><td><code>lastEvent</code></td><td><code>DecaneEvent?</code></td></tr>
          </tbody>
        </table></div>
        <p>
          Actions: <code>restore()</code>, <code>sendEmailCode(to:)</code>,{" "}
          <code>verifyEmailCode(email:code:)</code>, <code>signMessage(chain:text:)</code>,{" "}
          <code>disconnect()</code>, and <code>perform</code> for any other wallet call. The
          underlying <code>DecaneWallet</code> is available for everything else.
        </p>
      </>
    ),
  },
  {
    slug: "platform", group: "Platform", title: "Platform hooks", icon: "server",
    body: (
      <>
        <p>
          <code>DecaneWallet(config:)</code> uses <code>DecanePlatform.standard()</code>. Pass your
          own <code>DecanePlatform</code> to replace any piece; each one is a protocol.
        </p>
        <Code code={`
var platform = DecanePlatform.standard()
platform.http = MyTransport()          // conforms to DecaneHTTPTransport
let wallet = try DecaneWallet(config: config, platform: platform)`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Hook</th><th>Default</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>HTTP</td><td><code>URLSessionTransport</code></td><td>Ephemeral session; a transport failure is <code>.network</code></td></tr>
            <tr><td>Secure store</td><td><code>KeychainStorage</code></td><td>Service <code>decane-connect-kit</code>, <code>WhenUnlockedThisDeviceOnly</code>; the same keys as the Expo SDK, so users moving from an Expo app keep their records</td></tr>
            <tr><td>Device key</td><td><code>BiometricKey</code></td><td><code>.biometryCurrentSet</code></td></tr>
            <tr><td>Passkeys</td><td><code>PlatformPasskeyProvider</code></td><td>With PRF on iOS 18 and macOS 15</td></tr>
            <tr><td>Web sign-in</td><td><code>WebAuthenticationSession</code></td><td><code>ASWebAuthenticationSession</code>, ephemeral</td></tr>
            <tr><td>PIN, recovery, attestation</td><td>none</td><td><code>DecanePinPrompt</code>, <code>DecaneRecoveryDelegate</code>, <code>DecaneAttestationVerifier</code></td></tr>
          </tbody>
        </table></div>
        <h2 id="attestation">Attestation</h2>
        <p>
          Before sending anything to the enclave, the SDK checks its measurement against the list
          pinned in the build. Without a <code>DecaneAttestationVerifier</code>, the Decane
          backend verifies the enclave&rsquo;s quote. In production, forward the quote to your own
          backend with a verifier. <code>insecureSkipAttestation</code> is for development only.
        </p>
      </>
    ),
  },
  {
    slug: "wallet", group: "Reference", title: "API reference", icon: "code",
    body: (
      <>
        <h2 id="api-signin">Sign-in and session</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Member</th><th>Returns</th></tr></thead>
          <tbody>
            <tr><td><code>init(config:)</code>, <code>init(config:platform:)</code></td><td><code>DecaneWallet</code> (throws)</td></tr>
            <tr><td><code>initialize()</code></td><td>restores stored state</td></tr>
            <tr><td><code>connect()</code></td><td><code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithEmail(_:)</code> / <code>verifyEmailCode(email:code:)</code></td><td><code>Void</code> / <code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithPhone(_:)</code> / <code>verifyPhoneCode(phone:code:)</code></td><td><code>Void</code> / <code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithGoogleToken(_:)</code>, <code>connectWithKingsChatToken(_:)</code></td><td><code>ConnectResult</code></td></tr>
            <tr><td><code>connectWithToken(_:providerId:)</code></td><td><code>ConnectResult</code></td></tr>
            <tr><td><code>disconnect()</code></td><td><code>Void</code></td></tr>
            <tr><td><code>events</code></td><td><code>AsyncStream&lt;DecaneEvent&gt;</code></td></tr>
            <tr><td><code>isUnlocked</code>, <code>needsReconnect</code></td><td><code>Bool</code></td></tr>
            <tr><td><code>addresses</code>, <code>accessToken</code>, <code>sessionExpiresAt</code></td><td>optionals</td></tr>
          </tbody>
        </table></div>
        <h2 id="api-signing">Signing and history</h2>
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Member</th><th>Returns</th></tr></thead>
          <tbody>
            <tr><td><code>signMessage(chain:text:)</code>, <code>signMessage(chain:bytes:)</code></td><td><code>String</code></td></tr>
            <tr><td><code>signEVMTransaction(chain:unsigned:)</code></td><td><code>Data</code></td></tr>
            <tr><td><code>signTypedData(chain:typedDataJSON:)</code></td><td><code>String</code></td></tr>
            <tr><td><code>signAuthorization(chainId:address:nonce:)</code></td><td><code>SignedAuthorization</code></td></tr>
            <tr><td><code>signSolanaTransaction(_:)</code></td><td><code>Data</code></td></tr>
            <tr><td><code>signTronTransaction(rawDataHex:)</code></td><td><code>String</code></td></tr>
            <tr><td><code>recordTransaction(_:)</code>, <code>transactionHistory(limit:)</code></td><td><code>TransactionRecord</code>, <code>[TransactionRecord]</code></td></tr>
            <tr><td><code>capabilities()</code></td><td><code>DeviceCapabilities</code></td></tr>
          </tbody>
        </table></div>
        <h2 id="api-later">On the API, enabled next release</h2>
        <p>
          <code>connectWithGoogle()</code>, <code>connectWithX()</code>,{" "}
          <code>connectWithKingsChat()</code>, <code>canSignInWithPasskey()</code>,{" "}
          <code>signInWithPasskey()</code>, <code>canUnlock()</code>, <code>unlock()</code>,{" "}
          <code>hasPasskey()</code>, <code>addPasskey()</code>, <code>removeDeviceUnlock()</code>,{" "}
          <code>rotateShares(password:passwordHint:)</code>,{" "}
          <code>exportPortableBackup(password:passwordHint:)</code>,{" "}
          <code>recoverWithFile(_:password:)</code>.
        </p>
      </>
    ),
  },
  {
    slug: "errors", group: "Reference", title: "Error handling", icon: "alert",
    body: (
      <>
        <p>
          Errors are <code>DecaneError</code>, a <code>LocalizedError</code> with one case per
          class. <code>code</code> is identical to the JS SDKs&rsquo; <code>error.code</code>, and{" "}
          <code>retryable</code> says whether trying again could succeed.
        </p>
        <Code code={`
do {
    try await wallet.verifyEmailCode(email: email, code: code)
} catch let error as DecaneError {
    if error.retryable { showRetry(error.localizedDescription) }
    log(error.code)   // "NETWORK", "RECONNECT_REQUIRED", …
}`} />
        <div className="docs-table-wrap"><table>
          <thead><tr><th>Case</th><th>Code</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><code>.network</code></td><td><code>NETWORK</code></td><td>The request never completed</td></tr>
            <tr><td><code>.reconnectRequired</code></td><td><code>RECONNECT_REQUIRED</code></td><td>Sign in again</td></tr>
            <tr><td><code>.sessionExpired</code></td><td><code>SESSION_EXPIRED</code></td><td>The session ended</td></tr>
            <tr><td><code>.invalidApiKey</code></td><td><code>INVALID_API_KEY</code></td><td>Key invalid or revoked</td></tr>
            <tr><td><code>.walletEnrolmentFailed(cause:)</code></td><td><code>WALLET_ENROLMENT_FAILED</code></td><td>Creation stopped; nothing was left behind, try again</td></tr>
            <tr><td><code>.walletExists</code></td><td><code>WALLET_EXISTS</code></td><td>The account already has a wallet; it is opened instead</td></tr>
            <tr><td><code>.provisioningRateLimited</code></td><td><code>PROVISIONING_RATE_LIMITED</code></td><td>Too many new-device setups this hour</td></tr>
            <tr><td><code>.provisioningTimeout(step:)</code></td><td><code>PROVISIONING_TIMEOUT</code></td><td>Wallet setup took too long</td></tr>
            <tr><td><code>.attestationFailed(message:)</code></td><td><code>ATTESTATION_FAILED</code></td><td>The enclave could not be verified</td></tr>
            <tr><td><code>.enclaveHTTP(status:message:)</code></td><td><code>ENCLAVE_HTTP</code></td><td>Any other enclave error</td></tr>
            <tr><td><code>.callSequence(message:)</code></td><td><code>CALL_SEQUENCE</code></td><td>A call made in the wrong state, or not in this version</td></tr>
            <tr><td><code>.platformHookMissing(hook:purpose:)</code></td><td><code>NATIVE_MODULE_MISSING</code></td><td>A feature needs a hook that is not installed</td></tr>
            <tr><td><code>.userCancelled</code></td><td><code>USER_CANCELLED</code></td><td>The user dismissed a prompt</td></tr>
          </tbody>
        </table></div>
        <p>
          The rest (device tier, passkeys and recovery) mirror the JS SDKs:{" "}
          <code>unlockRequired</code>, <code>webAuthnUnsupported</code>, <code>invalidPin</code>,{" "}
          <code>shareCorrupted</code>, <code>newDevice</code>, <code>staleDeviceShare</code>,{" "}
          <code>recoveryFailed</code>, <code>invalidRecoveryFile</code>,{" "}
          <code>wrongPassword</code>, <code>recoveryWalletMismatch</code>,{" "}
          <code>exportNotAuthorized</code>, <code>unlockTokenRejected</code>,{" "}
          <code>biometricUnavailable</code>, <code>originNotAllowed</code>.
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
            <tr><td><code>protection</code></td><td><code>.device</code></td><td>Set <code>.identity</code> in this version</td></tr>
            <tr><td><code>persistSession</code></td><td><code>true</code></td><td>Keep the session in the Keychain across launches</td></tr>
            <tr><td><code>sessionDurationMinutes</code></td><td>backend default</td><td>Requested session length</td></tr>
            <tr><td><code>apiBaseURL</code>, <code>teeURL</code></td><td>production</td><td>Override the backend and enclave URLs</td></tr>
            <tr><td><code>redirectURI</code>, <code>kingsChatScopes</code></td><td>none</td><td>Redirect sign-in (next release)</td></tr>
            <tr><td><code>rpId</code>, <code>rpName</code>, <code>origin</code></td><td>none</td><td>Passkeys (next release)</td></tr>
            <tr><td><code>unlockPreference</code></td><td><code>[]</code></td><td>Order of <code>.passkey</code>, <code>.secureEnclave</code>, <code>.pin</code> (device tier)</td></tr>
            <tr><td><code>requireAssertionPerSignature</code></td><td><code>false</code></td><td>A passkey assertion per signature (device tier)</td></tr>
            <tr><td><code>offerRecoveryAtSignup</code>, <code>rotateOnNewDeviceRecovery</code></td><td><code>false</code></td><td>Recovery files (next release)</td></tr>
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
          {VERSIONS.swift} ships the identity tier: nothing is stored on the device and nothing is
          asked for; every visit is a sign-in, after which the enclave provisions a fresh device
          share against the session alone.
        </p>
        {IDENTITY_STATEMENT}
        <p>Not yet, each already on the API so enabling it will not change your code:</p>
        <ul>
          <li>The device tier (<code>protection: .device</code>, the default as in Expo), with biometric, Secure Enclave or PIN unlock.</li>
          <li>Passkeys, for sign-in and unlock.</li>
          <li>Redirect sign-in: <code>connectWithGoogle</code>, <code>connectWithX</code>, <code>connectWithKingsChat</code>.</li>
          <li>Recovery files: <code>rotateShares</code>, <code>exportPortableBackup</code>, <code>recoverWithFile</code>.</li>
        </ul>
        <h2 id="from-expo">Coming from the Expo SDK</h2>
        <ul>
          <li>Swift names: <code>connectWithKingsChatToken</code>, <code>signEVMTransaction</code>, <code>transactionHistory(limit:)</code>, <code>capabilities()</code>; properties for the synchronous getters.</li>
          <li>Callbacks are protocols on <code>DecanePlatform</code>; events are an <code>AsyncStream</code> rather than <code>on(…)</code>.</li>
          <li>No <code>sendTransaction</code>, balance helper or <code>rpcUrls</code>: sign here, broadcast with your own stack.</li>
          <li>No <code>authMethods</code>: call the sign-in you want.</li>
          <li>Cancelling a Swift <code>Task</code> stops waiting but not the core&rsquo;s work, which its own timeouts bound.</li>
        </ul>
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
  { id: "swiftui", title: "DecaneObservable", crumb: "Platform", mono: true },
  { id: "platform", title: "Platform hooks", crumb: "Platform" },
  { id: "wallet", title: "DecaneWallet", crumb: "Reference", mono: true },
  { id: "errors", title: "DecaneError", crumb: "Reference", mono: true },
  { id: "config", title: "DecaneConfig", crumb: "Reference", mono: true },
  { id: "roadmap", title: "What's not in this version", crumb: "Reference" },
];
