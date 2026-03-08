import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopBar } from "@/components/DashboardTopBar";
import { cn } from "@/lib/utils";
import {
  Search,
  Lock,
  Shield,
  KeyRound,
  Database,
  Code,
  Globe,
  Clock,
  BarChart3,
  ChevronLeft,
  Copy,
  Check,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type Difficulty = "easy" | "medium" | "hard";

const diffConfig: Record<Difficulty, { color: string; badge: string }> = {
  easy: { color: "text-green-400", badge: "bg-green-500/15 text-green-400 border-green-500/20" },
  medium: { color: "text-yellow-400", badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  hard: { color: "text-destructive", badge: "bg-destructive/15 text-destructive border-destructive/20" },
};

type Guide = {
  id: string;
  icon: typeof Shield;
  title: string;
  category: string;
  difficulty: Difficulty;
  time: string;
  problem: string;
  risk: string;
  steps: string[];
  checklist: string[];
  code: { nodejs: string; python: string; php: string };
};

const guides: Guide[] = [
  {
    id: "auth",
    icon: KeyRound,
    title: "Authentication Issues",
    category: "authentication",
    difficulty: "medium",
    time: "2-4 hours",
    problem: "Weak or missing authentication mechanisms allow unauthorized access to protected resources, user impersonation, and session hijacking.",
    risk: "Attackers can bypass login, steal sessions, or escalate privileges. This often leads to full account takeover and data breaches.",
    steps: [
      "Implement strong password policies (min 12 chars, mixed case, numbers, symbols)",
      "Add multi-factor authentication (TOTP or WebAuthn)",
      "Use secure session management with HttpOnly, Secure, SameSite cookies",
      "Implement rate limiting on authentication endpoints",
      "Add account lockout after failed attempts",
      "Use bcrypt/argon2 for password hashing",
    ],
    checklist: [
      "Password hashing uses bcrypt/argon2",
      "Sessions expire after inactivity",
      "CSRF tokens on all state-changing requests",
      "Rate limiting on login endpoint",
      "MFA available for all users",
    ],
    code: {
      nodejs: `const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 1800000 // 30 minutes
  }
}));`,
      python: `from passlib.hash import argon2
from flask import session
import secrets

# Hash password
def hash_password(password: str) -> str:
    return argon2.hash(password)

# Verify password
def verify_password(password: str, hash: str) -> bool:
    return argon2.verify(password, hash)

# Session config
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_SAMESITE='Strict',
    PERMANENT_SESSION_LIFETIME=1800
)`,
      php: `<?php
// Hash password
$hash = password_hash($password, PASSWORD_ARGON2ID, [
    'memory_cost' => 65536,
    'time_cost'   => 4,
    'threads'     => 3
]);

// Verify password
if (password_verify($password, $hash)) {
    // Valid
}

// Session config
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');
session_start();`,
    },
  },
  {
    id: "headers",
    icon: Shield,
    title: "Security Headers",
    category: "headers",
    difficulty: "easy",
    time: "30 min",
    problem: "Missing security headers leave the application vulnerable to XSS, clickjacking, MIME sniffing, and other client-side attacks.",
    risk: "Without proper headers, browsers lack instructions to enforce security policies, making users vulnerable to injection and framing attacks.",
    steps: [
      "Add Content-Security-Policy header to restrict resource loading",
      "Set X-Frame-Options to DENY or SAMEORIGIN",
      "Enable X-Content-Type-Options: nosniff",
      "Add Referrer-Policy: strict-origin-when-cross-origin",
      "Set Permissions-Policy to disable unnecessary features",
    ],
    checklist: ["CSP header set", "X-Frame-Options configured", "HSTS enabled", "X-Content-Type-Options set", "Referrer-Policy configured"],
    code: {
      nodejs: `// Express.js with helmet
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));`,
      python: `# Flask with Talisman
from flask_talisman import Talisman

csp = {
    'default-src': "'self'",
    'script-src': "'self'",
    'style-src': "'self' 'unsafe-inline'",
}

Talisman(app,
    content_security_policy=csp,
    force_https=True,
    frame_options='DENY',
    referrer_policy='strict-origin-when-cross-origin'
)`,
      php: `<?php
header("Content-Security-Policy: default-src 'self'; script-src 'self'");
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("Strict-Transport-Security: max-age=31536000; includeSubDomains");
header("Referrer-Policy: strict-origin-when-cross-origin");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");`,
    },
  },
  {
    id: "ssl",
    icon: Lock,
    title: "SSL/TLS Configuration",
    category: "encryption",
    difficulty: "medium",
    time: "1-2 hours",
    problem: "Outdated TLS protocols, weak cipher suites, or misconfigured certificates expose traffic to interception and downgrade attacks.",
    risk: "Man-in-the-middle attacks can intercept sensitive data including credentials, personal info, and financial details.",
    steps: [
      "Disable TLS 1.0 and 1.1 — only allow TLS 1.2+",
      "Configure strong cipher suites (ECDHE, AES-GCM)",
      "Enable HSTS with includeSubDomains and preload",
      "Set up certificate auto-renewal (Let's Encrypt)",
      "Enable OCSP stapling for faster validation",
    ],
    checklist: ["TLS 1.2+ only", "Strong cipher suites", "HSTS enabled", "Valid certificate", "OCSP stapling active"],
    code: {
      nodejs: `// Node.js TLS options
const https = require('https');
const fs = require('fs');

const server = https.createServer({
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt'),
  minVersion: 'TLSv1.2',
  ciphers: [
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
  ].join(':'),
}, app);`,
      python: `# Nginx config (commonly used with Python apps)
# /etc/nginx/conf.d/ssl.conf

ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers on;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";`,
      php: `# Apache config
# /etc/apache2/sites-available/ssl.conf

SSLProtocol -all +TLSv1.2 +TLSv1.3
SSLCipherSuite ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256
SSLHonorCipherOrder on
SSLUseStapling on
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"`,
    },
  },
  {
    id: "sqli",
    icon: Database,
    title: "SQL Injection Prevention",
    category: "injection",
    difficulty: "hard",
    time: "4-8 hours",
    problem: "Unsanitized user input in SQL queries allows attackers to read, modify, or delete database data and potentially execute system commands.",
    risk: "Complete database compromise, data exfiltration, authentication bypass, and potentially remote code execution on the server.",
    steps: [
      "Use parameterized queries / prepared statements everywhere",
      "Implement an ORM with built-in escaping",
      "Apply input validation with allowlists",
      "Use least-privilege database accounts",
      "Enable query logging and monitoring",
      "Implement WAF rules for SQL injection patterns",
    ],
    checklist: ["All queries use parameterized statements", "ORM configured properly", "Input validation in place", "DB user has minimal permissions", "SQL error messages hidden from users"],
    code: {
      nodejs: `// Using parameterized queries (pg library)
const { Pool } = require('pg');
const pool = new Pool();

// ✅ SAFE - Parameterized query
async function getUser(id) {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

// ❌ UNSAFE - String concatenation
// const result = await pool.query(
//   'SELECT * FROM users WHERE id = ' + id
// );`,
      python: `# Using parameterized queries (psycopg2)
import psycopg2

conn = psycopg2.connect(dsn)
cur = conn.cursor()

# ✅ SAFE - Parameterized query
cur.execute(
    "SELECT * FROM users WHERE id = %s",
    (user_id,)
)

# Using SQLAlchemy ORM
from sqlalchemy import select
stmt = select(User).where(User.id == user_id)
result = session.execute(stmt).scalar_one()`,
      php: `<?php
// ✅ SAFE - PDO Prepared Statement
$stmt = $pdo->prepare(
    'SELECT * FROM users WHERE id = :id'
);
$stmt->execute(['id' => $userId]);
$user = $stmt->fetch();

// ✅ SAFE - MySQLi Prepared Statement
$stmt = $mysqli->prepare(
    'SELECT * FROM users WHERE id = ?'
);
$stmt->bind_param('i', $userId);
$stmt->execute();`,
    },
  },
  {
    id: "xss",
    icon: Code,
    title: "XSS Mitigation",
    category: "injection",
    difficulty: "medium",
    time: "2-4 hours",
    problem: "Cross-Site Scripting allows attackers to inject malicious scripts into web pages viewed by other users, stealing sessions and data.",
    risk: "Session hijacking, credential theft, defacement, malware distribution, and phishing attacks through trusted domains.",
    steps: [
      "Encode all output using context-aware encoding",
      "Implement Content-Security-Policy to block inline scripts",
      "Use frameworks with auto-escaping (React, Vue, Angular)",
      "Sanitize HTML input with DOMPurify",
      "Set HttpOnly flag on session cookies",
    ],
    checklist: ["Output encoding on all dynamic content", "CSP blocks inline scripts", "HttpOnly cookies", "Input sanitization", "Framework auto-escaping enabled"],
    code: {
      nodejs: `// Express.js with DOMPurify
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const DOMPurify = createDOMPurify(new JSDOM('').window);

// Sanitize user HTML input
function sanitize(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  });
}

// React auto-escapes by default
// ✅ SAFE: <div>{userInput}</div>
// ❌ UNSAFE: dangerouslySetInnerHTML`,
      python: `# Using bleach for sanitization
import bleach

# Sanitize HTML
clean = bleach.clean(
    user_input,
    tags=['b', 'i', 'em', 'strong', 'p'],
    attributes={},
    strip=True
)

# Jinja2 auto-escaping (Flask)
# ✅ {{ user_input }} is auto-escaped
# ❌ {{ user_input | safe }} bypasses escaping`,
      php: `<?php
// Output encoding
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// Using HTMLPurifier
require_once 'HTMLPurifier.auto.php';
$config = HTMLPurifier_Config::createDefault();
$config->set('HTML.Allowed', 'b,i,em,strong,p');
$purifier = new HTMLPurifier($config);
$clean = $purifier->purify($dirty);`,
    },
  },
  {
    id: "cors",
    icon: Globe,
    title: "CORS Configuration",
    category: "headers",
    difficulty: "easy",
    time: "30 min",
    problem: "Misconfigured CORS policies allow unauthorized cross-origin requests, enabling data theft from authenticated browser sessions.",
    risk: "Attackers can read sensitive API responses from malicious websites if the user is authenticated, leading to data exfiltration.",
    steps: [
      "Define explicit allowed origins (never use wildcard with credentials)",
      "Restrict allowed methods to only what's needed",
      "Limit allowed headers",
      "Set appropriate max-age for preflight caching",
      "Validate Origin header server-side",
    ],
    checklist: ["No wildcard origins with credentials", "Specific origins listed", "Methods restricted", "Headers limited", "Preflight cached appropriately"],
    code: {
      nodejs: `const cors = require('cors');

const allowedOrigins = [
  'https://app.example.com',
  'https://admin.example.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400
}));`,
      python: `from flask_cors import CORS

CORS(app,
    origins=[
        'https://app.example.com',
        'https://admin.example.com'
    ],
    methods=['GET', 'POST', 'PUT', 'DELETE'],
    supports_credentials=True,
    max_age=86400
)`,
      php: `<?php
$allowed = [
    'https://app.example.com',
    'https://admin.example.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Max-Age: 86400");
}`,
    },
  },
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        onClick={copy}
        className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
      </Button>
      <pre className="bg-background/80 border border-border/30 rounded-lg p-4 overflow-x-auto text-xs font-mono leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const Remediation = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [completedChecks, setCompletedChecks] = useState<Record<string, boolean>>({});
  const [completedGuides, setCompletedGuides] = useState<string[]>([]);

  const filtered = guides.filter((g) => {
    const matchSearch = !search || g.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || g.category === category;
    return matchSearch && matchCat;
  });

  const toggleCheck = (guideId: string, idx: number) => {
    const key = `${guideId}-${idx}`;
    setCompletedChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markComplete = (guideId: string) => {
    setCompletedGuides((prev) => prev.includes(guideId) ? prev.filter((id) => id !== guideId) : [...prev, guideId]);
    toast({ title: "Guide marked complete!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  // Guide Detail View
  if (selectedGuide) {
    const g = selectedGuide;
    const diff = diffConfig[g.difficulty];
    const checkCount = g.checklist.length;
    const doneCount = g.checklist.filter((_, i) => completedChecks[`${g.id}-${i}`]).length;

    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardTopBar />
            <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6 max-w-4xl">
              {/* Back + Header */}
              <div className="flex items-center gap-3 animate-fade-in">
                <Button variant="ghost" size="icon" onClick={() => setSelectedGuide(null)} className="h-8 w-8 text-muted-foreground">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-foreground">{g.title}</h1>
                    {completedGuides.includes(g.id) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                        <CheckCircle2 className="h-3 w-3" /> Complete
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${diff.badge}`}>
                      {g.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {g.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Problem & Risk */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: "0.05s" }}>
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Problem</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{g.problem}</p>
                </div>
                <div className="glass-card p-5 border-l-2 border-l-destructive">
                  <h3 className="text-sm font-semibold text-destructive mb-2">Risk</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{g.risk}</p>
                </div>
              </div>

              {/* Step-by-Step */}
              <div className="glass-card p-5 space-y-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                <h3 className="text-sm font-semibold text-foreground">Step-by-Step Instructions</h3>
                <ol className="space-y-2">
                  {g.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-muted-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Code Examples */}
              <div className="glass-card p-5 space-y-3 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                <h3 className="text-sm font-semibold text-foreground">Code Examples</h3>
                <Tabs defaultValue="nodejs">
                  <TabsList className="bg-muted/30 border border-border/30">
                    <TabsTrigger value="nodejs" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Node.js</TabsTrigger>
                    <TabsTrigger value="python" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">Python</TabsTrigger>
                    <TabsTrigger value="php" className="text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">PHP</TabsTrigger>
                  </TabsList>
                  <TabsContent value="nodejs"><CodeBlock code={g.code.nodejs} language="javascript" /></TabsContent>
                  <TabsContent value="python"><CodeBlock code={g.code.python} language="python" /></TabsContent>
                  <TabsContent value="php"><CodeBlock code={g.code.php} language="php" /></TabsContent>
                </Tabs>
              </div>

              {/* Verification Checklist */}
              <div className="glass-card p-5 space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Verification Checklist</h3>
                  <span className="text-xs text-muted-foreground">{doneCount}/{checkCount}</span>
                </div>
                <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 rounded-full" style={{ width: `${(doneCount / checkCount) * 100}%` }} />
                </div>
                <div className="space-y-2">
                  {g.checklist.map((item, i) => {
                    const checked = !!completedChecks[`${g.id}-${i}`];
                    return (
                      <label key={i} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox checked={checked} onCheckedChange={() => toggleCheck(g.id, i)} />
                        <span className={cn("text-sm transition-colors", checked ? "text-muted-foreground line-through" : "text-foreground")}>{item}</span>
                      </label>
                    );
                  })}
                </div>
                <Button
                  onClick={() => markComplete(g.id)}
                  className={cn("w-full font-semibold", completedGuides.includes(g.id) ? "bg-green-600 hover:bg-green-700 text-white" : "glow-button bg-gradient-to-r from-primary to-secondary text-primary-foreground")}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {completedGuides.includes(g.id) ? "Completed ✓" : "Mark as Complete"}
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // Grid View
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopBar />
          <main className="flex-1 p-4 md:p-6 overflow-auto space-y-6">
            {/* Header */}
            <div className="animate-fade-in">
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="gradient-text">Remediation Guides</span>
              </h1>
              <p className="text-muted-foreground mt-1">Step-by-step instructions to fix security vulnerabilities</p>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in" style={{ animationDelay: "0.05s" }}>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guides..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-muted/30 border-border/50"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-44 bg-muted/30 border-border/50">
                  <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="authentication">Authentication</SelectItem>
                  <SelectItem value="headers">Headers</SelectItem>
                  <SelectItem value="encryption">Encryption</SelectItem>
                  <SelectItem value="injection">Injection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Guide Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((guide, i) => {
                const diff = diffConfig[guide.difficulty];
                const isComplete = completedGuides.includes(guide.id);
                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className={cn(
                      "glass-card p-5 text-left transition-all duration-300 animate-fade-in hover:scale-[1.02] hover:shadow-[0_0_20px_hsl(166_100%_42%/0.12)] group",
                      isComplete && "ring-1 ring-green-500/30"
                    )}
                    style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/20 transition-colors">
                        <guide.icon className="h-5 w-5 text-primary" />
                      </div>
                      {isComplete && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{guide.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{guide.problem}</p>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${diff.badge}`}>
                        {guide.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {guide.time}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No guides match your search.</div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Remediation;
