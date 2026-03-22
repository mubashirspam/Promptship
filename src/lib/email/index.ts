import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_FROM = process.env.EMAIL_FROM || 'PromptShip <hello@promptship.dev>';

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Sign in to PromptShip',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Sign in to PromptShip</h2>
        <p>Click the link below to sign in to your account. This link expires in 15 minutes.</p>
        <a href="${url}" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Sign In
        </a>
        <p style="color: #666; font-size: 14px; margin-top: 24px;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail({ email, name }: { email: string; name?: string }) {
  await resend.emails.send({
    from: EMAIL_FROM,
    to: email,
    subject: 'Welcome to PromptShip!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7C3AED;">Welcome to PromptShip${name ? `, ${name}` : ''}!</h2>
        <p>You now have access to our curated library of AI prompts for UI generation.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Browse 100+ curated prompts</li>
          <li>Copy prompts for your projects</li>
          <li>Generate code with AI (Pro plan)</li>
        </ul>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #7C3AED; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Go to Dashboard
        </a>
      </div>
    `,
  });
}
