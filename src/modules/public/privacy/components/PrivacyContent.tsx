export function PrivacyContent() {
  return (
    <div className="space-y-12 font-sans text-zinc-300 text-sm leading-relaxed">
      <section
        id="information-collected"
        className="space-y-4 font-mono scroll-mt-10"
      >
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          1. Information We Collect
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          We collect information to provide, maintain, and improve our
          engineering platform. This includes account registration details (such
          as your full name, professional email address, username, and avatar),
          organization workspace metadata, project repositories, issue tracking
          logs, sprint history, and interaction metrics across our web
          application and APIs.
        </p>
      </section>

      <section
        id="use-of-information"
        className="space-y-4 font-mono scroll-mt-10"
      >
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          2. How We Use Information
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          The data we collect is utilized strictly to deliver platform
          functionality, authenticate sessions, route push notifications via
          Firebase, process invitation workflows, execute automated background
          tasks via Celery and Redis, and monitor system performance,
          reliability, and security integrity.
        </p>
      </section>

      <section
        id="workspaces-organizations"
        className="space-y-4 font-mono scroll-mt-10"
      >
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          3. Organizations & Data Sharing
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          Vurn operates on multi-tenant subdomain architectures. Information
          regarding your membership, role, activity timestamps, and assigned
          project items is visible to authorized administrators and members
          within your specific organization workspace. We do not sell your
          personal or corporate repository data to external third parties.
        </p>
      </section>

      <section id="ai-processing" className="space-y-4 font-mono scroll-mt-10">
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          4. AI & Machine Learning Processing
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          When you utilize AI-powered features such as automated task
          breakdowns, story point estimations, duplicate issue checks, or sprint
          summaries, relevant issue text and metadata are processed through our
          AI inference pipelines. Your proprietary code and private ticket
          descriptions are not utilized to train public foundational language
          models without explicit enterprise consent.
        </p>
      </section>

      <section id="data-security" className="space-y-4 font-mono scroll-mt-10">
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          5. Data Security & Encryption
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          We implement rigorous technical and organizational security measures
          to protect your data against unauthorized access, alteration,
          disclosure, or destruction. This includes secure password hashing
          mechanics, encrypted database connections, tokenized authentication
          sessions, and isolated AWS EC2 infrastructure environments protected
          by Nginx and modern firewall configurations.
        </p>
      </section>

      <section
        id="cookies-tracking"
        className="space-y-4 font-mono scroll-mt-10"
      >
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          6. Cookies & Tracking Technologies
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          We use essential session cookies, local storage tokens, and
          authentication state flags (such as session persistence keys) to
          maintain your logged-in state, remember keyboard shortcut
          configurations, and manage user interface preferences across your
          browser sessions.
        </p>
      </section>

      <section id="data-retention" className="space-y-4 font-mono scroll-mt-24">
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          7. Data Retention & Deletion
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          We retain your personal data and organization records for as long as
          your account remains active or as needed to provide services. If you
          delete your account or organization workspace, associated data is
          scheduled for secure purging from our primary operational databases in
          accordance with standard data recovery and compliance windows.
        </p>
      </section>

      <section id="user-rights" className="space-y-4 font-mono scroll-mt-24">
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          8. Your Privacy Rights
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          Depending on your jurisdiction, you have the right to access, correct,
          export, or request the deletion of your personal data. You may update
          your user profile information directly through your personal settings
          or submit formal data request inquiries through our compliance portal.
        </p>
      </section>

      <section
        id="contact-privacy"
        className="space-y-4 font-mono scroll-mt-24"
      >
        <h2 className="text-lg font-bold text-white font-mono border-b border-white/10 pb-2">
          9. Contact Compliance
        </h2>
        <p className="font-sans text-zinc-400 leading-relaxed">
          If you have questions, concerns, or grievances regarding this Privacy
          Policy or our data handling practices, please contact our Data
          Protection Officer at{" "}
          <span className="text-primary font-mono">vurn.noreply@gmail.com</span>
          .
        </p>
      </section>
    </div>
  );
}
