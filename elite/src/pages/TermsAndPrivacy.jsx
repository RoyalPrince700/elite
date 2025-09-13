import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Lock, Mail, Phone } from 'lucide-react';

const TermsAndPrivacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-12">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center text-blue-200 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">Terms of Service & Privacy Policy</h1>
            <p className="text-blue-200 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-32 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Terms of Service</h2>
              </div>
              <p className="text-gray-600">
                Our service agreement, usage policies, and legal terms for using EliteRetoucher services.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-800">Privacy Policy</h2>
              </div>
              <p className="text-gray-600">
                How we collect, use, and protect your personal information and images.
              </p>
            </div>
          </div>

          {/* Terms of Service Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-6">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">Terms of Service</h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h3>
                <p className="mb-4">
                  By accessing and using EliteRetoucher's services, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">2. Service Description</h3>
                <p className="mb-4">
                  EliteRetoucher provides professional photo retouching services including but not limited to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Portrait and headshot retouching</li>
                  <li>Product photography enhancement</li>
                  <li>Real estate and architectural photo editing</li>
                  <li>Wedding and event photography retouching</li>
                  <li>Commercial and advertising image processing</li>
                  <li>Color correction and grading</li>
                  <li>Background removal and manipulation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts</h3>
                <p className="mb-4">
                  To access our services, you must create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Providing accurate and current information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">4. Payment Terms</h3>
                <p className="mb-4">
                  Payment terms vary by service:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Pay-per-Image:</strong> Payment due before processing begins</li>
                  <li><strong>Subscriptions:</strong> Monthly/annually billed in advance</li>
                  <li><strong>Refunds:</strong> Processed within 30 days for eligible services</li>
                  <li><strong>Late Payments:</strong> May result in service suspension</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h3>
                <p className="mb-4">
                  <strong>Your Rights:</strong> You retain ownership of your original images and content.
                </p>
                <p className="mb-4">
                  <strong>Our Rights:</strong> We retain ownership of our retouching techniques, processes, and any derivative works created during the service.
                </p>
                <p className="mb-4">
                  <strong>Usage Rights:</strong> By submitting images, you grant us permission to process and store them for service delivery.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">6. Service Quality & Revisions</h3>
                <p className="mb-4">
                  We strive for excellence in all our work. Our revision policy includes:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Up to 3 revisions per image included in standard pricing</li>
                  <li>Additional revisions available at standard rates</li>
                  <li>48-hour turnaround time for revisions</li>
                  <li>Quality guarantee on all completed work</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">7. Prohibited Content</h3>
                <p className="mb-4">
                  The following content is strictly prohibited:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Illegal, harmful, or offensive material</li>
                  <li>Copyright-infringing content</li>
                  <li>Images containing identifiable minors without consent</li>
                  <li>Content that violates laws or regulations</li>
                  <li>Misleading or deceptive material</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">8. Termination</h3>
                <p className="mb-4">
                  Either party may terminate this agreement at any time. Upon termination:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>All outstanding payments become immediately due</li>
                  <li>We will complete any work-in-progress</li>
                  <li>You may download your processed images</li>
                  <li>Account data may be retained as required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h3>
                <p className="mb-4">
                  EliteRetoucher shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our services.
                  Our total liability shall not exceed the amount paid for the specific service in question.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">10. Governing Law</h3>
                <p className="mb-4">
                  This agreement shall be governed by and construed in accordance with the laws of [Your Jurisdiction],
                  without regard to its conflict of law provisions.
                </p>
              </section>
            </div>
          </div>

          {/* Privacy Policy Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center mb-6">
              <Lock className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">Privacy Policy</h2>
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">1. Information We Collect</h3>

                <h4 className="text-xl font-semibold text-gray-800 mb-3">Personal Information:</h4>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Billing and payment information</li>
                  <li>Account credentials and preferences</li>
                  <li>Communication history and support tickets</li>
                </ul>

                <h4 className="text-xl font-semibold text-gray-800 mb-3">Technical Information:</h4>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Device information and screen resolution</li>
                  <li>Usage patterns and analytics data</li>
                </ul>

                <h4 className="text-xl font-semibold text-gray-800 mb-3">Image Data:</h4>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Original images uploaded for processing</li>
                  <li>Processed and edited versions</li>
                  <li>Metadata associated with images</li>
                  <li>Processing history and version control</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h3>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Service Delivery:</strong> Process and deliver photo retouching services</li>
                  <li><strong>Account Management:</strong> Create and maintain user accounts</li>
                  <li><strong>Communication:</strong> Send service updates, invoices, and support responses</li>
                  <li><strong>Quality Improvement:</strong> Analyze usage patterns to improve our services</li>
                  <li><strong>Legal Compliance:</strong> Meet legal obligations and protect our rights</li>
                  <li><strong>Security:</strong> Prevent fraud and maintain platform security</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">3. Data Storage & Security</h3>
                <p className="mb-4">
                  <strong>Secure Storage:</strong> All data is stored using industry-standard encryption and security measures.
                </p>
                <p className="mb-4">
                  <strong>Cloud Infrastructure:</strong> We use secure cloud storage providers with enterprise-grade security.
                </p>
                <p className="mb-4">
                  <strong>Access Controls:</strong> Strict access controls limit data access to authorized personnel only.
                </p>
                <p className="mb-4">
                  <strong>Regular Backups:</strong> Automated backups ensure data integrity and availability.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">4. Image Privacy & Rights</h3>
                <p className="mb-4">
                  <strong>Your Images:</strong> You retain full ownership and copyright of your original images.
                </p>
                <p className="mb-4">
                  <strong>Processing:</strong> Images are processed only for the purpose of providing our retouching services.
                </p>
                <p className="mb-4">
                  <strong>Confidentiality:</strong> Your images are treated as confidential and never shared without permission.
                </p>
                <p className="mb-4">
                  <strong>Deletion:</strong> Images can be permanently deleted upon your request.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Sharing & Third Parties</h3>
                <p className="mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share information only in these circumstances:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted partners who help operate our service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                  <li><strong>Business Protection:</strong> To protect our rights and prevent fraud</li>
                  <li><strong>Consent:</strong> With your explicit permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">6. Cookies & Tracking</h3>
                <p className="mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Remember your login status and preferences</li>
                  <li>Analyze website usage and performance</li>
                  <li>Provide personalized user experiences</li>
                  <li>Maintain session security</li>
                </ul>
                <p className="mb-4">
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights & Choices</h3>
                <p className="mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">8. Data Retention</h3>
                <p className="mb-4">
                  We retain your information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside mb-4 space-y-2">
                  <li>Provide our services and fulfill contractual obligations</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records for accounting purposes</li>
                </ul>
                <p className="mb-4">
                  Inactive accounts may be deleted after a reasonable period of inactivity.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">9. International Data Transfers</h3>
                <p className="mb-4">
                  Your information may be transferred to and processed in countries other than your own.
                  We ensure appropriate safeguards are in place to protect your data during such transfers.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">10. Changes to This Policy</h3>
                <p className="mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes
                  by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">11. Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Email: eliteretoucher@gmail.com</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Phone: +234 708 754 6988</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Phone: +234 706 736 7631</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Questions About Our Terms or Privacy?</h3>
            <p className="text-gray-600 text-center mb-6">
              If you have any questions or concerns about our Terms of Service or Privacy Policy,
              please don't hesitate to reach out to our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors text-center font-medium"
              >
                Contact Us
              </Link>
              <a
                href="mailto:eliteretoucher@gmail.com"
                className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md transition-colors text-center font-medium"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacy;
