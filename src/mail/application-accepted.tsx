import Head from "next/head";

interface Props {
  userName: string;
  jobTitle: string;
  company: string;
  applicationUrl: string;
}

export default function ApplicationAccepted({
  userName,
  jobTitle,
  company,
  applicationUrl,
}: Props) {
  return (
    <html>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Congratulations! Your Application Has Been Accepted</title>
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
          <div
            style={{
              backgroundColor: "#059669",
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
              Congratulations!
            </h1>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#a7f3d0",
                fontSize: "16px",
                opacity: 0.9,
              }}
            >
              Your application has been accepted
            </p>
          </div>

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
              Great news, {userName}!
            </h2>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              We&apos;re excited to inform you that your application for the{" "}
              <strong style={{ color: "#059669" }}>{jobTitle}</strong> position
              at <strong style={{ color: "#059669" }}>{company}</strong> has
              been accepted!
            </p>

            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
                padding: "20px",
                margin: "24px 0",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#059669",
                  fontWeight: "600",
                }}
              >
                What&apos;s Next?
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#047857",
                  lineHeight: "1.6",
                }}
              >
                The employer will be in touch with you soon regarding the next
                steps. Please keep an eye on your email for further
                communication.
              </p>
            </div>

            <div
              style={{
                textAlign: "center",
                margin: "32px 0",
              }}
            >
              <a
                href={applicationUrl}
                style={{
                  display: "inline-block",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  padding: "16px 32px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "background-color 0.2s ease",
                  boxShadow: "0 4px 6px rgba(5, 150, 105, 0.25)",
                }}
              >
                View Your Application
              </a>
            </div>

            <div
              style={{
                backgroundColor: "#fef3cd",
                border: "1px solid #fbbf24",
                borderRadius: "6px",
                padding: "16px",
                margin: "24px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    marginRight: "8px",
                  }}
                >
                  💡
                </span>
                <div>
                  <p
                    style={{
                      margin: "0 0 4px 0",
                      fontSize: "14px",
                      color: "#92400e",
                      fontWeight: "600",
                    }}
                  >
                    Need Help?
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#92400e",
                      lineHeight: "1.4",
                    }}
                  >
                    If you have any questions, please don&apos;t hesitate to
                    contact the employer directly or reach out to our support
                    team.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
              This email was sent from Skill Match
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              Good luck with your new opportunity!
            </p>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "20px",
            fontSize: "12px",
            color: "#94a3b8",
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Skill Match Nepal. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}
