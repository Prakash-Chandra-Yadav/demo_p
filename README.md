# Phishing Awareness Training Demo

A controlled, self-contained phishing demonstration for internal security awareness training. Built around a **fictional** "AcmeCorp Webmail" brand — it deliberately does not impersonate any real company.

## ⚠ Ethical use — read this first

This project exists to teach employees what phishing looks like by showing them, live, how easily a fake login page can capture credentials. It is **only** to be used:

- On systems and accounts you own or are explicitly authorized to test
- In a training setting where participants are informed it's a simulation (either before, or immediately after, by the reveal page)
- Against your own demo email account — never against a real person's mailbox without their written consent

Do **not**:

- Re-skin this to impersonate a real brand (Gmail, Microsoft 365, your bank, your real employer's portal)
- Send the link to anyone outside your training session
- Leave it deployed and reachable on the public internet after the training is over

Take the deployment down (`vercel remove`) when the session ends.

## What's in here

```
phishing-demo/
├── public/
│   ├── index.html       # The fake "AcmeCorp Webmail" login page
│   ├── caught.html      # The "you've been phished" reveal page
│   └── dashboard.html   # Trainer's view of captured credentials
├── api/
│   ├── login.js         # Captures form submissions
│   └── captured.js      # Returns capture list for the dashboard
├── vercel.json
├── package.json
└── README.md
```

## Deploy to Vercel

1. Install the Vercel CLI: `npm i -g vercel`
2. From the project folder: `vercel login`
3. Deploy: `vercel --prod`
4. Vercel gives you a URL like `https://acmecorp-mail-xyz.vercel.app`

## Running the demo

**Before the session — on your own laptop:**

1. Open the deployed URL in your browser. Confirm the fake login appears.
2. Open `/dashboard.html` on that URL in a second tab. Keep it ready on the projector.
3. Send yourself the phishing email (see template below) from any test account to your own demo inbox.

**During the session:**

1. Show the audience the email in your inbox. Walk through the social-engineering cues (urgency, generic greeting, hover-over link mismatch).
2. Click the link. The fake login opens.
3. Type a demo email and password. Submit.
4. The reveal page ("You've been phished") loads.
5. Switch to the dashboard tab — show the captured credentials appearing in real time.
6. Discuss defenses (MFA, URL inspection, reporting).

**After the session:**

```
vercel remove <project-name>
```

## Sample phishing email (send to your own demo inbox)

> **Subject:** [AcmeCorp Mail] Your mailbox is 98% full — action required
>
> Hi,
>
> Your AcmeCorp mailbox has reached 98% of its storage limit. Incoming messages will be rejected within 24 hours unless you free up space.
>
> Sign in to review and clean up your mailbox:
>
> **https://acmecorp-mail-xyz.vercel.app** ← (your deployed URL)
>
> Thanks,
> AcmeCorp IT Support

Teaching point: a real IT notice would come from your actual IT domain, would not link to a `.vercel.app` host, and your real mail provider would not threaten rejection in 24 hours.

## After the demo — what to teach

End on the defenses, not the attacks. Suggested takeaways:

1. **Check the URL before typing a password.** Type the domain yourself instead of clicking.
2. **Enable MFA everywhere.** A captured password alone is not enough to get in.
3. **Hover before you click.** The visible text and the actual link are often different.
4. **Slow down on urgency.** "24 hours," "account suspended," "mailbox full" are pressure tactics.
5. **Report, don't delete.** Forward suspicious mail to IT so they can warn others.

## Notes

- The capture store is in-memory only — it resets when the serverless function cold-starts. This is intentional: you don't want training data persisted.
- The dashboard endpoint is unauthenticated for simplicity. If you're paranoid, add a Vercel password-protection rule or a simple shared-secret header check in `api/captured.js`.
- No real credentials should ever be entered into this page. Use obviously fake ones during the demo (`demo@acmecorp.com` / `Password123!`).
