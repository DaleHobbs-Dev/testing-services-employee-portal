import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-mint-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">TS</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-700">
                  Testing Services
                </h3>
                <p className="text-xs text-gray-500">Employee Portal</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Managing examinations and testing appointments with excellence.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} Testing Services. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/new-appointment"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  New Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/proctoring"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Proctoring Schedule
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@testingcenter.edu"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Help Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                >
                  Report an Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-purple-600 transition-colors"
            >
              Accessibility
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Made with</span>
            <span className="text-purple-500">💜</span>
            <span>by the Testing Center Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
