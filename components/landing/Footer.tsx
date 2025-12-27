"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background-dark border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg shadow-primary/30">
                <span className="material-symbols-outlined text-white text-lg">shield</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ReliOps AI</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
              AI-powered incident response platform that helps SRE teams resolve issues faster and prevent future incidents.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <span className="material-symbols-outlined text-lg">mail</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <span className="material-symbols-outlined text-lg">code</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#integrations" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="/signup" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ReliOps AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

