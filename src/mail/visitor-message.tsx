import Head from "next/head";

interface Props {
  user: string;
  message: string;
}

export default function VisitorMessage({ user, message }: Props) {
  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Visitor&apos;s Message</title>
      </Head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: "#f7f8fc",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          lineHeight: "1.6",
          color: "#333333",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e1e5e9",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#4f46e5",
              padding: "40px 30px",
              textAlign: "center",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "28px",
                fontWeight: "600",
                letterSpacing: "-0.02em",
              }}
            >
              You&apos;ve a new visitor message.
            </h1>
          </div>

          {/* Content */}
          <div
            style={{
              padding: "40px 30px",
            }}
          >
            <h2
              style={{
                margin: "0 0 16px 0",
                fontSize: "24px",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              Hello Admin 👋
            </h2>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            ></p>

            <p
              style={{
                margin: "0 0 32px 0",
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              {message}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "30px",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              This email was sent by {user}.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>

        {/* Email client compatibility */}
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} HOne Nepal. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}
