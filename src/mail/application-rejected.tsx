import Head from "next/head";

interface Props {
  userName: string;
  jobTitle: string;
  company: string;
  applicationUrl: string;
}

export default function ApplicationRejected({
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
        <title>Update on Your Job Application</title>
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
              backgroundColor: "#6b7280",
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
              Application Update
            </h1>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#d1d5db",
                fontSize: "16px",
                opacity: 0.9,
              }}
            >
              Regarding your recent application
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
              Dear {userName},
            </h2>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              Thank you for taking the time to apply for the{" "}
              <strong style={{ color: "#374151" }}>{jobTitle}</strong> position
              at <strong style={{ color: "#374151" }}>{company}</strong>. We
              appreciate your interest in joining their team.
            </p>

            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "16px",
                color: "#6b7280",
                lineHeight: "1.5",
              }}
            >
              After careful consideration, we regret to inform you that your
              application has not been selected to move forward at this time.
              This was a competitive process, and this decision does not reflect
              on your qualifications or potential.
            </p>

            <div
              style={{
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: "6px",
                padding: "20px",
                margin: "24px 0",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  color: "#0369a1",
                  fontWeight: "600",
                }}
              >
                Keep Going!
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  color: "#0c4a6e",
                  lineHeight: "1.6",
                }}
              >
                We encourage you to continue exploring opportunities on Skill
                Match. New positions are posted regularly, and the right
                opportunity could be just around the corner.
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
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  padding: "16px 32px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  transition: "background-color 0.2s ease",
                  boxShadow: "0 4px 6px rgba(37, 99, 235, 0.25)",
                }}
              >
                Browse More Jobs
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
                    If you have any questions about this decision or would like
                    feedback on your application, please don&apos;t hesitate to
                    reach out to our support team.
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
              Wishing you the best in your job search!
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
