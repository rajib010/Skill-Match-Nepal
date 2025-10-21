import Head from "next/head";

interface Props {
    user: string,
    url: string
}

export default function ResetPassword({ user, url }: Props) {
    return (
        <html>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Reset Your Password</title>
            </Head>
            <body style={{
                margin: 0,
                padding: 0,
                backgroundColor: '#f7f8fc',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                lineHeight: '1.6',
                color: '#333333'
            }}>
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e1e5e9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: '#4f46e5',
                        padding: '40px 30px',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            margin: 0,
                            color: '#ffffff',
                            fontSize: '28px',
                            fontWeight: '600',
                            letterSpacing: '-0.02em'
                        }}>
                            🔐 Password Reset
                        </h1>
                        <p style={{
                            margin: '8px 0 0 0',
                            color: '#c7d2fe',
                            fontSize: '16px',
                            opacity: 0.9
                        }}>
                            Secure your account with a new password
                        </p>
                    </div>

                    {/* Content */}
                    <div style={{
                        padding: '40px 30px'
                    }}>
                        <h2 style={{
                            margin: '0 0 16px 0',
                            fontSize: '24px',
                            fontWeight: '600',
                            color: '#1f2937'
                        }}>
                            Hello {user}! 👋
                        </h2>

                        <p style={{
                            margin: '0 0 24px 0',
                            fontSize: '16px',
                            color: '#6b7280',
                            lineHeight: '1.5'
                        }}>
                            We received a request to reset your password for your H-one account.
                            If you didn&apos;t make this request, you can safely ignore this email.
                        </p>

                        <p style={{
                            margin: '0 0 32px 0',
                            fontSize: '16px',
                            color: '#6b7280',
                            lineHeight: '1.5'
                        }}>
                            To reset your password, click the button below. This link will expire in 1 hour for security reasons.
                        </p>

                        {/* CTA Button */}
                        <div style={{
                            textAlign: 'center',
                            margin: '32px 0'
                        }}>
                            <a href={url} style={{
                                display: 'inline-block',
                                backgroundColor: '#4f46e5',
                                color: '#ffffff',
                                padding: '16px 32px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '16px',
                                fontWeight: '600',
                                transition: 'background-color 0.2s ease',
                                boxShadow: '0 4px 6px rgba(79, 70, 229, 0.25)'
                            }}>
                                Reset Your Password
                            </a>
                        </div>

                        {/* Alternative link */}
                        <div style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '20px',
                            margin: '24px 0'
                        }}>
                            <p style={{
                                margin: '0 0 8px 0',
                                fontSize: '14px',
                                color: '#64748b',
                                fontWeight: '600'
                            }}>
                                Can&apos;t click the button? Copy and paste this link:
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '14px',
                                color: '#4f46e5',
                                wordBreak: 'break-all'
                            }}>
                                {url}
                            </p>
                        </div>

                        {/* Security notice */}
                        <div style={{
                            backgroundColor: '#fef3cd',
                            border: '1px solid #fbbf24',
                            borderRadius: '6px',
                            padding: '16px',
                            margin: '24px 0'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{
                                    fontSize: '18px',
                                    marginRight: '8px'
                                }}>
                                    ⚠️
                                </span>
                                <div>
                                    <p style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '14px',
                                        color: '#92400e',
                                        fontWeight: '600'
                                    }}>
                                        Security Reminder
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '13px',
                                        color: '#92400e',
                                        lineHeight: '1.4'
                                    }}>
                                        Never share your password with anyone. H-one will never ask for your password via email.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '30px',
                        borderTop: '1px solid #e2e8f0',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            margin: '0 0 8px 0',
                            fontSize: '14px',
                            color: '#64748b'
                        }}>
                            This email was sent from H-one Thermal Therapy
                        </p>
                        <p style={{
                            margin: 0,
                            fontSize: '12px',
                            color: '#94a3b8'
                        }}>
                            If you have any questions, please contact our support team.
                        </p>
                    </div>
                </div>

                {/* Email client compatibility */}
                <div style={{
                    textAlign: 'center',
                    padding: '20px',
                    fontSize: '12px',
                    color: '#94a3b8'
                }}>
                    <p style={{ margin: 0 }}>
                        © {new Date().getFullYear()} H-one Thermal Therapy. All rights reserved.
                    </p>
                </div>
            </body>
        </html>
    );
}